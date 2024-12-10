let bgUrl = null
document.getElementById('brightnessRange').addEventListener('change', function () {
    const value = this.value;
    bgModifier.setBackgroundImage(bgUrl).setBrightness(value).setStream(stream).changeBackground(outputVideo);
});

document.getElementById('contrastRange').addEventListener('change', function () {
    const value = this.value;
    bgModifier.setBackgroundImage(bgUrl).setContrast(value).setStream(stream).changeBackground(outputVideo);
});

document.getElementById('grayScaleSwitch').addEventListener('change', function () {
    const value = this.checked;
    bgModifier.setBackgroundImage(bgUrl).setGrayScale(value).setStream(stream).changeBackground(outputVideo);
});
// Get the webcam video stream
const stream = await navigator.mediaDevices.getUserMedia({video: true});
const outputVideo = document.getElementById("output");
outputVideo.srcObject = stream
outputVideo.play();


import WebrtcBgModifier from "../dist/index.module.js";

const bgModifier = new WebrtcBgModifier();
window.changeBg = function (url) {
    bgUrl = url;
    bgModifier.setBackgroundImage(url).setStream(stream).changeBackground(outputVideo);
};
window.changeBgColor = function (color) {
    bgModifier.setBackgroundColor(color).setStream(stream).changeBackground(outputVideo);
};


let bgListHtml = bgModifier.backgroundList()
    .map(item =>
        [
            ...item.color.map(d =>
                `<div onclick="changeBgColor('${d.value}')">
                    <div style="width: 100px; height: 80px; background: ${d.value}; display: flex; align-items: center; justify-content: center; color: #333; border: 1px solid #ddd; border-radius: 8px;">
                        ${d.alt}
                    </div>
                </div>`
            ),
            ...item.image.map(d =>
                `<div onclick="changeBg('${d.value}')">
                    <img width="100" src="${d.value}" alt="${d.alt}" style="border: 1px solid #ddd; border-radius: 8px;">
                </div>`
            )
        ].join('')
    )
    .join('');

bgListHtml += `<div onclick="changeBg(null)"> <video width="100px"   autoplay playsinline id="default-video" /> </div>`;
document.getElementById("bg-list").innerHTML = bgListHtml
bgModifier.setStream(stream).changeBackground(outputVideo);

const defaultVideo = document.getElementById("default-video");

defaultVideo.srcObject = stream
defaultVideo.play();