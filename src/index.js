class WebrtcBgModifier {
    constructor() {
        this.scriptLoaded = false;
        this.url = null;
        this.color = null;
        this.stream = null;
        this.brightness = 1;
        this.contrast = 1;
        this.grayScale = false;
        this.videoElement = document.createElement("video");
        this.canvasElement = document.createElement("canvas");

    }

    setBrightness(value) {
        this.brightness = +value;

         return this;
    }

    setContrast(value) {
        this.contrast = +value;
        return this;
    }

    setGrayScale(value) {
        this.grayScale = value;
        return this;
    }

    setStream(stream) {
        this.stream = stream;
        return this;
    }

    setBackgroundImage(url) {
        this.url = url;
        this.color = null;
        return this;
    }

    setBackgroundColor(color) {
        this.color = color;
        return this;
    }

    // Appends a script to the document head, ensuring it is loaded only once
    async appendScriptToHead(src, {
        async = true, defer = false, callback = () => {
        }
    } = {}) {
        if (this.scriptLoaded) {
            callback();
            return;
        }
        ; // Skip if the script is already loaded

        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        script.onload = () => {
            this.scriptLoaded = true;
            callback();
        };
        script.onerror = () => console.error(`Failed to load script: ${src}`);
        document.head.appendChild(script);
    }

    changeVideoBackgroundImage(ctx, results, backgroundImage) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        ctx.clearRect(0, 0, width, height);
        if (backgroundImage) {
            ctx.drawImage(results.segmentationMask, 0, 0, width, height);
            ctx.globalCompositeOperation = 'source-out';
            ctx.drawImage(backgroundImage, 0, 0, width, height);
            ctx.globalCompositeOperation = 'destination-atop';

        } else {
            ctx.drawImage(this.videoElement, 0, 0, width, height);

        }
        ctx.drawImage(results.image, 0, 0, width, height);
    }

    changeVideoBrightnessAndContrast(ctx) {
        ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast})`;
    }


    changeVideoBackgroundColor(ctx, results) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(results.segmentationMask, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-out';
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(results.image, 0, 0, width, height);


    }


    makeVideoGray(ctx) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        // Get the image data of the frame
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Apply grayscale filter to each pixel
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]; // Red
            const g = data[i + 1]; // Green
            const b = data[i + 2]; // Blue
            const avg = (r + g + b) / 3; // Average of red, green, and blue to create grayscale

            data[i] = avg; // Set red to the average
            data[i + 1] = avg; // Set green to the average
            data[i + 2] = avg; // Set blue to the average
        }

        // Put the modified image data back to the canvas
        ctx.putImageData(imageData, 0, 0);
    }

    // Initializes segmentation process for a given video and canvas
    async setupSegmentation(ctx, backgroundImage) {
        await this.appendScriptToHead('../src/selfie_segmentation.js', {
            async: true,
            defer: false,
            callback: async () => {
                const segmentation = new SelfieSegmentation({
                    locateFile: (file) => `/node_modules/@mediapipe/selfie_segmentation/${file}`,
                });

                segmentation.setOptions({modelSelection: 1});

                segmentation.onResults((results) => {


                    if(this.color){
                        this.changeVideoBackgroundColor(ctx, results)

                    }else
                    {
                        this.changeVideoBackgroundImage(ctx, results, backgroundImage)

                    }

                    if (this.grayScale) {
                        this.makeVideoGray(ctx)
                    }
                    this.changeVideoBrightnessAndContrast(ctx)


                });

                await segmentation.initialize();

                const processVideo = async () => {
                    await segmentation.send({image: this.videoElement});
                    requestAnimationFrame(processVideo);
                };

                await processVideo();
            }
        });
    }

    // Returns a list of available background images
    backgroundList() {
        return [{
            color: [
                {value: '#F9C0AB', alt: '#355F2E'},
                {value: '#F4E0AF', alt: '#F4E0AF'},
                {value: '#A8CD89', alt: '#A8CD89'},
                {value: '#355F2E', alt: '#355F2E'},
            ],
            image: [
                {value: 'img/1.jpg', alt: 'image 1'},
                {value: 'img/2.jpg', alt: 'image 2'},
                {value: 'img/3.jpg', alt: 'image 3'},
            ]
        }
        ];
    }

    // Replaces the video track of an existing stream with a new video track
    async updateVideoTrack(oldStream, newStream) {
        if (!oldStream || !newStream) {
            console.error("Old stream or new video track is missing!");
            return;
        }

        const oldVideoTrack = oldStream.getVideoTracks()[1];
        const newVideoTrack = newStream.getVideoTracks()[0];

        try {
            oldVideoTrack && await oldStream.removeTrack(oldVideoTrack);
            await oldStream.addTrack(newVideoTrack);
            console.log("Video track replaced successfully.");
        } catch (error) {
            console.error("Error replacing video track:", error);
        }
    }

    // Main function for replacing the background in the video stream and setting it to the output video
    async changeBackground(outputVideo) {


        console.log(this.brightness,this.contrast)

        this.videoElement.srcObject = this.stream;
        this.videoElement.play();

        await new Promise((resolve) => (this.videoElement.onloadeddata = resolve));

        const {videoWidth: width, videoHeight: height} = this.videoElement;
        this.canvasElement.height = height;
        this.canvasElement.width = width;
        const ctx = this.canvasElement.getContext('2d');


        if ((this.url === 'null' || this.url === null) && !this.grayScale && this.brightness === 1 && this.contrast === 1 && !this.color) {
            outputVideo.srcObject = this.stream;
            return this.stream; // No background image, return the original stream
        }
        let backgroundImage = null
        if (this.url && this.url !== 'null') {
            backgroundImage = new Image();
            backgroundImage.src = this.url;
            await new Promise((resolve) => (backgroundImage.onload = resolve));

        }

        await this.setupSegmentation(ctx, backgroundImage);

        const processedStream = this.canvasElement.captureStream(30);

        outputVideo.srcObject = processedStream;
        // outputVideo.load();

        return processedStream;
    }
}

export default WebrtcBgModifier