(function(){'use strict';var c={x:0,y:0,b:0,a:0},d=2,e=!0;var g,h,k=0;function l(a){var b=.001*(a-k);k=a;d-=b;0>=d&&(a=40*(e?1:-1),b=-2*a,c.x+=a,c.y+=a,c.b+=b,c.a+=b,e=!e,d=2);b=g;a=b.context;a.clearRect(0,0,b.width,b.height);b=c.x;var f=c.y,m=c.b,n=c.a;a.beginPath();a.moveTo(b,f);a.lineTo(b,f+n);a.lineTo(b+m,f+n);a.lineTo(b+m,f);a.closePath();a.fillStyle="rgba(255, 255, 0, 0.5)";a.fill();a.strokeStyle="rgba(255, 175, 0, 1.0)";a.stroke();h.paused||window.requestAnimationFrame(l)}
function p(){window.requestAnimationFrame(function(a){k=a;h.paused=!1;h.c.innerText="Running";window.requestAnimationFrame(l)})}function q(){h.paused?p():(h.paused=!0,h.c.innerText="Paused")}function r(){var a=g,b=a.f;a=a.canvas;g.width=b.clientWidth;g.height=b.clientHeight;a.width=g.width;a.height=g.height;b=g.width;a=g.height;c.x=10;c.y=10;c.b=b-20;c.a=a-20;e=!0;d=2}
window.addEventListener("load",function(){var a=document.getElementById("wrapper"),b=document.getElementById("canvas"),f=b.getContext("2d");if(!f)throw"2d context unavailable";g={f:a,canvas:b,context:f,width:0,height:0};a=document.getElementById("play-pause-btn");b=document.getElementById("paused-status");a.addEventListener("click",q);h={paused:!0,button:a,c:b};r();window.addEventListener("resize",r)});}).call(this);