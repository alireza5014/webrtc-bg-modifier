module.exports=class{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setBackgroundImage2(e){return this.backgroundImage=e,this}getBackgroundImage(){return this.backgroundImage}setBrightness(e){return this.brightness=+e,this}setContrast(e){return this.contrast=+e,this}setBlur(e){return this.blur=+e+"px",this}setGrayScale(e){return this.grayScale=e,this}setStream(e){return this.stream=e,this}setBackgroundImage(e){return this.url=e,this.color=null,this}setBackgroundColor(e){return this.color=e,this}appendScriptToHead(e,{async:t=!0,defer:n=!1,callback:r=()=>{}}={}){try{let o;const s=this;function i(i){if(o)return i;const a=document.createElement("script");a.src=e,a.async=t,a.defer=n,a.onload=function(){try{return s.scriptLoaded=!0,Promise.resolve(r()).then(function(){})}catch(e){return Promise.reject(e)}},a.onerror=()=>console.error(`Failed to load script: ${e}`),document.head.appendChild(a)}const a=function(){if(s.scriptLoaded)return Promise.resolve(r()).then(function(){o=1})}();return Promise.resolve(a&&a.then?a.then(i):i(a))}catch(c){return Promise.reject(c)}}applyBackgroundImage(e,t){const{videoWidth:n,videoHeight:r}=this.videoElement;e.clearRect(0,0,n,r),e.filter=`brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`,e.drawImage(t.segmentationMask,0,0,n,r),e.globalCompositeOperation="source-out",e.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,n,r),e.globalCompositeOperation="destination-atop",e.filter=`brightness(${this.brightness}) contrast(${this.contrast})`,e.drawImage(t.image,0,0,n,r)}applyBrightnessAndContrast(e){e.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(e,t){const{videoWidth:n,videoHeight:r}=this.videoElement;e.clearRect(0,0,n,r),e.drawImage(t.segmentationMask,0,0,n,r),e.globalCompositeOperation="source-out",e.fillStyle=this.color,e.fillRect(0,0,n,r),e.globalCompositeOperation="destination-atop",e.drawImage(t.image,0,0,n,r)}applyGrayscale(e){const{videoWidth:t,videoHeight:n}=this.videoElement,r=e.getImageData(0,0,t,n),o=r.data;for(let e=0;e<o.length;e+=4)o[e]=o[e+1]=o[e+2]=(o[e]+o[e+1]+o[e+2])/3;e.putImageData(r,0,0)}backgroundList(){return{color:[{value:"#F9C0AB",alt:"#F9C0AB"},{value:"#F4E0AF",alt:"#F4E0AF"},{value:"#A8CD89",alt:"#A8CD89"},{value:"#355F2E",alt:"#355F2E"}],image:[{value:"img/1.jpg",alt:"Image 1"},{value:"img/2.jpg",alt:"Image 2"},{value:"img/3.jpg",alt:"Image 3"}]}}setupSegmentation(e){try{const t=this,n=t.getBackgroundImage();return Promise.resolve(t.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:function(){try{const r=function(){if(!t.segmentation)return t.segmentation=new SelfieSegmentation({locateFile:e=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${e}`}),t.segmentation.setOptions({selfieMode:!0,modelSelection:0}),t.segmentation.onResults(r=>{console.log(r),t.color?(t.applyBackgroundColor(e,r),t.applyBrightnessAndContrast(e)):t.applyBackgroundImage(e,r,n),t.grayScale&&t.applyGrayscale(e)}),Promise.resolve(t.segmentation.initialize()).then(function(){const e=function(){try{const n=performance.now();return Promise.resolve(t.segmentation.send({image:t.videoElement})).then(function(){const t=performance.now()-n,r=Math.max(0,1e3/24-t);setTimeout(()=>requestAnimationFrame(e),r)})}catch(e){return Promise.reject(e)}};return Promise.resolve(e()).then(function(){})})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(e){return Promise.reject(e)}}})).then(function(){})}catch(e){return Promise.reject(e)}}changeBackground(){try{const e=this;function t(){function t(){return e.setBackgroundImage2(s),Promise.resolve(e.setupSegmentation(o)).then(function(){return e.canvasElement.captureStream(24)})}const{videoWidth:n,videoHeight:r}=e.videoElement;e.canvasElement.width=n,e.canvasElement.height=r;const o=e.canvasElement.getContext("2d");if(!(e.url||e.grayScale||1!==e.brightness||1!==e.contrast||e.color||e.blur))return e.camera?.stop(),e.stream;let s=null;const i=function(){if(e.url)return s=new Image,s.src=e.url,Promise.resolve(new Promise(e=>s.onload=e)).then(function(){e.setBackgroundImage2(s)})}();return i&&i.then?i.then(t):t()}console.log(e.url,"11111");const n=function(){if(!e.videoElement.srcObject)return e.videoElement.srcObject=e.stream,e.videoElement.play(),Promise.resolve(new Promise(t=>e.videoElement.onloadeddata=t)).then(function(){})}();return Promise.resolve(n&&n.then?n.then(t):t())}catch(r){return Promise.reject(r)}}};
//# sourceMappingURL=index.js.map
