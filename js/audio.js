/* ============================================================
   AUDIO.JS — 🎵 Todos los sonidos se sintetizan con WebAudio
   (sin archivos de audio, sin problemas de copyright)
   ============================================================ */
const AU = {
  ctx:null, muted:false, musicOn:false, step:0, timer:null,

  ensure(){
    const C = window.AudioContext || window.webkitAudioContext;
    if(!this.ctx && C) this.ctx = new C();
    if(this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  tone(f=440,d=.1,type='square',v=.12,delay=0,slide=0){
    if(this.muted || !this.ctx) return;
    const t=this.ctx.currentTime+delay, o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(f,t);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
    g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t+d+.05);
  },

  noise(d=.5,f0=900,f1=180,v=.25,delay=0,ft='bandpass'){
    if(this.muted || !this.ctx) return;
    const t=this.ctx.currentTime+delay, n=this.ctx.createBufferSource();
    const len=Math.floor(this.ctx.sampleRate*d);
    const buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate), ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=Math.random()*2-1;
    n.buffer=buf;
    const f=this.ctx.createBiquadFilter(); f.type=ft;
    f.frequency.setValueAtTime(f0,t); f.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+d);
    f.Q.value=1.1;
    const g=this.ctx.createGain(); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    n.connect(f); f.connect(g); g.connect(this.ctx.destination); n.start(t);
  },

  click(){ this.tone(720,.06,'square',.08); this.tone(1080,.05,'square',.05,.04); },
  flamethrower(){ this.noise(.65,1400,160,.3); this.tone(120,.5,'sawtooth',.05,0,-60); },
  flare(){ this.noise(.95,1800,120,.38); this.tone(90,.8,'sawtooth',.09,0,-40); },
  dragon(){ this.tone(880,.09,'square',.12); this.tone(660,.09,'square',.12,.08); this.noise(.2,3000,800,.15,.02,'highpass'); },
  hit(){ this.tone(180,.18,'square',.16,0,-110); this.noise(.15,600,120,.18); },
  roar(){ this.tone(140,.7,'sawtooth',.18,0,-90); this.noise(.7,500,90,.22); },
  heal(){ [523,659,784,1047].forEach((f,i)=>this.tone(f,.12,'triangle',.12,i*.09)); },
  mega(){
    this.tone(180,.9,'sawtooth',.14,0,1100); this.noise(.9,400,2400,.16);
    [880,1108,1318,1760].forEach((f,i)=>this.tone(f,.15,'square',.08,.15+i*.12));
  },
  fanfare(){ [[523,0],[523,.15],[523,.3],[659,.45],[784,.75],[659,.95],[1047,1.15]].forEach(x=>this.tone(x[0],.22,'square',.14,x[1])); },

  /* Loop chiptune original de batalla */
  startMusic(){
    if(this.musicOn || !this.ctx) return;
    this.musicOn=true; this.step=0;
    const bass=[110,0,110,0,131,0,98,0,110,0,110,0,147,131,98,0];
    const lead=[440,0,523,659,0,523,440,0,392,0,440,523,659,0,587,0];
    this.timer=setInterval(()=>{
      if(this.muted) return;
      const i=this.step%16;
      if(bass[i]) this.tone(bass[i],.16,'triangle',.05);
      if(lead[i]) this.tone(lead[i],.14,'square',.035);
      this.step++;
    },170);
  },
  stopMusic(){ this.musicOn=false; clearInterval(this.timer); }
};