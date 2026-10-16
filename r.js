
var W=1080,H=1350;
var C={dark:'#0E0E0E',light:'#F0F0EE',lime:'#C6F03C',white:'#ffffff',ink:'#111111',
 mutedD:'#96968f',mutedL:'#69695f',lineD:'#2a2a28',lineL:'#d6d6d0',bodyD:'#e1e1dc',bodyL:'#282826'};
var M=96;
function fontFor(lang,role,size){
 if(role==='num') return '400 '+size+"px Anton";
 if(lang==='hy') return (role==='head'?'900 ':'600 ')+size+"px 'Noto Sans Armenian'";
 if(lang==='ru'){ if(role==='head') return '700 '+size+"px Oswald"; return '500 '+size+"px 'Noto Sans'"; }
 return role==='head' ? ('400 '+size+"px Anton") : ('600 '+size+"px Archivo");
}
function wrap(x,text,font,maxw){ x.font=font; var words=String(text).split(' '),lines=[],cur='';
 for(var i=0;i<words.length;i++){var t=(cur?cur+' ':'')+words[i];
  if(x.measureText(t).width<=maxw||!cur){cur=t;}else{lines.push(cur);cur=words[i];}}
 if(cur)lines.push(cur); return lines; }
function glow(x,cx,cy,r,a){ var g=x.createRadialGradient(cx,cy,0,cx,cy,r);
 g.addColorStop(0,'rgba(198,240,60,'+a+')'); g.addColorStop(1,'rgba(198,240,60,0)');
 x.fillStyle=g; x.fillRect(cx-r,cy-r,r*2,r*2); }
function halftone(x,ox,oy,cols,rows,gap,rmax){ cols=cols||7;rows=rows||7;gap=gap||26;rmax=rmax||7;
 x.fillStyle='rgba(198,240,60,0.5)';
 for(var i=0;i<cols;i++)for(var j=0;j<rows;j++){var rr=rmax*(1-(i+j)/(cols+rows)); if(rr<1)continue;
  x.beginPath();x.arc(ox+i*gap,oy+j*gap,rr,0,7);x.fill();} }
function diamond(x,cx,cy,s,col){ x.fillStyle=col; x.beginPath();
 x.moveTo(cx,cy-s);x.lineTo(cx+s,cy);x.lineTo(cx,cy+s);x.lineTo(cx-s,cy);x.closePath();x.fill(); }
function arrowC(x,cx,cy,r){ x.fillStyle=C.lime; x.beginPath();x.arc(cx,cy,r,0,7);x.fill();
 x.strokeStyle=C.ink;x.lineWidth=7;x.lineCap='round';
 x.beginPath();x.moveTo(cx-r*0.4,cy);x.lineTo(cx+r*0.35,cy);x.stroke();
 x.beginPath();x.moveTo(cx+r*0.05,cy-r*0.32);x.lineTo(cx+r*0.38,cy);x.stroke();
 x.beginPath();x.moveTo(cx+r*0.05,cy+r*0.32);x.lineTo(cx+r*0.38,cy);x.stroke(); }
function header(x,dark,label,idx,total,mark){ var col=dark?C.white:C.ink,mut=dark?C.mutedD:C.mutedL;
 x.textBaseline='top'; var sx=M;
 if(mark){diamond(x,M+13,90,13,C.lime);sx+=44;}
 x.fillStyle=col;x.font='700 30px Archivo';x.fillText(label,sx,72);
 if(idx){var pg=(idx<10?'0'+idx:idx)+' / '+(total<10?'0'+total:total);
  x.font='700 28px Archivo';x.fillStyle=mut; x.textAlign='right'; x.fillText(pg,W-M,74); x.textAlign='left';}
 x.strokeStyle=dark?C.lineD:C.lineL;x.lineWidth=2;x.beginPath();x.moveTo(M,139);x.lineTo(W-M,139);x.stroke(); }

