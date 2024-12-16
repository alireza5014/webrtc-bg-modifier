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
        this.ctx = null;
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);

        this.videoInfo = {videoWidth: 640, videoHeight: 480};
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
    applyBackgroundImage(results) {

        const {videoWidth: width, videoHeight: height} = this.videoInfo;
        // this.ctx.clearRect(0, 0, width, height);
        this.ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`;
        this.ctx.drawImage(results.segmentationMask, 0, 0, width, height);
        this.ctx.globalCompositeOperation = 'source-out';
        this.ctx.drawImage(this.getBackgroundImage() ? this.getBackgroundImage() : this.videoElement, 0, 0, width, height);
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
        this.ctx.globalCompositeOperation = 'destination-atop';
        this.ctx.drawImage(results.image, 0, 0, width, height);
    }


    // Applies a grayscale effect
    applyGrayscale() {
        const ctx = this.ctx;
        const {videoWidth: width, videoHeight: height} = this.videoInfo;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    // Generates a list of available backgrounds
    backgroundList() {
        return {
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


                    this.videoElement.width = this.isMobile ? 480 : 1280;
                    this.videoElement.height = this.isMobile ? 360 : 720;

                    this.segmentation.setOptions({
                        selfieMode: false,
                        modelSelection: this.isMobile ? 0 : 1, // Full model for desktops
                    });


                    this.segmentation.onResults((results) => {
                        // console.log(results)
                        if (this.color) {
                            this.applyBackgroundColor(results);
                            this.applyBrightnessAndContrast();
                        } else {
                            this.applyBackgroundImage(results, backgroundImage);

                        }

                        if (this.grayScale) {
                            this.applyGrayscale();
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
            await this.videoElement.play();
            // await new Promise((resolve) => (this.videoElement.onloadeddata = resolve));
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.videoInfo = {videoWidth: this.videoElement.videoWidth, videoHeight: this.videoElement.videoHeight};
            });
            const {videoWidth: width, videoHeight: height} = this.videoInfo;
            this.canvasElement.width = width;
            this.canvasElement.height = height;
            this.ctx = this.canvasElement.getContext('2d');
        }


        if (!this.url && !this.grayScale && this.brightness === 1 && this.contrast === 1 && !this.color && !this.blur) {
            this.processing = false;
            return this.stream; // No modifications, return original stream
        }

        let backgroundImage = null;
        if (this.url) {
            backgroundImage = new Image();
            backgroundImage.crossOrigin = 'anonymous';
            backgroundImage.src = this.url;
            // await new Promise((resolve) => (backgroundImage.onload = resolve));

        }
        this.processing = true
        this.setBackgroundImage2(backgroundImage)
        this.setupSegmentation();
        return this.canvasElement.captureStream(this.fps);
    }
}

export default WebrtcBgModifier;