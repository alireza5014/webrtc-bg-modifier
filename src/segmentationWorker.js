onmessage = async (event) => {
    const canvas = event.data.canvas;
    const ctx = canvas.getContext('2d');

    const processVideo = async () => {
        await segmentation.send({ image: videoElement });
        requestAnimationFrame(processVideo);
    };

    await processVideo();
};