class WebrtcBgModifier {
    constructor() {
        this.scriptLoaded = false;
        this.segmentation = null;
        this.url = null;
        this.camera = null;
        this.backgroundImage = null;
        this.color = null;
        this.stream = null;
        this.processing = false;
        this.brightness = 1;
        this.contrast = 1;
        this.grayScale = false;
        this.blur = 0;
        this.fps = 24;
        this.videoElement = document.createElement("video");
        this.canvasElement = document.createElement("canvas");
    }
    setFps(value) {
        this.fps = value;
        return this;
    }
    // Setters for background properties
    setBackgroundImage2(value) {
        this.backgroundImage = value;
        return this;
    }

    getBackgroundImage() {
        return this.backgroundImage
    }

    setBrightness(value) {
        this.brightness = +value;
        alert(value)

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

    setBackgroundImage(url) {
        this.url = url;
        this.color = null;
        return this;
    }

    setBackgroundColor(color) {
        this.color = color;

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
    applyBackgroundImage(ctx, results) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        ctx.clearRect(0, 0, width, height);
        ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`;

        ctx.drawImage(results.segmentationMask, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-out';

        ctx.drawImage(this.getBackgroundImage() ? this.getBackgroundImage() : this.videoElement, 0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-atop';

        ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast})`
        ctx.drawImage(results.image, 0, 0, width, height);

    }

    // Adjusts brightness and contrast for the video
    applyBrightnessAndContrast(ctx) {
        ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) `;
    }

    // Applies a solid background color
    applyBackgroundColor(ctx, results) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(results.segmentationMask, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-out';
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(results.image, 0, 0, width, height);
    }


    // Applies a grayscale effect
    applyGrayscale(ctx) {
        const {videoWidth: width, videoHeight: height} = this.videoElement;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Generates a list of available backgrounds
    backgroundList() {
        return {
            color: [
                {value: '#F9C0AB', alt: '#F9C0AB'},
                {value: '#F4E0AF', alt: '#F4E0AF'},
                {value: '#A8CD89', alt: '#A8CD89'},
                {value: '#355F2E', alt: '#355F2E'},
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

    // Initializes the segmentation process
    async setupSegmentation(ctx) {
        const backgroundImage = this.getBackgroundImage()
        await this.appendScriptToHead('https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js', {
            async: true,
            callback: async () => {
                if (!this.segmentation) {
                    this.segmentation = new SelfieSegmentation({
                        // locateFile: (file) => `/node_modules/@mediapipe/selfie_segmentation/${file}`,
                        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
                    });
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);


                    this.videoElement.width = isMobile ? 480 : 1280;
                    this.videoElement.height = isMobile ? 360 : 720;

                    this.segmentation.setOptions({
                        selfieMode: false,
                        modelSelection: isMobile ? 0 : 1, // Full model for desktops
                    });


                    this.segmentation.onResults((results) => {
                        console.log(results)
                        if (this.color) {
                            this.applyBackgroundColor(ctx, results);
                            this.applyBrightnessAndContrast(ctx);
                        } else {
                            this.applyBackgroundImage(ctx, results, backgroundImage);

                        }

                        if (this.grayScale) {
                            this.applyGrayscale(ctx);
                        }
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

    // Main function to modify the video stream
    async changeBackground() {

        if (!this.videoElement.srcObject) {
            this.videoElement.srcObject = this.stream;
            this.videoElement.play();
            await new Promise((resolve) => (this.videoElement.onloadeddata = resolve));

        }


        const {videoWidth: width, videoHeight: height} = this.videoElement;
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        const ctx = this.canvasElement.getContext('2d');

        if (!this.url && !this.grayScale && this.brightness === 1 && this.contrast === 1 && !this.color && !this.blur) {
            this.processing = false;
            // this.camera?.stop()

            return this.stream; // No modifications, return original stream
        }

        let backgroundImage = null;
        if (this.url) {
            backgroundImage = new Image();
            backgroundImage.crossOrigin = 'anonymous';
            backgroundImage.src = this.url;
            await new Promise((resolve) => (backgroundImage.onload = resolve));
            // this.setBackgroundImage2(backgroundImage)

        }
        this.processing = true
        this.setBackgroundImage2(backgroundImage)
        await this.setupSegmentation(ctx);
        return this.canvasElement.captureStream(this.fps);
    }
}

export default WebrtcBgModifier;