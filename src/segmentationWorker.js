

const targetFPS = 12;
let lastFrameTime = 0;

const processVideo = async () => {

    const segmentation = event.data.segmentation;
    const videoElement = event.data.videoElement;
    const now = performance.now();
    if (now - lastFrameTime >= 1000 / targetFPS) {
        lastFrameTime = now;
        await  segmentation.send({ image: videoElement });
    }

    requestAnimationFrame(processVideo);
};

await processVideo();