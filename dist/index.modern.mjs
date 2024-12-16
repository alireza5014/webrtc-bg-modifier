class t{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.processing=!1,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.fps=24,this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setFps(t){return this.fps=t,this}setBackgroundImage2(t){return this.backgroundImage=t,this}getBackgroundImage(){return this.backgroundImage}setBrightness(t){return this.brightness=+t,alert(t),this}setContrast(t){return this.contrast=+t,this}setBlur(t){return this.blur=+t+"px",this}setGrayScale(t){return this.grayScale=t,this}setStream(t){return this.stream=t,this}setBackgroundImage(t){return this.url=t,this.color=null,this}setBackgroundColor(t){return this.color=t,this}async appendScriptToHead(t,{async:e=!0,defer:i=!1,callback:a=()=>{}}={}){var s=this;if(this.scriptLoaded)return void await a();const n=document.createElement("script");n.src=t,n.async=e,n.defer=i,n.onload=async function(){s.scriptLoaded=!0,await a()},n.onerror=()=>console.error(`Failed to load script: ${t}`),document.head.appendChild(n)}applyBackgroundImage(t,e){const{videoWidth:i,videoHeight:a}=this.videoElement;t.clearRect(0,0,i,a),t.filter=`brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`,t.drawImage(e.segmentationMask,0,0,i,a),t.globalCompositeOperation="source-out",t.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,i,a),t.globalCompositeOperation="destination-atop",t.filter=`brightness(${this.brightness}) contrast(${this.contrast})`,t.drawImage(e.image,0,0,i,a)}applyBrightnessAndContrast(t){t.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(t,e){const{videoWidth:i,videoHeight:a}=this.videoElement;t.clearRect(0,0,i,a),t.drawImage(e.segmentationMask,0,0,i,a),t.globalCompositeOperation="source-out",t.fillStyle=this.color,t.fillRect(0,0,i,a),t.globalCompositeOperation="destination-atop",t.drawImage(e.image,0,0,i,a)}applyGrayscale(t){const{videoWidth:e,videoHeight:i}=this.videoElement,a=t.getImageData(0,0,e,i),s=a.data;for(let t=0;t<s.length;t+=4)s[t]=s[t+1]=s[t+2]=(s[t]+s[t+1]+s[t+2])/3;t.putImageData(a,0,0)}backgroundList(){return{color:[{value:"#F9C0AB",alt:"#F9C0AB"},{value:"#F4E0AF",alt:"#F4E0AF"},{value:"#A8CD89",alt:"#A8CD89"},{value:"#355F2E",alt:"#355F2E"}],image:[{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/1.jpg",alt:"Image 1"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/2.jpg",alt:"Image 2"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/3.jpg",alt:"Image 113"},{value:"https://alireza5014.github.io/webrtc-bg-modifier/example/img/4.jpg",alt:"Image 113"}]}}async setupSegmentation(t){var e=this;const i=this.getBackgroundImage();await this.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:async function(){if(!e.segmentation){e.segmentation=new SelfieSegmentation({locateFile:t=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${t}`});const a=/Mobi|Android/i.test(navigator.userAgent);e.videoElement.width=a?480:1280,e.videoElement.height=a?360:720,e.segmentation.setOptions({selfieMode:!1,modelSelection:a?0:1}),e.segmentation.onResults(a=>{console.log(a),e.color?(e.applyBackgroundColor(t,a),e.applyBrightnessAndContrast(t)):e.applyBackgroundImage(t,a,i),e.grayScale&&e.applyGrayscale(t)});let s=0;const n=async function t(){if(e.processing){const t=performance.now();t-s>=1e3/e.fps&&(s=t,await e.segmentation.send({image:e.videoElement}))}requestAnimationFrame(t)};await n()}}})}async changeBackground(){this.videoElement.srcObject||(this.videoElement.srcObject=this.stream,this.videoElement.play(),await new Promise(t=>this.videoElement.onloadeddata=t));const{videoWidth:t,videoHeight:e}=this.videoElement;this.canvasElement.width=t,this.canvasElement.height=e;const i=this.canvasElement.getContext("2d");if(!(this.url||this.grayScale||1!==this.brightness||1!==this.contrast||this.color||this.blur))return this.processing=!1,this.stream;let a=null;return this.url&&(a=new Image,a.crossOrigin="anonymous",a.src=this.url,await new Promise(t=>a.onload=t)),this.processing=!0,this.setBackgroundImage2(a),await this.setupSegmentation(i),this.canvasElement.captureStream(this.fps)}}export{t as default};
//# sourceMappingURL=index.modern.mjs.map
