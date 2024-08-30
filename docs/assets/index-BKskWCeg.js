(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const a="data-pm-carousel",E=`${a}-paging`,P=`${a}-wrapper`,_=`${a}-overflow`,v=`${a}-item`,y=`${a}-prev`,w=`${a}-next`,S=`${a}-playstop`,b="transform .5s ease-in-out",h="is-active",x={playstop:function(){this.nodes.playstop&&(this.nodes.playstop.hidden=!this.currentSettings.autoplay)},wrapper:function(){const e=this.currentSettings.noStartSpace?0:this.currentSettings.spaceAround;this.nodes.overflow.style.transform=`translateX(${this.activePage*-100+e}%)`,this.currentSettings.noStartSpace?this.nodes.overflow.style.paddingRight=this.currentSettings.spaceAround+"%":(this.nodes.overflow.style.paddingRight=e+"%",this.nodes.overflow.style.paddingLeft=e+"%"),this.nodes.overflow.style.transition=b,this.nodes.overflow.style.display="flex",this.nodes.wrapper.style.overflow="hidden",this.el.classList.add(h)},slides:function(){const e=[];for(this.nodes.items.forEach((t,s)=>{t.setAttribute("tabindex","-1"),t.setAttribute(a+"-item",s),t.style.flex=`1 0 ${100/this.currentSettings.group}%`,t.style.overflow="hidden"});this.nodes.items.length>0;)e.push(this.nodes.items.splice(0,this.currentSettings.group));this.nodes.items=e,this.pagesLength=this.nodes.items.length},paging:function(){if(!this.nodes.paging)return;let e,t;const s=document.createDocumentFragment();this.nodes.paging.innerHTML="",this.nodes.pages=[],this.nodes.items.forEach((i,n)=>{t=this.nodes.pagingTpl.innerHTML,e=document.createElement("div"),e.innerHTML=t.replace("{nbr}",++n),this.nodes.pages.push(e.firstElementChild),s.appendChild(e.firstElementChild)}),this.nodes.paging.append(s),this.nodes.paging.hidden=!1}};function M(){["slides","wrapper","playstop","paging"].forEach(t=>x[t].call(this))}function g(){this.activePage=0,this._interval=null,this.autoplayStatus="stop",this._metrics={touchstartX:0,touchmoveX:0,moveX:0,slideWidth:0},M.call(this),this.changeActive(this.activePage),this.currentSettings.autoplay>1&&this.nodes.playstop?(this.autoplayStatus="play",this.play()):this.stop()}function $(){this._metrics.slideWidth=this.visibleSlides[0].offsetWidth*this.currentSettings.group,this._metrics.distance=this.activePage*this._metrics.slideWidth,this.activePage===this.pagesLength-1&&(this._metrics.distance=this.nodes.overflow.scrollWidth-this._metrics.slideWidth,this.currentSettings.spaceAround&&(this._metrics.distance-=parseInt(window.getComputedStyle(this.nodes.overflow).getPropertyValue("padding-right"),10))),this.nodes.overflow.style.transform=`translateX(${-this._metrics.distance}px`}function q(){this.nodes.prev&&(this.nodes.prev.innerHTML=this._templates.prev.tpl.replace("{text}",this.activePage===0?this._templates.prev.lastLabel:this._templates.prev.label),this.currentSettings.loop?this.nodes.prev.hidden=!1:this.nodes.prev.hidden=this.activePage===0)}function O(){this.nodes.next&&(this.nodes.next.innerHTML=this._templates.next.tpl.replace("{text}",this.activePage===this.pagesLength-1?this._templates.next.lastLabel:this._templates.next.label),this.currentSettings.loop?this.nodes.next.hidden=!1:this.nodes.next.hidden=this.activePage===this.pagesLength-1)}function W(){this.visibleSlides=[],this.nodes.paging&&this.nodes.pages.forEach((e,t)=>{let s=e;const i=e.querySelector("button");i&&(s=i),t===this.activePage?(s.setAttribute("aria-current","true"),e.classList.add(h)):(s.removeAttribute("aria-current"),e.classList.remove(h))}),this.nodes.items.forEach((e,t)=>{e.forEach((s,i)=>{t===this.activePage?(i===0&&this.autoplayStatus!=="play"&&s.focus({preventScroll:!0}),s.setAttribute("aria-hidden","false"),this.visibleSlides.push(s)):s.setAttribute("aria-hidden","true")})}),$.call(this),q.call(this),O.call(this)}function A(){const e={};let t=!1,s=0;const i=arguments.length;Object.prototype.toString.call(arguments[0])==="[object Boolean]"&&(t=arguments[0],s++);const n=function(o){for(const r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t&&Object.prototype.toString.call(o[r])==="[object Object]"?e[r]=A(!0,e[r],o[r]):e[r]=o[r])};for(;s<i;s++){const o=arguments[s];n(o)}return e}function X(e){try{return JSON.parse(e)}catch{return{}}}function L(){const e=this.settings.responsive.slice().reverse().find(t=>window.matchMedia(`(min-width: ${t.minWidth})`).matches);return e?{...this.settings.default,...e}:this.settings.default}let m,c=!1;function C(){c||(c=!0,m=setTimeout(()=>{this.currentSettings=L.call(this),this.currentSettings.disable?this.disable():this.reinit(),c=!1,clearTimeout(m)},200))}const R={default:{loop:!0,group:1,spaceAround:0,noStartSpace:!1,autoplay:0}};function N(e){const t=X(this.el.getAttribute(a));this.settings=A(!0,R,e,t);let s=this.settings.default;return this.settings.responsive&&(this.settings.responsive.sort((i,n)=>parseInt(i.minWidth,10)-parseInt(n.minWidth,10)),s=L.call(this),this.settings.responsive.forEach(i=>{window.matchMedia(`(min-width: ${i.minWidth})`).addEventListener("change",C.bind(this))})),s}function I(){var t;const e={paging:this.el.querySelector(`[${E}]`),prev:this.el.querySelector(`[${y}]`),next:this.el.querySelector(`[${w}]`),playstop:this.el.querySelector(`[${S}]`),overflow:this.el.querySelector(`[${_}]`),wrapper:this.el.querySelector(`[${P}]`),items:[].slice.call(this.el.querySelectorAll(`[${v}]`))};return e.paging&&(e.pagingTpl=(t=e.paging)==null?void 0:t.cloneNode(!0)),e}function H(e){let t=this.activePage;const s=e.target,i=s.closest(`[${a}-playstop]`),n=s.closest(`[${a}-prev]`),o=s.closest(`[${a}-next]`),r=s.closest(`[${a}-paging]`);if(i){this.toggleAutoplay();return}else if(n)t--;else if(o)t++;else if(r&&r.querySelector("button")){const T=s.closest(`[${a}-paging] li`);t=this.nodes.pages.indexOf(T)}else return;this.stop(),this.changeActive(t)}function F(e){let t=!1;switch(e.key){case"ArrowUp":case"ArrowLeft":t=!0,this.changeActive(this.activePage-1);break;case"ArrowDown":case"ArrowRight":t=!0,this.changeActive(this.activePage+1);break;case"Home":t=!0,this.changeActive(0);break;case"End":t=!0,this.changeActive(this.pagesLength-1);break}t&&e.preventDefault()}let p,d,u;function k(e){p&&window.cancelAnimationFrame(p),p=window.requestAnimationFrame(()=>{this.stop(),this.nodes.overflow.style.transition="none",this._metrics.touchstartX=Math.round(e.touches[0].pageX),this._metrics.slideWidth=this.nodes.wrapper.offsetWidth})}function D(e){d&&window.cancelAnimationFrame(d),d=window.requestAnimationFrame(()=>{this._metrics.touchmoveX=Math.round(e.touches[0].pageX),this._metrics.moveX=this._metrics.touchstartX-this._metrics.touchmoveX,this.nodes.overflow.style.transform=`translateX(${-this._metrics.distance-this._metrics.moveX}px)`})}function B(){u&&window.cancelAnimationFrame(u),u=window.requestAnimationFrame(()=>{let e=this.activePage;if(this.nodes.overflow.style.transition=b,this._metrics.moveX>this._metrics.slideWidth/3)e++;else if(this._metrics.moveX<-this._metrics.slideWidth/3)e--;else{this.nodes.overflow.style.transform=`translateX(${-this._metrics.distance}px)`;return}this.changeActive(e,!0)})}function K(){const e=H.bind(this),t=k.bind(this),s=D.bind(this),i=B.bind(this),n=F.bind(this),o=this.pause.bind(this),r=this.play.bind(this);this.el.addEventListener("click",e),this.el.addEventListener("keydown",n),this.nodes.wrapper.addEventListener("touchstart",t),this.nodes.wrapper.addEventListener("touchmove",s),this.nodes.wrapper.addEventListener("touchend",i),this.el.addEventListener("mouseenter",o),this.el.addEventListener("mouseleave",r)}class V{constructor(t,s){if(this.el=t,this.currentSettings=N.call(this,s),this.nodes=I.call(this),this._templates={},K.call(this),this.nodes.playstop){const i=this.nodes.playstop.getAttribute(S).split("|");this._templates.playstop={tpl:this.nodes.playstop.innerHTML,playLabel:i[0],stopLabel:i[1]}}if(this.nodes.prev){const i=this.nodes.prev.getAttribute(y).split("|");this._templates.prev={tpl:this.nodes.prev.innerHTML,label:i[0],lastLabel:i[1]}}if(this.nodes.next){const i=this.nodes.next.getAttribute(w).split("|");this._templates.next={tpl:this.nodes.next.innerHTML,label:i[0],lastLabel:i[1]}}this.currentSettings.disable||g.call(this)}play(){if(!this.nodes.playstop||this.autoplayStatus==="stop")return;this.pause(),this.currentSettings.loop=!0,this.autoplayStatus="play",this.nodes.playstop.classList.add("is-playing"),this.nodes.playstop.innerHTML=this._templates.playstop.tpl.replace("{text}",this._templates.playstop.playLabel);let t=this.activePage;this._interval=window.setInterval(()=>{t++,t>this.pagesLength-1&&(t=0),this.changeActive(t)},this.currentSettings.autoplay)}pause(){window.clearInterval(this._interval)}stop(){this.nodes.playstop&&(this.autoplayStatus="stop",this.nodes.playstop.classList.remove("is-playing"),this.nodes.playstop.innerHTML=this._templates.playstop.tpl.replace("{text}",this._templates.playstop.stopLabel),window.clearInterval(this._interval))}toggleAutoplay(){this.nodes.playstop&&(this.autoplayStatus==="play"?this.stop():this.autoplayStatus==="stop"&&(this.autoplayStatus="play",this.play()))}changeActive(t,s){this.activePage=t,this.activePage<0&&(this.activePage=this.currentSettings.loop&&!s?this.pagesLength-1:0),this.activePage>this.pagesLength-1&&(this.activePage=this.currentSettings.loop&&!s?0:this.pagesLength-1),W.call(this)}reinit(){this.disable(),this.nodes.items=[].slice.call(this.el.querySelectorAll(`[${v}]`)),g.call(this)}disable(){this.stop(),this.nodes.wrapper.removeEventListener("touchstart",this.onTouchStart),this.nodes.wrapper.removeEventListener("touchmove",this.onTouchMove),this.nodes.wrapper.removeEventListener("touchend",this.onTouchEnd),this.el.removeEventListener("click",this.onClick),this.el.removeEventListener("keydown",this.onKeydown),this.el.removeEventListener("mouseenter",this.onMouseEnter),this.el.removeEventListener("mouseleave",this.onMouseLeave),this.nodes.paging.hidden=!0,this.nodes.prev.hidden=!0,this.nodes.next.hidden=!0,this.nodes.playstop.hidden=!0,this.nodes.overflow.removeAttribute("style"),this.nodes.wrapper.removeAttribute("style"),this.nodes.items.forEach(t=>{t==null||t.forEach(s=>{s.removeAttribute("tabindex"),s.removeAttribute("aria-hidden"),s.removeAttribute("style")})}),this.el.classList.remove(h)}}const f=(e,t)=>{!e.pmCarousel&&e.hasAttribute(a)&&(e.pmCarousel=new V(e,t))},l=function(e={},t){t!==null&&(t=t||document.querySelectorAll(`[${a}]`),t.length?t.forEach(s=>f(s,e)):f(t,e))};window.pmCarousel=l;const j=document.querySelector("#demo1");l({},j);const G=document.querySelector("#demo2");l({default:{autoplay:3e3}},G);const J=document.querySelector("#demo3");l({},J);const U=document.querySelector("#demo3-noloop");l({default:{loop:!1}},U);const Y=document.querySelector("#demo4");l({},Y);const z=document.querySelector("#demo5");l({},z);const Q=document.querySelector("#demo6");l({},Q);const Z=document.querySelector("#demo7");l({default:{group:1},responsive:[{minWidth:"800px",group:3,autoplay:4e3},{minWidth:"400px",group:2},{minWidth:"600px",disable:!0}]},Z);
