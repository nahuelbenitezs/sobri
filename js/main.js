/* ============================================================
   MAIN.JS — 🎬 Arranque y flujo entre pantallas
   ============================================================ */
initUI();

/* Nombre personalizado por URL: ?nombre=Thomy */
const urlName = new URLSearchParams(location.search).get('nombre');
if(urlName) $('#nameInput').value = urlName;

$('#startBtn').onclick=()=>{
  AU.ensure();
  const n=$('#nameInput').value.trim();
  if(!n){
    shake($('#nameInput'));
    $('#nameInput').placeholder='¡Escribe tu nombre!';
    AU.tone(160,.2,'square',.15);
    return;
  }
  Game.state=Game.newState();
  Game.state.name=n.toUpperCase().slice(0,14);
  AU.click(); AU.roar(); vib(100);
  startIntro();
};

async function startIntro(){
  show('screen-intro');
  shake($('#screen-intro'));
  const ic=$('#introChar');
  ic.onerror=function(){ this.onerror=null; this.src=SPR.art(6); };
  ic.src=SPR.front(6);
  await sleep(600);
  AU.startMusic();
  await typeText($('#introMsg'),
    'Entrenador '+Game.state.name+', has sido convocado al GIMNASIO DE FUEGO. Tres jefes te esperan. Demuestra que eres un verdadero MAESTRO DEL FUEGO. 🔥');
  $('#introGo').classList.remove('hidden');
}
$('#introGo').onclick=()=>{ AU.click(); Game.start(); };

/* Pantalla de victoria (la dispara battle.js) */
Game.onVictory=function(){
  show('screen-victory');
  AU.stopMusic(); AU.fanfare(); vib([80,60,120,60,220]);
  $('#vChar').src=SPR.front(6);
  $('#vText').textContent='Entrenador '+Game.state.name+': venciste a los 3 jefes del Gimnasio de Fuego.';
  const end=Date.now()+2800;
  (function boom(){
    if(!window.confetti) return;
    confetti({particleCount:rand(40,80),spread:rand(60,110),origin:{x:Math.random(),y:Math.random()*.5},colors:['#ff9d00','#ff3c00','#ffd23f','#4dd7ff']});
    if(Date.now()<end) setTimeout(boom,260);
  })();
};

$('#claimBtn').onclick=()=>{ AU.click(); CardLab.open(); };
$('#againBtn').onclick=()=>{ AU.click(); Game.start(); };
$('#shareBtn').onclick=async()=>{
  AU.click();
  try{
    if(navigator.share) await navigator.share({title:'Desafío Ígneo 🔥',url:location.href});
    else { await navigator.clipboard.writeText(location.href); toast('¡Link copiado! 🔗'); }
  }catch(e){}
};