function drawHook(x,b,s){ x.fillStyle=C.dark;x.fillRect(0,0,W,H);
 glow(x,W,0,420,0.20); glow(x,0,H,300,0.14);
 header(x,true,b.label,1,7,b.brand_mark); halftone(x,W-230,300);
 var lang=b.lang;
 if(s.eyebrow){var ef=fontFor(lang,'body',30); if(lang==='en')ef='700 30px Archivo'; x.font=ef;
  var w=x.measureText(s.eyebrow).width; x.strokeStyle=C.lime;x.lineWidth=3;
  rr(x,M,250,w+64,66,33);x.stroke(); x.fillStyle=C.lime;x.textBaseline='top';x.fillText(s.eyebrow,M+32,264);}
 var size=s.hook_size||(lang==='en'?130:104), hf=fontFor(lang,'head',size);
 var lines=wrap(x,s.hook,hf,W-2*M), lh=Math.round(size*1.06), y=1040-lh*lines.length;
 var acc={}; (s.accent||[]).forEach(function(a){acc[a.toLowerCase()]=1;});
 x.textBaseline='top';
 for(var i=0;i<lines.length;i++){var cx=M; var ws=lines[i].split(' ');
  for(var j=0;j<ws.length;j++){var key=ws[j].toLowerCase().replace(/[.,—:՝։-]/g,'');
   x.fillStyle=acc[key]?C.lime:C.white; x.font=hf; x.fillText(ws[j],cx,y);
   cx+=x.measureText(ws[j]+' ').width;} y+=lh;}
 var cyc=H-170; arrowC(x,M+46,cyc,46);
 x.fillStyle=C.mutedD; x.font=(lang==='hy')?"700 30px 'Noto Sans Armenian'":'700 30px Archivo';
 x.fillText(b.swipe||s.swipe||'SWIPE',M+120,cyc-16); }

function drawPoint(x,b,s){ var dark=s.dark; x.fillStyle=dark?C.dark:C.light;x.fillRect(0,0,W,H);
 if(dark)glow(x,0,0,300,0.13);
 header(x,dark,b.label,s.idx,7,b.brand_mark); var lang=b.lang;
 var col=dark?C.white:C.ink;
 var num=(s.n<10?'0'+s.n:''+s.n); x.font=fontFor(lang,'num',190); x.fillStyle=dark?C.lime:C.ink;
 x.textBaseline='top'; x.fillText(num,M,210); var nw=x.measureText(num).width;
 x.fillStyle=C.lime; x.fillRect(M+nw+26,250,70,12);
 var tsize=(lang==='en')?72:66, tf=fontFor(lang,'head',tsize); var ty=452;
 wrap(x,s.title,tf,W-2*M).forEach(function(ln){x.font=tf;x.fillStyle=col;x.fillText(ln,M,ty);ty+=Math.round(tsize*1.1);});
 ty+=24; var bsize=(lang==='hy')?43:44, bf=fontFor(lang,'body',bsize);
 wrap(x,s.body,bf,W-2*M).forEach(function(ln){x.font=bf;x.fillStyle=dark?C.bodyD:C.bodyL;x.fillText(ln,M,ty);ty+=Math.round(bsize*1.46);});
 x.fillStyle=dark?C.mutedD:C.mutedL; x.font='600 26px Archivo'; x.fillText(b.footer||'',M,H-70); }

