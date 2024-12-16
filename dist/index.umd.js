!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self).webrtcBgModifier=t()}(this,function(){return class{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.processing=!1,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.fps=24,this.videoInfo={videoWidth:640,videoHeight:480},this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setFps(e){return this.fps=e,this}setBackgroundImage2(e){return this.backgroundImage=e,this}getBackgroundImage(){return this.backgroundImage}setBrightness(e){return this.brightness=+e,this}setContrast(e){return this.contrast=+e,this}setBlur(e){return this.blur=+e+"px",this}setGrayScale(e){return this.grayScale=e,this}setStream(e){return this.stream=e,this}setBackgroundImage(e){return this.url=e,this.color=null,this}setBackgroundColor(e){return this.color=e,this}appendScriptToHead(e,{async:t=!0,defer:i=!1,callback:n=()=>{}}={}){try{let o;const r=this;function s(s){if(o)return s;const a=document.createElement("script");a.src=e,a.async=t,a.defer=i,a.onload=function(){try{return r.scriptLoaded=!0,Promise.resolve(n()).then(function(){})}catch(e){return Promise.reject(e)}},a.onerror=()=>console.error(`Failed to load script: ${e}`),document.head.appendChild(a)}const a=function(){if(r.scriptLoaded)return Promise.resolve(n()).then(function(){o=1})}();return Promise.resolve(a&&a.then?a.then(s):s(a))}catch(l){return Promise.reject(l)}}applyBackgroundImage(e,t){const{videoWidth:i,videoHeight:n}=this.videoInfo;e.filter=`brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`,e.drawImage(t.segmentationMask,0,0,i,n),e.globalCompositeOperation="source-out",e.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,i,n),e.globalCompositeOperation="destination-atop",e.filter=`brightness(${this.brightness}) contrast(${this.contrast})`,e.drawImage(t.image,0,0,i,n)}applyBrightnessAndContrast(e){e.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(e,t){const{videoWidth:i,videoHeight:n}=this.videoInfo;e.drawImage(t.segmentationMask,0,0,i,n),e.globalCompositeOperation="source-out",e.fillStyle=this.color,e.fillRect(0,0,i,n),e.globalCompositeOperation="destination-atop",e.drawImage(t.image,0,0,i,n)}applyGrayscale(e){const{videoWidth:t,videoHeight:i}=this.videoInfo,n=e.getImageData(0,0,t,i),o=n.data;for(let e=0;e<o.length;e+=4)o[e]=o[e+1]=o[e+2]=(o[e]+o[e+1]+o[e+2])/3;e.putImageData(n,0,0)}backgroundList(){return{color:[{value:"#F9C0AB",alt:"#F9C0AB"},{value:"#F4E0AF",alt:"#F4E0AF"},{value:"#A8CD89",alt:"#A8CD89"},{value:"#355F2E",alt:"#355F2E"}],image:[{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/1.jpg",alt:"Image 1"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/2.jpg",alt:"Image 2"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/3.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/4.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/5.webp",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/6.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/7.webp",alt:"Image 113"}]}}setupSegmentation(e){try{const t=this,i=t.getBackgroundImage();return Promise.resolve(t.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:function(){try{const n=function(){if(!t.segmentation){t.segmentation=new SelfieSegmentation({locateFile:e=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${e}`});const n=/Mobi|Android/i.test(navigator.userAgent);t.videoElement.width=n?480:1280,t.videoElement.height=n?360:720,t.segmentation.setOptions({selfieMode:!1,modelSelection:n?0:1}),t.segmentation.onResults(n=>{t.color?(t.applyBackgroundColor(e,n),t.applyBrightnessAndContrast(e)):t.applyBackgroundImage(e,n,i),t.grayScale&&t.applyGrayscale(e)});let o=0;const r=function(){try{function e(){requestAnimationFrame(r)}const i=function(){if(t.processing){const e=performance.now(),i=function(){if(e-o>=1e3/t.fps)return o=e,Promise.resolve(t.segmentation.send({image:t.videoElement})).then(function(){})}();if(i&&i.then)return i.then(function(){})}}();return Promise.resolve(i&&i.then?i.then(e):e())}catch(n){return Promise.reject(n)}};return Promise.resolve(r()).then(function(){})}}();return Promise.resolve(n&&n.then?n.then(function(){}):void 0)}catch(e){return Promise.reject(e)}}})).then(function(){})}catch(e){return Promise.reject(e)}}changeBackground(){try{const e=this;function t(){return e.processing=!0,e.setBackgroundImage2(r),Promise.resolve(e.setupSegmentation(o)).then(function(){return e.canvasElement.captureStream(e.fps)})}e.videoElement.srcObject||(e.videoElement.srcObject=e.stream,e.videoElement.play(),e.videoElement.addEventListener("loadedmetadata",()=>{console.log({videoWidth:e.videoElement.videoWidth,videoHeight:e.videoElement.videoHeight},"jjjjjjjj"),e.videoInfo={videoWidth:e.videoElement.videoWidth,videoHeight:e.videoElement.videoHeight}}));const{videoWidth:i,videoHeight:n}=e.videoInfo;e.canvasElement.width=i,e.canvasElement.height=n;const o=e.canvasElement.getContext("2d");if(!(e.url||e.grayScale||1!==e.brightness||1!==e.contrast||e.color||e.blur))return e.processing=!1,Promise.resolve(e.stream);let r=null;const s=function(){if(e.url)return r=new Image,r.crossOrigin="anonymous",r.src=e.url,Promise.resolve(new Promise(e=>r.onload=e)).then(function(){})}();return Promise.resolve(s&&s.then?s.then(t):t())}catch(a){return Promise.reject(a)}}}});
//# sourceMappingURL=index.umd.js.map
