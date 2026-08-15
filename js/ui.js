/* ============================================================
   UI.JS — 🛠️ Helpers reutilizables de interfaz y efectos
   ============================================================ */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand  = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const vib   = p => { try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} };

function show(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

function shake(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2300);
}

async function typeText(el,txt,speed=22){
  el.textContent='';
  for(const ch of txt){ el.textContent+=ch; await sleep(speed); }
}
const log = (t,speed=16) => typeText($('#logText'),t,speed);

function flash(color,a=.7){
  const f=$('#flash');
  f.style.background='radial-gradient(circle,'+color+'cc, transparent 75%)';
  f.animate([{opacity:a},{opacity:0}],{duration:520,easing:'ease-out'});
}

/* Barra de vida (con red de seguridad anti-NaN) */
function setHP(box,cur,max){
  let pct = cur/max*100;
  if(!Number.isFinite(pct)) pct = 0;
  pct = Math.max(0, Math.min(100, pct));
  const f = box.querySelector('.hpfill');
  f.style.width = pct+'%';
  f.classList.toggle('mid', pct<=55 && pct>25);
  f.classList.toggle('low', pct<=25);
  box.querySelector('.hpnum').textContent = Math.max(0,Math.round(cur))+' / '+max;
}

function dmgFloat(wrap,n,crit){
  const d=document.createElement('div');
  d.className='dmg'; d.textContent=(crit?'💢':'')+'-'+n;
  wrap.appendChild(d); setTimeout(()=>d.remove(),980);
}

function fireBurst(blue=false,many=false){
  const fx=$('#fx'), r=$('#field').getBoundingClientRect(), n=many?18:12;
  for(let i=0;i<n;i++){
    const p=document.createElement('div');
    p.className='ffly'; p.textContent='🔥';
    if(blue) p.style.filter='hue-rotate(185deg) saturate(1.5)';
    p.style.fontSize=rand(16,34)+'px';
    const sx=rand(8,35), sy=rand(58,85), ex=rand(55,88), ey=rand(8,35);
    p.style.left=sx+'%'; p.style.top=sy+'%';
    fx.appendChild(p);
    p.animate([
      {transform:'translate(0,0) scale(.7)',opacity:1},
      {transform:'translate('+((ex-sx)/100*r.width)+'px,'+((ey-sy)/100*r.height)+'px) scale(1.15)',opacity:.9}
    ],{duration:rand(380,650),easing:'ease-out'}).onfinish=()=>p.remove();
  }
}

function healSparkle(wrap){
  for(let i=0;i<6;i++){
    const p=document.createElement('div');
    p.textContent='✨';
    p.style.cssText='position:absolute;left:'+rand(5,80)+'%;top:'+rand(20,80)+'%;font-size:'+rand(14,24)+'px;pointer-events:none';
    wrap.appendChild(p);
    p.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-50px)',opacity:0}],{duration:900,delay:i*90}).onfinish=()=>p.remove();
  }
}

function lunge(el){
  el.animate([{transform:'translate(0,0)'},{transform:'translate(-32px,20px)'},{transform:'translate(0,0)'}],{duration:450,easing:'ease-out'});
}

function miniConfetti(){
  window.confetti && confetti({particleCount:70,spread:75,origin:{y:.35},colors:['#ff9d00','#ff3c00','#ffd23f']});
}

/* Brasas flotando de fondo */
function startEmbers(){
  setInterval(()=>{
    if(document.querySelectorAll('.ember').length>26) return;
    const e=document.createElement('div'); e.className='ember';
    const s=rand(4,9);
    e.style.width=e.style.height=s+'px';
    e.style.left=rand(0,100)+'vw';
    e.style.background=Math.random()<.5?'#ff9d2e':'#ff5a1f';
    e.style.boxShadow='0 0 8px #ff7b1f';
    e.style.setProperty('--drift',rand(-70,70)+'px');
    e.style.animationDuration=rand(5,10)+'s';
    document.body.appendChild(e);
    e.addEventListener('animationend',()=>e.remove());
  },500);
}

function initUI(){
  startEmbers();
  $('#muteBtn').onclick=()=>{ AU.muted=!AU.muted; $('#muteBtn').textContent=AU.muted?'🔇':'🔊'; };
}