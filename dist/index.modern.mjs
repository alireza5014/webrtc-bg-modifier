class t{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.processing=!1,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.fps=24,this.ctx=null,this.isMobile=/Mobi|Android/i.test(navigator.userAgent),this.videoInfo={videoWidth:640,videoHeight:480},this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setFps(t){return this.fps=t,this}setBackgroundImage2(t){return this.backgroundImage=t,this}getBackgroundImage(){return this.backgroundImage}setBrightness(t){return this.brightness=+t,this}setContrast(t){return this.contrast=+t,this}setBlur(t){return this.blur=+t+"px",this}setGrayScale(t){return this.grayScale=t,this}setStream(t){return this.stream=t,this}setBackgroundImage(t){return this.url=t,this.color=null,this}setBackgroundColor(t){return this.color=t,this}async appendScriptToHead(t,{async:e=!0,defer:i=!1,callback:a=()=>{}}={}){var s=this;if(this.scriptLoaded)return void await a();const o=document.createElement("script");o.src=t,o.async=e,o.defer=i,o.onload=async function(){s.scriptLoaded=!0,await a()},o.onerror=()=>console.error(`Failed to load script: ${t}`),document.head.appendChild(o)}applyBackgroundImage(t){const{videoWidth:e,videoHeight:i}=this.videoInfo;t.segmentationMask&&(this.getBackgroundImage()||this.videoElement)&&(this.ctx.drawImage(t.segmentationMask,0,0,e,i),this.ctx.globalCompositeOperation="source-out",this.ctx.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,e,i),this.ctx.globalCompositeOperation="destination-atop",this.ctx.drawImage(t.image,0,0,e,i))}applyBrightnessAndContrast(){this.ctx.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(t){const{videoWidth:e,videoHeight:i}=this.videoInfo;this.ctx.drawImage(t.segmentationMask,0,0,e,i),this.ctx.globalCompositeOperation="source-out",this.color!==this.ctx.fillStyle&&(this.ctx.fillStyle=this.color),this.ctx.fillRect(0,0,e,i),this.ctx.globalCompositeOperation="destination-atop",this.ctx.drawImage(t.image,0,0,e,i)}applyGrayscale(){const{videoWidth:t,videoHeight:e}=this.videoInfo,i=this.ctx.getImageData(0,0,t,e),a=i.data;for(let t=0;t<a.length;t+=4)a[t]=a[t+1]=a[t+2]=(a[t]+a[t+1]+a[t+2])/3;this.ctx.putImageData(i,0,0)}backgroundList(){return{color:[{value:"#f9c0ab",alt:"#F9C0AB"},{value:"#f4e0af",alt:"#F4E0AF"},{value:"#a8cd89",alt:"#A8CD89"},{value:"#355f2e",alt:"#355F2E"}],image:[{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/1.jpg",alt:"Image 1"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/2.jpg",alt:"Image 2"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/3.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/4.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/5.webp",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/6.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/7.webp",alt:"Image 113"}]}}async setupSegmentation(t){var e=this;const i=this.getBackgroundImage();await this.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:async function(){if(!e.segmentation){e.segmentation=new SelfieSegmentation({locateFile:t=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${t}`}),e.videoElement.width=e.isMobile?480:1280,e.videoElement.height=e.isMobile?360:720,e.segmentation.setOptions({selfieMode:!1,modelSelection:e.isMobile?0:1}),e.segmentation.onResults(t=>{e.color?(e.applyBackgroundColor(t),e.applyBrightnessAndContrast()):e.applyBackgroundImage(t,i),e.grayScale&&e.applyGrayscale()});let t=0;const a=async function i(){if(e.processing){const i=performance.now();i-t>=1e3/e.fps&&(t=i,await e.segmentation.send({image:e.videoElement}))}requestAnimationFrame(i)};await a()}}})}async changeBackground(){if(!this.videoElement.srcObject){this.videoElement.srcObject=this.stream,await this.videoElement.play(),this.videoElement.addEventListener("loadedmetadata",()=>{this.videoInfo={videoWidth:this.videoElement.videoWidth,videoHeight:this.videoElement.videoHeight}});const{videoWidth:t,videoHeight:e}=this.videoInfo;this.canvasElement.width=t,this.canvasElement.height=e,this.ctx=this.canvasElement.getContext("2d")}if(!(this.url||this.grayScale||1!==this.brightness||1!==this.contrast||this.color||this.blur))return this.processing=!1,this.stream;let t=null;return this.url&&(t=new Image,t.crossOrigin="anonymous",t.src=this.url),this.processing=!0,this.setBackgroundImage2(t),this.setupSegmentation(),this.canvasElement.captureStream(this.fps)}}export{t as default};
//# sourceMappingURL=index.modern.mjs.map
