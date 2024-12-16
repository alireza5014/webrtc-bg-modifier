class e{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.processing=!1,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.fps=24,this.ctx=null,this.videoInfo={videoWidth:640,videoHeight:480},this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setFps(e){return this.fps=e,this}setBackgroundImage2(e){return this.backgroundImage=e,this}getBackgroundImage(){return this.backgroundImage}setBrightness(e){return this.brightness=+e,this}setContrast(e){return this.contrast=+e,this}setBlur(e){return this.blur=+e+"px",this}setGrayScale(e){return this.grayScale=e,this}setStream(e){return this.stream=e,this}setBackgroundImage(e){return this.url=e,this.color=null,this}setBackgroundColor(e){return this.color=e,this}appendScriptToHead(e,{async:t=!0,defer:i=!1,callback:n=()=>{}}={}){try{let r;const s=this;function o(o){if(r)return o;const a=document.createElement("script");a.src=e,a.async=t,a.defer=i,a.onload=function(){try{return s.scriptLoaded=!0,Promise.resolve(n()).then(function(){})}catch(e){return Promise.reject(e)}},a.onerror=()=>console.error(`Failed to load script: ${e}`),document.head.appendChild(a)}const a=function(){if(s.scriptLoaded)return Promise.resolve(n()).then(function(){r=1})}();return Promise.resolve(a&&a.then?a.then(o):o(a))}catch(c){return Promise.reject(c)}}applyBackgroundImage(e){const{videoWidth:t,videoHeight:i}=this.videoInfo;this.ctx.filter=`brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`,this.ctx.drawImage(e.segmentationMask,0,0,t,i),this.ctx.globalCompositeOperation="source-out",this.ctx.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,t,i),this.ctx.globalCompositeOperation="destination-atop",this.ctx.filter=`brightness(${this.brightness}) contrast(${this.contrast})`,this.ctx.drawImage(e.image,0,0,t,i)}applyBrightnessAndContrast(){this.ctx.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(e){const{videoWidth:t,videoHeight:i}=this.videoInfo;this.ctx.drawImage(e.segmentationMask,0,0,t,i),this.ctx.globalCompositeOperation="source-out",this.ctx.fillStyle=this.color,this.ctx.fillRect(0,0,t,i),this.ctx.globalCompositeOperation="destination-atop",this.ctx.drawImage(e.image,0,0,t,i)}applyGrayscale(){const{videoWidth:e,videoHeight:t}=this.videoInfo,i=this.ctx.getImageData(0,0,e,t),n=i.data;for(let e=0;e<n.length;e+=4)n[e]=n[e+1]=n[e+2]=(n[e]+n[e+1]+n[e+2])/3;this.ctx.putImageData(i,0,0)}backgroundList(){return{color:[{value:"#F9C0AB",alt:"#F9C0AB"},{value:"#F4E0AF",alt:"#F4E0AF"},{value:"#A8CD89",alt:"#A8CD89"},{value:"#355F2E",alt:"#355F2E"}],image:[{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/1.jpg",alt:"Image 1"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/2.jpg",alt:"Image 2"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/3.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/4.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/5.webp",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/6.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/7.webp",alt:"Image 113"}]}}setupSegmentation(e){try{const e=this,t=e.getBackgroundImage();return Promise.resolve(e.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:function(){try{const i=function(){if(!e.segmentation){e.segmentation=new SelfieSegmentation({locateFile:e=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${e}`});const i=/Mobi|Android/i.test(navigator.userAgent);e.videoElement.width=i?480:1280,e.videoElement.height=i?360:720,e.segmentation.setOptions({selfieMode:!1,modelSelection:i?0:1}),e.segmentation.onResults(i=>{e.color?(e.applyBackgroundColor(i),e.applyBrightnessAndContrast()):e.applyBackgroundImage(i,t),e.grayScale&&e.applyGrayscale()});let n=0;const r=function(){try{function t(){requestAnimationFrame(r)}const i=function(){if(e.processing){const t=performance.now(),i=function(){if(t-n>=1e3/e.fps)return n=t,Promise.resolve(e.segmentation.send({image:e.videoElement})).then(function(){})}();if(i&&i.then)return i.then(function(){})}}();return Promise.resolve(i&&i.then?i.then(t):t())}catch(s){return Promise.reject(s)}};return Promise.resolve(r()).then(function(){})}}();return Promise.resolve(i&&i.then?i.then(function(){}):void 0)}catch(e){return Promise.reject(e)}}})).then(function(){})}catch(e){return Promise.reject(e)}}changeBackground(){try{const e=this;function t(){const{videoWidth:t,videoHeight:i}=e.videoInfo;if(e.canvasElement.width=t,e.canvasElement.height=i,e.ctx=e.canvasElement.getContext("2d"),!(e.url||e.grayScale||1!==e.brightness||1!==e.contrast||e.color||e.blur))return e.processing=!1,e.stream;let n=null;return e.url&&(n=new Image,n.crossOrigin="anonymous",n.src=e.url),e.processing=!0,e.setBackgroundImage2(n),e.setupSegmentation(),e.canvasElement.captureStream(e.fps)}const i=function(){if(!e.videoElement.srcObject)return e.videoElement.srcObject=e.stream,Promise.resolve(e.videoElement.play()).then(function(){e.videoElement.addEventListener("loadedmetadata",()=>{e.videoInfo={videoWidth:e.videoElement.videoWidth,videoHeight:e.videoElement.videoHeight}})})}();return Promise.resolve(i&&i.then?i.then(t):t())}catch(n){return Promise.reject(n)}}}export{e as default};
//# sourceMappingURL=index.module.js.map
