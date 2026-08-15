/* ============================================================
   BATTLE.JS — ⚔️ Motor de batalla por turnos
   ============================================================ */
const Game = {
  state: null,
  onVictory: () => {},   // main.js la reemplaza

  newState(){
    return { name:CONFIG.playerNameDefault, mega:false, php:CONFIG.playerMaxHP, bi:0, bhp:0, busy:false };
  },

  boss(){ return BOSSES[this.state.bi]; },

  start(){
    if(!this.state) this.state = this.newState();
    const st = this.state;
    st.php=CONFIG.playerMaxHP; st.mega=false; st.bi=0; st.bhp=0; st.busy=false;

    show('screen-battle');
    const ps=$('#pSprite');
    ps.classList.remove('mega-aura');
    ps.onerror=function(){ this.onerror=null; this.src=SPR.playerStatic; };
    ps.src=SPR.back(6);

    this.renderMoves();
    AU.startMusic();
    this.enterBoss();
  },

  renderMoves(){
    const box=$('#moves'); box.innerHTML='';
    MOVES.forEach(m=>{
      const b=document.createElement('button');
      b.className='move-btn'; b.dataset.key=m.key;
      b.innerHTML='<span class="mv-ico">'+m.icon+'</span><span>'+m.name+'</span>';
      b.onclick=()=>this.doMove(m);
      box.appendChild(b);
    });
  },

  setMovesEnabled(on){
    $$('#moves button').forEach(b=>{
      b.disabled = !on || (on && b.dataset.key==='mega' && this.state.mega);
    });
  },

  async enterBoss(){
    const st=this.state, b=this.boss();
    st.bhp=b.hp; st.busy=true;

    $('#eName').textContent=b.name;
    $('#eTypes').textContent=b.types;
    const es=$('#eSprite');
    es.style.opacity=1;
    es.onerror=()=>{ es.onerror=null; es.src=SPR.art(b.id); };
    es.src=SPR.front(b.id);

    setHP($('#eHP'),st.bhp,b.hp);
    setHP($('#pHP'),st.php,CONFIG.playerMaxHP);

    $('#moves').classList.add('hidden');
    await log(b.intro);
    AU.roar(); shake($('#field')); vib(60);
    await sleep(350);
    $('#moves').classList.remove('hidden');
    st.busy=false; this.setMovesEnabled(true);
  },

  async doMove(m){
    const st=this.state;
    if(st.busy) return;
    st.busy=true; AU.click(); this.setMovesEnabled(false);

    if(m.key==='mega'){
      await this.doMega();
      st.busy=false; this.setMovesEnabled(true);
      return;
    }

    /* 🐞 CÁLCULO DE DAÑO ARREGLADO:
       Antes: let dmg = rand(m.min,m.max) corría para TODOS los ataques,
       pero Garra Dragón no tenía min/max → dmg = NaN → HP del jefe = NaN
       → NaN <= 0 nunca es true → jefe inmortal ("vida infinita").
       Ahora cada ataque tiene su propio rango y SIEMPRE sale un número válido. */
    let dmg, crit=false;
    if(m.key==='dragonclaw'){
      crit = Math.random() < m.critChance;
      dmg  = crit ? rand(m.critMin,m.critMax) : rand(m.min,m.max);
    } else {
      dmg = rand(m.min,m.max);
    }
    if(st.mega) dmg = Math.round(dmg*CONFIG.megaMultiplier);

    /* Animación y sonido del ataque */
    if(m.key==='flareblitz'){ AU.flare(); fireBurst(st.mega,true); }
    else if(m.key==='dragonclaw'){ AU.dragon(); fireBurst(st.mega,false); }
    else { AU.flamethrower(); fireBurst(st.mega,false); }
    flash(st.mega?'#4db8ff':'#ff7b1f');
    await sleep(380);

    /* Aplicar daño al jefe (con clamp a 0) */
    const b=this.boss();
    st.bhp = Math.max(0, st.bhp - dmg);
    setHP($('#eHP'),st.bhp,b.hp);
    dmgFloat($('#eWrap'),dmg,crit);
    shake($('#eWrap')); vib(crit?[40,30,90]:60);
    await log(m.msg+(crit?' ¡GOLPE CRÍTICO!':'')+' '+CONFIG.typeText);

    /* Retroceso del Envite Ígneo (nunca puede debilitar a Charizard) */
    if(m.key==='flareblitz'){
      st.php = Math.max(1, st.php - m.recoil);
      setHP($('#pHP'),st.php,CONFIG.playerMaxHP);
      dmgFloat($('#pWrap'),m.recoil,false);
      await log('Charizard recibió un poco de daño por el retroceso...');
    }

    if(st.bhp<=0){ await this.bossDefeated(); return; }
    await sleep(300);
    await this.bossTurn();
  },

  async bossTurn(){
    const st=this.state, b=this.boss();
    await log('¡'+b.name+' usó '+b.atk+'!');
    lunge($('#eSprite')); AU.hit();
    await sleep(260);

    const d=rand(b.min,b.max);
    st.php=Math.max(0,st.php-d);
    setHP($('#pHP'),st.php,CONFIG.playerMaxHP);
    dmgFloat($('#pWrap'),d,false);
    shake($('#pWrap')); vib(70); flash('#7fd4ff',.45);

    /* El nene nunca pierde: corazón de fuego */
    if(st.php<=0){
      await sleep(500);
      await log('¡Charizard cayó!... pero su CORAZÓN DE FUEGO arde más fuerte que nunca. ¡Se levantó con toda su energía! 🔥');
      AU.heal();
      st.php=CONFIG.playerMaxHP;
      setHP($('#pHP'),st.php,CONFIG.playerMaxHP);
      healSparkle($('#pWrap'));
    }
    st.busy=false; this.setMovesEnabled(true);
  },

  async bossDefeated(){
    const st=this.state, b=this.boss();
    const es=$('#eSprite');
    es.style.transition='opacity .8s'; es.style.opacity=0;
    AU.tone(300,.4,'triangle',.12,0,-220);
    await log('¡'+b.name+' se debilitó! 🔥');
    miniConfetti();

    if(st.bi >= BOSSES.length-1){
      await sleep(800);
      this.onVictory();
      return;
    }

    st.bi++;
    st.php=CONFIG.playerMaxHP;
    setHP($('#pHP'),st.php,CONFIG.playerMaxHP);
    await log('¡Charizard recuperó toda su energía entre combates!');
    AU.heal(); healSparkle($('#pWrap'));
    es.style.transition='';
    await this.enterBoss();   // ahora esperado correctamente
  },

  async doMega(){
    const st=this.state; st.mega=true;
    flash('#8fd8ff',.9); AU.mega(); vib([100,50,150,50,200]); shake($('#field'));

    const ps=$('#pSprite'); ps.onerror=null;
    const img=new Image();
    img.onload=()=>{ ps.src=SPR.megaBack; };   // si falla, queda con aura azul
    img.src=SPR.megaBack;
    ps.classList.add('mega-aura');
    fireBurst(true,true);

    const btn=document.querySelector('#moves button[data-key="mega"]');
    if(btn){
      btn.disabled=true; btn.classList.add('mega-on');
      btn.innerHTML='<span class="mv-ico">💥</span><span>¡MEGA ACTIVO!</span>';
    }
    await log('¡El vínculo entre '+st.name+' y Charizard brilla! ¡MEGA-CHARIZARD X entra en escena! 🐉💙🔥');
  }
};