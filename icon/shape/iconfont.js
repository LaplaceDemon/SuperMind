(function(window){var svgSprite='<svg><symbol id="icon-juxing" viewBox="0 0 1024 1024"><path d="M898.8 199.6v624.8H125.2V199.6h773.6m59.5-59.5H65.7v743.8h892.5V140.1h0.1z"  ></path></symbol><symbol id="icon-tuoyuanxing" viewBox="0 0 1024 1024"><path d="M512 199.6c53.5 0 105.3 8.7 153.9 25.8 46.4 16.4 88 39.7 123.5 69.3 70.5 58.7 109.3 135.9 109.3 217.3s-38.8 158.5-109.3 217.3c-35.5 29.6-77.1 52.9-123.5 69.3-48.6 17.1-100.4 25.8-153.9 25.8s-105.3-8.7-153.9-25.8c-46.4-16.4-88-39.7-123.5-69.3-70.5-58.8-109.4-135.9-109.4-217.3S164 353.5 234.5 294.7c35.5-29.6 77.1-52.9 123.5-69.3 48.7-17.1 100.5-25.8 154-25.8m0-59.5C265.5 140.1 65.7 306.6 65.7 512c0 205.4 199.8 371.9 446.3 371.9S958.3 717.4 958.3 512c0-205.4-199.8-371.9-446.3-371.9z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)