let bgUrl = null
let newStream = null
const outputVideo = document.getElementById("output");
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
// grantUserMedia
const stream = await navigator.mediaDevices.getUserMedia({
    video: isMobile ? {
        width: { ideal: 640, max: 640 },   // Ideal width for mobile (480p or 360p)
        height: { ideal: 480, max: 480 },  // Ideal height for mobile (480p)
        frameRate: { max: 24 },            // Max frame rate for better performance
        facingMode: "user",         // Use the selfie camera
        aspectRatio: { ideal: 1.33 },
    } : true,
});
outputVideo.srcObject = stream
outputVideo.play();
import WebrtcBgModifier from "../dist/index.module.js";

const bgModifier = new WebrtcBgModifier({});

document.getElementById('brightnessRange').addEventListener('change', async function () {
    console.log(bgModifier, "bgModifier")
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setBrightness(value).setStream(stream).makePreview();
});

document.getElementById('contrastRange').addEventListener('change', async function () {
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(null).setContrast(value).setStream(stream).makePreview();
});

document.getElementById('blurRange').addEventListener('change', async function () {
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(null).setBlur(value).setStream(stream).makePreview();
});
document.getElementById('fpsRange').addEventListener('change', async function () {
    const value = this.value;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setFps(value).setStream(stream).makePreview();
});

document.getElementById('grayScaleSwitch').addEventListener('change', async function () {
    const value = this.checked;
    outputVideo.srcObject = await bgModifier.setBackgroundImage(bgUrl).setGrayScale(value).setStream(stream).makePreview();
});
// Get the webcam video stream


window.changeBg = async function (url) {
    bgUrl = url;
    newStream = await bgModifier.setBackgroundImage(url).setBlur(0).setStream(stream).makePreview();
    outputVideo.srcObject = newStream;

};
window.addReaction = async function (emoji,x=0,y=0,duration=0) {

    bgModifier.addReaction(emoji,100,300,3000)

};
window.changeBgColor = async function (color) {

    newStream = await bgModifier.setBackgroundColor(color).setStream(stream).makePreview();
    outputVideo.srcObject = newStream;

};


const bgListItems = bgModifier.backgroundList()
let bgListHtml ='';
bgListHtml +='<div class="items">';
bgListHtml += bgListItems.reactions.map(d =>
    `<div   onclick="addReaction('${d.value}')" style="font-size: 70px;"> ${d.value}</div>`
).join('')
bgListHtml +='</div>';
bgListHtml +='<div class="items">';

bgListHtml+=`<div onclick="changeBg(null)"> <video width="100px"   autoplay playsinline id="default-video" /> </div>`
bgListHtml += bgListItems.color.map(d =>
    `<div onclick="changeBgColor('${d.value}')">
                        <div style="width: 100px; height: 80px; background: ${d.value}; display: flex; align-items: center; justify-content: center; color: #333; border: 1px solid #ddd; border-radius: 8px;">
                            ${d.alt}
                        </div>
                    </div>`
).join('')
bgListHtml +='</div>';
bgListHtml +='<div class="items">';

bgListHtml += bgListItems.image.map(d =>
    `<div onclick="changeBg('${d.value}')">
                        <img width="100" src="${d.value}" alt="${d.alt}" style="border: 1px solid #ddd; border-radius: 8px;">
                    </div>`
)
    .join('');
bgListHtml +='</div>';


document.getElementById("bg-list").innerHTML = bgListHtml

const defaultVideo = document.getElementById("default-video");
defaultVideo.srcObject = stream
defaultVideo.play();
changeBg(null)