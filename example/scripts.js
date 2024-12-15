let bgUrl = null
let newStream = null
const outputVideo = document.getElementById("output");
const stream = await navigator.mediaDevices.getUserMedia({
    video: {
        width: { ideal: 640 },  // Lower resolution for mobile
        height: { ideal: 480 },
        frameRate: { max: 24 }
    },
});
outputVideo.srcObject = stream
outputVideo.play();
import WebrtcBgModifier from "../dist/index.module.js";
const bgModifier = new WebrtcBgModifier();
document.getElementById('brightnessRange').addEventListener('change', async function () {
    console.log(bgModifier,"bgModifier")
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setBrightness(value).setStream(stream).changeBackground();
});

document.getElementById('contrastRange').addEventListener('change', async function () {
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setContrast(value).setStream(stream).changeBackground();
});

document.getElementById('blurRange').addEventListener('change', async function () {
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setBlur(value).setStream(stream).changeBackground();
});

document.getElementById('grayScaleSwitch').addEventListener('change', async function () {
    const value = this.checked;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setGrayScale(value).setStream(stream).changeBackground();
});
// Get the webcam video stream



window.changeBg = async function (url) {
    bgUrl = url;
    newStream = await bgModifier.setBackgroundImage(url).setStream(stream).changeBackground();
    outputVideo.srcObject = newStream;

};
window.changeBgColor = async function (color) {
    newStream = await bgModifier.setBackgroundColor(color).setStream(stream).changeBackground();
    outputVideo.srcObject = newStream;

};


const bgListItems = bgModifier.backgroundList()
let bgListHtml = `<div onclick="changeBg(null)"> <video width="100px"   autoplay playsinline id="default-video" /> </div>`;

bgListHtml += bgListItems.color.map(d =>
    `<div onclick="changeBgColor('${d.value}')">
                        <div style="width: 100px; height: 80px; background: ${d.value}; display: flex; align-items: center; justify-content: center; color: #333; border: 1px solid #ddd; border-radius: 8px;">
                            ${d.alt}
                        </div>
                    </div>`
).join('')
bgListHtml += bgListItems.image.map(d =>
    `<div onclick="changeBg('${d.value}')">
                        <img width="100" src="${d.value}" alt="${d.alt}" style="border: 1px solid #ddd; border-radius: 8px;">
                    </div>`
)
    .join('');

document.getElementById("bg-list").innerHTML = bgListHtml

const defaultVideo = document.getElementById("default-video");
defaultVideo.srcObject = stream
defaultVideo.play();