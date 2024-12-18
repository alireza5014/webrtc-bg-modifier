class WebrtcBgModifier {
    constructor({chatAgent = null}) {

        console.log(chatAgent,"chatAgent2")

        this.scriptLoaded = false;
        this.segmentation = null;
        this.bgUrl = null;
        this.backgroundImage = null;
        this.color = null;
        this.chatAgent = chatAgent;
        this.stream = null;
        this.processing = false;
        this.brightness = 1;
        this.contrast = 1;
        this.grayScale = false;
        this.blur = 0;
        this.fps = 24;
        this.ctx = null;
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);

        this.videoInfo = {videoWidth: 640, videoHeight: 480};
        this.videoElement = document.createElement("video");
        this.canvasElement = document.createElement("canvas");
        this.reaction = []
        this.lastPushTime = 0;
    }


//private methods
    drawReaction() {
        if (this.reaction) {
            this.reaction.map(data=>{

             this.ctx.globalCompositeOperation = 'source-over';
            const now = performance.now();
            const elapsed = now - data.startTime;
            // Remove the reaction if the duration has passed
            if (elapsed > data.duration) {
                data = null;
                return;
            }
            // Calculate the fade-out effect (optional)
            const progress = elapsed / data.duration;
            this.ctx.globalAlpha = 1 - progress;

            // Calculate the vertical movement (move from down to up)
            const moveUpDistance = 300 * progress; // Adjust the distance as needed
            const shakeAmount = 5 * Math.sin(now / 100); // Shake effect (change frequency as needed)

            // Apply the shake and move-up effects to the position
            const x = data.x + shakeAmount;
            const y = data.y - moveUpDistance;

            this.ctx.font = "88px Arial"; // Adjust size as needed
            this.ctx.fillText(data.emoji, x, y);

            // Reset globalAlpha for other drawings
            this.ctx.globalAlpha = 1;
            })

        }
    }

    // Initializes the segmentation process
    async setupSegmentation() {
        const backgroundImage = this.getBackgroundImage()
        await this.appendScriptToHead('https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js', {
            async: true,
            callback: async () => {

                if (!this.segmentation) {
                    this.segmentation = new SelfieSegmentation({
                        // locateFile: (file) => `/node_modules/@mediapipe/selfie_segmentation/${file}`,
                        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
                    });


                    this.videoElement.width = this.isMobile ? 480 : 1280;
                    this.videoElement.height = this.isMobile ? 360 : 720;

                    this.segmentation.setOptions({
                        modelSelection: 1,  // 1 means use the full-body segmentation model
                        outputStride: 16,
                        segmentBody: true,
                        selfieMode: false,
                        // modelSelection: this.isMobile ? 0 : 1, // Full model for desktops
                    });


                    this.segmentation.onResults((results) => {
                        console.log(results)
                        if (this.color) {
                            this.applyBackgroundColor(results);
                            this.applyBrightnessAndContrast();
                        } else {
                            this.applyBackgroundImage(results, backgroundImage);

                        }
                        this.applyGrayscale();
                        // this.applyBrightnessAndContrast(ctx);
                    });


                    let lastFrameTime = 0;

                    const processVideo = async () => {
                        if (this.processing) {
                            const now = performance.now();
                            if (now - lastFrameTime >= 1000 / this.fps) {
                                lastFrameTime = now;
                                await this.segmentation.send({image: this.videoElement});
                            }
                        }

                        requestAnimationFrame(processVideo);
                    };

                    await processVideo();


                }

            },
        });
    }

    // Setters for background properties
    setBackgroundImage2(value) {
        this.backgroundImage = value;
        return this;
    }

    // Appends a script to the document head, ensuring it loads only once
    async appendScriptToHead(src, {
        async = true, defer = false, callback = () => {
        }
    } = {}) {
        if (this.scriptLoaded) {
            await callback();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        script.onload = async () => {
            this.scriptLoaded = true;
            await callback();
        };
        script.onerror = () => console.error(`Failed to load script: ${src}`);
        document.head.appendChild(script);
    }

    // Handles background image replacement logic
    applyBackgroundImage(results) {

        const {videoWidth: width, videoHeight: height} = this.videoInfo;
        // Check if segmentationMask and background are required to be drawn
        if (!results.segmentationMask || !this.getBackgroundImage() && !this.videoElement) {
            return; // No background or segmentation to apply, return early
        }





         // this.ctx.globalCompositeOperation = 'destination-over';

         // this.ctx.clearRect(0, 0, width, height);
         this.ctx.drawImage(results.segmentationMask, 0, 0, width, height);
        this.ctx.globalCompositeOperation = 'source-out';

        this.ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`;


        this.ctx.drawImage(this.getBackgroundImage() ? this.getBackgroundImage() : this.videoElement, 0, 0, width, height);

        this.drawReaction();

        this.ctx.globalCompositeOperation = 'destination-atop';
        this.ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast})`

         this.ctx.drawImage(results.image, 0, 0, width, height);


    }

    // Adjusts brightness and contrast for the video
    applyBrightnessAndContrast() {
        this.ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) `;
    }

    // Applies a solid background color
    applyBackgroundColor(results) {

        const {videoWidth: width, videoHeight: height} = this.videoInfo;

        // this.ctx.clearRect(0, 0, width, height);

        this.ctx.drawImage(results.segmentationMask, 0, 0, width, height);

        this.ctx.globalCompositeOperation = 'source-out';

        if (this.color !== this.ctx.fillStyle) {
            this.ctx.fillStyle = this.color;
        }

        this.ctx.fillRect(0, 0, width, height);
        this.drawReaction();

        this.ctx.globalCompositeOperation = 'destination-atop';

        this.ctx.drawImage(results.image, 0, 0, width, height);


    }

    // Applies a grayscale effect
    applyGrayscale() {
        if (this.grayScale) {
            const {videoWidth: width, videoHeight: height} = this.videoInfo;
            const imageData = this.ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }

            this.ctx.putImageData(imageData, 0, 0);
        }
    }

// end private methods




    addReaction(emoji, x = 0, y = 0, duration = 2000) {

        if(!this.segmentation){
            console.error("Please use reaction after segmentation is available.");
        }else{
            const currentTime = performance.now();

            if (currentTime - this.lastPushTime >= 1000) {
                this.reaction.push({
                    emoji,
                    x,
                    y,
                    startTime: performance.now(),
                    duration
                })
                this.lastPushTime = currentTime;

            }
            else{
                console.log("Waiting for 1 second to pass before adding another reaction.");

            }
         }

        return this;
    }

    setFps(value) {
        this.fps = value;
        return this;
    }

    getBackgroundImage() {
        return this.backgroundImage
    }

    setBrightness(value) {
        this.brightness = +value;
        return this;
    }

    setContrast(value) {
        this.contrast = +value;
        return this;
    }

    setBlur(value) {
        this.blur = +value + "px";
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

    setBackgroundImage(bgUrl) {
        this.bgUrl = bgUrl;
        this.color = null;
        return this;
    }

    setBackgroundColor(color) {
        this.color = color;
        this.bgUrl = null;

        return this;
    }

    // Generates a list of available backgrounds
    backgroundList() {
        return {
            reactions: [
                {value: '🎉'},
                {value: '❤️'},
                {value: '👍️'},
                {value: '😊'},
                {value: '😎'},
                {value: '👎'},
            ],
            color: [
                {value: '#f9c0ab', alt: '#F9C0AB'},
                {value: '#f4e0af', alt: '#F4E0AF'},
                {value: '#a8cd89', alt: '#A8CD89'},
                {value: '#355f2e', alt: '#355F2E'},
            ],
            image: [
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/1.jpg', alt: 'Image 1'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/2.jpg', alt: 'Image 2'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/3.jpg', alt: 'Image 113'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/4.jpg', alt: 'Image 113'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/5.webp', alt: 'Image 113'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/6.jpg', alt: 'Image 113'},
                {value: 'https://alireza5014.github.io/webrtc-bg-modifier/example/img/7.webp', alt: 'Image 113'},
            ],
        };
    }

    // Main function to modify the video stream
    async changeBackground() {
        // this.stream=chatAgent.deviceManager().mediaStreams.getVideoInput();
        this.chatAgent.deviceManager().grantUserMediaDevicesPermissions({video: {width: this.videoInfo.videoWidth,height: this.videoInfo.videoHeight, framerate: 10}},     (result)=> {
            console.log(result, "result")
            this.stream=result.videoStream
        if (!this.videoElement.srcObject) {
            this.videoElement.srcObject = this.stream;
              this.videoElement.play();
            // await new Promise((resolve) => (this.videoElement.onloadeddata = resolve));
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.videoInfo = {videoWidth: this.videoElement.videoWidth, videoHeight: this.videoElement.videoHeight};
            });
            const {videoWidth: width, videoHeight: height} = this.videoInfo;
            this.canvasElement.width = width;
            this.canvasElement.height = height;
            this.ctx = this.canvasElement.getContext('2d');
        }


        if (!this.bgUrl && !this.grayScale && this.brightness === 1 && this.contrast === 1 && !this.color && !this.blur) {
            this.processing = false;
            this.chatAgent.replaceVideoStream(this.stream)

            return this.stream; // No modifications, return original stream
        }

        let backgroundImage = null;
        if (this.bgUrl) {
            backgroundImage = new Image();
            backgroundImage.crossOrigin = 'anonymous';
            backgroundImage.src = this.bgUrl;
            // await new Promise((resolve) => (backgroundImage.onload = resolve));
        }
        this.processing = true
        this.setBackgroundImage2(backgroundImage)
        this.setupSegmentation();
        const newStream= this.canvasElement.captureStream(this.fps);

        this.chatAgent.replaceVideoStream(newStream)
        return  newStream;
        })
    }

    async makePreview() {
            if (!this.videoElement.srcObject) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.play();
                // await new Promise((resolve) => (this.videoElement.onloadeddata = resolve));
                this.videoElement.addEventListener('loadedmetadata', () => {
                    this.videoInfo = {videoWidth: this.videoElement.videoWidth, videoHeight: this.videoElement.videoHeight};
                });
                const {videoWidth: width, videoHeight: height} = this.videoInfo;
                this.canvasElement.width = width;
                this.canvasElement.height = height;
                this.ctx = this.canvasElement.getContext('2d');
            }

             if (!this.bgUrl && !this.grayScale && this.brightness === 1 && this.contrast === 1 && !this.color && !this.blur  ) {
                this.processing = false;

                return this.stream; // No modifications, return original stream
            }

            let backgroundImage = null;
            if (this.bgUrl) {
                backgroundImage = new Image();
                backgroundImage.crossOrigin = 'anonymous';
                backgroundImage.src = this.bgUrl;
                // await new Promise((resolve) => (backgroundImage.onload = resolve));
            }
            this.processing = true
            this.setBackgroundImage2(backgroundImage)
            this.setupSegmentation();
            const newStream= this.canvasElement.captureStream(this.fps);

            return  newStream;

    }

}

export default WebrtcBgModifier;