function drawCta(x,b,s){ x.fillStyle=C.dark;x.fillRect(0,0,W,H);
 glow(x,W,H,360,0.22); glow(x,0,0,260,0.11);
 header(x,true,b.label,7,7,b.brand_mark); halftone(x,W-250,1040); var lang=b.lang;
 var tf=(lang==='en')?'700 40px Archivo':fontFor(lang,'body',40); var ty=300; x.textBaseline='top';
 wrap(x,s.takeaway,tf,W-2*M).forEach(function(ln){x.font=tf;x.fillStyle=C.mutedD;x.fillText(ln,M,ty);ty+=Math.round(40*1.4);});
 var csize=(lang==='en')?108:86, cf=fontFor(lang,'head',csize); var cy=520;
 var acc={}; (s.accent||[]).forEach(function(a){acc[a.toLowerCase()]=1;});
 wrap(x,s.cta_big,cf,W-2*M).forEach(function(ln){var cx=M; ln.split(' ').forEach(function(wd){
   var key=wd.toLowerCase().replace(/[.,—:՝։]/g,''); x.font=cf; x.fillStyle=acc[key]?C.lime:C.white;
   x.fillText(wd,cx,cy); cx+=x.measureText(wd+' ').width;}); cy+=Math.round(csize*1.08);});
 cy+=40; var pf=(lang==='en')?'400 46px Anton':fontFor(lang,'head',46); x.font=pf;
 var bw=x.measureText(s.button).width, ph=46+56; rr(x,M,cy,bw+92,ph,ph/2); x.fillStyle=C.lime;x.fill();
 x.fillStyle=C.ink; x.textBaseline='middle'; x.fillText(s.button,M+46,cy+ph/2+2); x.textBaseline='top';
 cy+=ph+30; var sf=fontFor(lang,'body',38);
 wrap(x,s.subline||'',sf,W-2*M).forEach(function(ln){x.font=sf;x.fillStyle=C.bodyD;x.fillText(ln,M,cy);cy+=Math.round(38*1.4);});
 var sx=M; if(b.brand_mark){diamond(x,M+13,H-96+15,13,C.lime);sx+=42;}
 x.fillStyle=C.lime; x.font=(lang==='hy')?"600 30px 'Noto Sans Armenian'":'700 30px Archivo'; x.fillText(s.sig,sx,H-96); }

function rr(x,px,py,w,h,r){ x.beginPath(); x.moveTo(px+r,py); x.arcTo(px+w,py,px+w,py+h,r);
 x.arcTo(px+w,py+h,px,py+h,r); x.arcTo(px,py+h,px,py,r); x.arcTo(px,py,px+w,py,r); x.closePath(); }

function drawOne(x,s){ x.fillStyle=C.dark;x.fillRect(0,0,W,H); glow(x,W,0,420,0.20);glow(x,0,H,300,0.14);
 x.textBaseline='top'; diamond(x,M+13,90,13,C.lime);
 x.fillStyle=C.white;x.font='700 30px Archivo';x.fillText('TARON BADALYAN',M+44,72);
 x.fillStyle=C.mutedD;x.font="700 28px 'Noto Sans'";x.textAlign='right';x.fillText('ИИ-ТРЕНИНГ',W-M,74);x.textAlign='left';
 x.strokeStyle=C.lineD;x.lineWidth=2;x.beginPath();x.moveTo(M,139);x.lineTo(W-M,139);x.stroke();
 x.fillStyle=C.white;x.font='700 62px Oswald';x.fillText(s.title,M,190);
 x.fillStyle=C.mutedD;x.font="500 34px 'Noto Sans'";x.fillText(s.sub,M,276);
 var y=372, bh=306;
 for(var i=0;i<s.packages.length;i++){var p=s.packages[i];
  x.fillStyle=C.lime;x.font='400 58px Anton';x.fillText(p.name,M,y);var nw=x.measureText(p.name).width;
  x.font="600 30px 'Noto Sans'";var dw=x.measureText(p.dur).width; rr(x,M+nw+28,y+6,dw+48,58,29);x.strokeStyle=C.lime;x.lineWidth=3;x.stroke();
  x.fillStyle=C.white;x.fillText(p.dur,M+nw+28+24,y+20);
  var yy=y+96, bf="500 32px 'Noto Sans'";
  for(var k=0;k<p.lines.length;k++){x.fillStyle=C.lime;x.beginPath();x.arc(M+9,yy+21,7,0,7);x.fill();
   x.fillStyle=C.bodyD;var tx=M+40; wrap(x,p.lines[k],bf,W-2*M-44).forEach(function(l){x.font=bf;x.fillText(l,tx,yy);yy+=44;}); yy+=8;}
  if(i<2){x.strokeStyle=C.lineD;x.lineWidth=2;x.beginPath();x.moveTo(M,y+bh-26);x.lineTo(W-M,y+bh-26);x.stroke();}
  y+=bh;}
 diamond(x,M+13,H-96+15,13,C.lime); x.fillStyle=C.lime;x.font='700 30px Archivo';x.fillText(s.footer,M+42,H-96); }

function drawSlide(x,b,s){ if(s.kind==='hook')drawHook(x,b,s); else if(s.kind==='cta')drawCta(x,b,s); else drawPoint(x,b,s); }

