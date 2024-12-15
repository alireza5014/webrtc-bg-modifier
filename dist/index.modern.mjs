class t{constructor(){this.scriptLoaded=!1,this.segmentation=null,this.url=null,this.camera=null,this.backgroundImage=null,this.color=null,this.stream=null,this.brightness=1,this.contrast=1,this.grayScale=!1,this.blur=0,this.videoElement=document.createElement("video"),this.canvasElement=document.createElement("canvas")}setBackgroundImage2(t){return this.backgroundImage=t,this}getBackgroundImage(){return this.backgroundImage}setBrightness(t){return this.brightness=+t,this}setContrast(t){return this.contrast=+t,this}setBlur(t){return this.blur=+t+"px",this}setGrayScale(t){return this.grayScale=t,this}setStream(t){return this.stream=t,this}setBackgroundImage(t){return this.url=t,this.color=null,this}setBackgroundColor(t){return this.color=t,this}async appendScriptToHead(t,{async:e=!0,defer:a=!1,callback:s=()=>{}}={}){var i=this;if(this.scriptLoaded)return void await s();const n=document.createElement("script");n.src=t,n.async=e,n.defer=a,n.onload=async function(){i.scriptLoaded=!0,await s()},n.onerror=()=>console.error(`Failed to load script: ${t}`),document.head.appendChild(n)}applyBackgroundImage(t,e){const{videoWidth:a,videoHeight:s}=this.videoElement;t.clearRect(0,0,a,s),t.filter=`brightness(${this.brightness}) contrast(${this.contrast}) blur(${this.blur})`,t.drawImage(e.segmentationMask,0,0,a,s),t.globalCompositeOperation="source-out",t.drawImage(this.getBackgroundImage()?this.getBackgroundImage():this.videoElement,0,0,a,s),t.globalCompositeOperation="destination-atop",t.filter=`brightness(${this.brightness}) contrast(${this.contrast})`,t.drawImage(e.image,0,0,a,s)}applyBrightnessAndContrast(t){t.filter=`brightness(${this.brightness}) contrast(${this.contrast}) `}applyBackgroundColor(t,e){const{videoWidth:a,videoHeight:s}=this.videoElement;t.clearRect(0,0,a,s),t.drawImage(e.segmentationMask,0,0,a,s),t.globalCompositeOperation="source-out",t.fillStyle=this.color,t.fillRect(0,0,a,s),t.globalCompositeOperation="destination-atop",t.drawImage(e.image,0,0,a,s)}applyGrayscale(t){const{videoWidth:e,videoHeight:a}=this.videoElement,s=t.getImageData(0,0,e,a),i=s.data;for(let t=0;t<i.length;t+=4)i[t]=i[t+1]=i[t+2]=(i[t]+i[t+1]+i[t+2])/3;t.putImageData(s,0,0)}backgroundList(){return{color:[{value:"#F9C0AB",alt:"#F9C0AB"},{value:"#F4E0AF",alt:"#F4E0AF"},{value:"#A8CD89",alt:"#A8CD89"},{value:"#355F2E",alt:"#355F2E"}],image:[{value:"img/1.jpg",alt:"Image 1"},{value:"img/2.jpg",alt:"Image 2"},{value:"img/3.jpg",alt:"Image 3"}]}}async setupSegmentation(t){var e=this;const a=this.getBackgroundImage();await this.appendScriptToHead("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",{async:!0,callback:async function(){if(!e.segmentation){e.segmentation=new SelfieSegmentation({locateFile:t=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${t}`}),e.segmentation.setOptions({selfieMode:!0,modelSelection:0}),e.segmentation.onResults(s=>{console.log(s),e.color?(e.applyBackgroundColor(t,s),e.applyBrightnessAndContrast(t)):e.applyBackgroundImage(t,s,a),e.grayScale&&e.applyGrayscale(t)}),await e.segmentation.initialize();const s=async function t(){await e.segmentation.send({image:e.videoElement}),requestAnimationFrame(t)};await s()}}})}async changeBackground(){console.log(this.url,"11111"),this.videoElement.srcObject||(this.videoElement.srcObject=this.stream,this.videoElement.play(),await new Promise(t=>this.videoElement.onloadeddata=t));const{videoWidth:t,videoHeight:e}=this.videoElement;this.canvasElement.width=t,this.canvasElement.height=e;const a=this.canvasElement.getContext("2d");var s;if(!(this.url||this.grayScale||1!==this.brightness||1!==this.contrast||this.color||this.blur))return null==(s=this.camera)||s.stop(),this.stream;let i=null;return this.url&&(i=new Image,i.src=this.url,await new Promise(t=>i.onload=t),this.setBackgroundImage2(i)),this.setBackgroundImage2(i),await this.setupSegmentation(a),this.canvasElement.captureStream(24)}}export{t as default};
//# sourceMappingURL=index.modern.mjs.map
