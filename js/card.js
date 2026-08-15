/* ============================================================
   CARD.JS — 🃏 Creador de Tarjeta de Entrenador Legendario
   ============================================================ */
const CardLab = {
  team: [],
  frame: 'lava',

  open(){
    show('screen-card');
    /* Recuperar lo guardado en el celu (localStorage) */
    try{
      const d=JSON.parse(localStorage.getItem('fireTeam'));
      if(d){
        this.team=(d.team||[]).filter(id=>FIRE_TEAM.some(f=>f[1]===id));
        this.frame=d.frame||'lava';
        if(d.nick) $('#nickInput').value=d.nick;
      }
    }catch(e){}

    if(!$('#nickInput').value)
      $('#nickInput').value=(Game.state&&Game.state.name)||CONFIG.playerNameDefault;
    $('#cardName').textContent=$('#nickInput').value.toUpperCase().slice(0,14);
    $('#cardDate').textContent=new Date().toLocaleDateString('es-AR');
    $('#cardId').textContent=String(rand(10000,99999));

    this.setFrame(this.frame);
    this.renderGallery();
    this.renderTeam();
  },

  save(){
    try{
      localStorage.setItem('fireTeam',JSON.stringify({team:this.team,frame:this.frame,nick:$('#nickInput').value}));
    }catch(e){}
  },

  renderGallery(){
    const g=$('#gallery'); g.innerHTML='';
    FIRE_TEAM.forEach(f=>{
      const n=f[0], id=f[1];
      const b=document.createElement('button');
      b.className='gbtn'+(this.team.includes(id)?' selected':'');
      b.innerHTML='<img loading="lazy" crossorigin="anonymous" src="'+SPR.any(id)+'" alt="'+n+'"><span>'+n+'</span>';
      b.onclick=()=>{
        AU.click();
        if(this.team.includes(id)) this.team=this.team.filter(x=>x!==id);
        else if(this.team.length<6){ this.team.push(id); vib(30); }
        else { toast('¡Equipo completo! Toca uno de tu equipo para quitarlo.'); AU.tone(160,.15,'square',.12); }
        this.renderGallery(); this.renderTeam(); this.save();
      };
      g.appendChild(b);
    });
  },

  renderTeam(){
    const build=(cont,editable)=>{
      cont.innerHTML='';
      for(let i=0;i<6;i++){
        const id=this.team[i], s=document.createElement('div');
        s.className='slot'+(id?' filled':'');
        if(id){
          const mon=FIRE_TEAM.find(f=>f[1]===id);
          s.innerHTML='<img crossorigin="anonymous" src="'+SPR.any(id)+'"><span>'+mon[0]+'</span>';
          if(editable) s.onclick=()=>{
            this.team=this.team.filter(x=>x!==id);
            AU.click(); this.renderTeam(); this.renderGallery(); this.save();
          };
        } else s.innerHTML='<span class="q">?</span>';
        cont.appendChild(s);
      }
    };
    build($('#teamSlots'),true);
    build($('#cardTeam'),false);
  },

  setFrame(k){
    this.frame=k;
    $('#cardPreview').className='tcard frame-'+k;
    $$('.frame-btn').forEach(b=>b.classList.toggle('sel',b.dataset.frame===k));
  },

  download(){
    AU.click();
    if(typeof html2canvas==='undefined'){ toast('Falta conexión para generar la imagen 😢'); return; }
    const btn=$('#dlBtn'); btn.disabled=true; btn.textContent='GENERANDO...';
    html2canvas($('#cardPreview'),{useCORS:true,scale:2,backgroundColor:'#0b0b12',logging:false})
    .then(cv=>{
      cv.toBlob(b=>{
        const file=new File([b],'tarjeta-legendario.png',{type:'image/png'});
        if(navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file],title:'Mi Tarjeta Legendaria 🔥'}).catch(()=>{});
        } else {
          const a=document.createElement('a');
          a.href=URL.createObjectURL(b);
          a.download='tarjeta-'+($('#nickInput').value||'entrenador').toLowerCase()+'.png';
          a.click();
        }
        window.confetti && confetti({particleCount:130,spread:100,origin:{y:.7}});
        toast('¡Tarjeta guardada, Maestro del Fuego! 🏆');
        btn.disabled=false; btn.textContent='⬇️ DESCARGAR TARJETA';
      },'image/png');
    })
    .catch(()=>{ toast('Ups, intenta de nuevo'); btn.disabled=false; btn.textContent='⬇️ DESCARGAR TARJETA'; });
  }
};

/* Conectar los controles de la tarjeta */
$$('.frame-btn').forEach(b=>b.onclick=()=>{ AU.click(); CardLab.setFrame(b.dataset.frame); CardLab.save(); });
$('#nickInput').addEventListener('input',e=>{
  const fallback=(Game.state&&Game.state.name)||CONFIG.playerNameDefault;
  $('#cardName').textContent=(e.target.value||fallback).toUpperCase().slice(0,14);
  CardLab.save();
});
$('#dlBtn').onclick=()=>CardLab.download();