// ---- covers (9:16) ----
var CW=1080,CH=1920,CM=96;
function fit(x,t,mk2,mw,st,mn){var s=st;while(s>mn){var f=mk2(s);x.font=f;if(x.measureText(t).width<=mw)return [f,s];s-=3;}var ff=mk2(mn);x.font=ff;return [ff,mn];}
function drawCover(x,c){x.fillStyle=C.dark;x.fillRect(0,0,CW,CH);glow(x,CW,0,460,0.20);glow(x,0,CH,380,0.16);
 x.textBaseline='top';diamond(x,CM+14,168,14,C.lime);x.fillStyle=C.white;x.font='700 32px Archivo';x.fillText('TARON BADALYAN',CM+46,150);
 var mw=CW-CM-230;var ef="700 32px 'Noto Sans Armenian'";x.font=ef;var ew=x.measureText(c.eyebrow).width;
 x.strokeStyle=C.lime;x.lineWidth=3;rr(x,CM,300,ew+64,66,33);x.stroke();x.fillStyle=C.lime;x.fillText(c.eyebrow,CM+32,316);
 var r1=fit(x,c.line1,function(s){return '900 '+s+"px 'Noto Sans Armenian'";},mw,104,64);
 var r2=fit(x,c.line2,function(s){return '700 '+s+'px Oswald';},mw,92,56);
 var h1=Math.round(r1[1]*1.25),h2=Math.round(r2[1]*1.25),total=h1+20+h2,y=820-total/2;
 x.font=r1[0];x.fillStyle=C.white;x.fillText(c.line1,CM,y);y+=h1+20;x.font=r2[0];x.fillStyle=C.lime;x.fillText(c.line2,CM,y);
 x.fillStyle=C.muted||C.mutedD;x.font='700 30px Archivo';x.fillText(c.idx+' / 3',CM,1300);}

function dl(cv,name){ cv.toBlob(function(bl){ var a=document.createElement('a');
 a.href=URL.createObjectURL(bl); a.download=name; a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);},1500); },'image/png'); }
function mk(parent,w,h,name,cls){ var d=document.createElement('div');d.className='card'+(cls?' '+cls:'');
 var cv=document.createElement('canvas');cv.width=w;cv.height=h;d.appendChild(cv);
 var b=document.createElement('button');b.textContent='PNG';b.onclick=function(){dl(cv,name);};d.appendChild(b);
 parent.appendChild(d); return cv; }
function pad(n){return n<10?'0'+n:''+n;}
function initMain(DATA){ try{
 var gA=document.getElementById('gA'),gB=document.getElementById('gB'),gP=document.getElementById('gP');
 if(gA&&gA.children.length)return;
 DATA.A.slides.forEach(function(s){drawSlide(mk(gA,W,H,'carousel_a_'+pad(s.idx)+'.png').getContext('2d'),DATA.A.base,s);});
 DATA.B.slides.forEach(function(s){drawSlide(mk(gB,W,H,'carousel_b_'+pad(s.idx)+'.png').getContext('2d'),DATA.B.base,s);});
 if(gP)drawOne(mk(gP,W,H,'onepager_training.png').getContext('2d'),DATA.P);
 }catch(e){} }
function initCovers(COVERS){ try{ var g=document.getElementById('gC'); if(g&&g.children.length)return;
 COVERS.forEach(function(c){drawCover(mk(g,CW,CH,'cover_'+pad(c.idx)+'.png','v').getContext('2d'),c);}); }catch(e){} }
function boot(cb){ if(document.fonts&&document.fonts.ready){
  var want=['400 60px Anton','700 60px Archivo','600 44px Archivo',
   "900 60px 'Noto Sans Armenian'","600 44px 'Noto Sans Armenian'",
   '700 60px Oswald',"500 40px 'Noto Sans'","700 40px 'Noto Sans'"];
  Promise.all(want.map(function(f){return document.fonts.load(f).catch(function(){});}))
   .then(function(){return document.fonts.ready;}).then(cb).catch(cb);
  setTimeout(cb,2000);
 } else { cb(); } }
