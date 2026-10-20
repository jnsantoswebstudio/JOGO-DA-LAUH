/*
 * MONSTER HIGH: O REINO DAS MARÉS DA LAUANA
 * Fan game gratuito e não oficial. Canvas 2D puro, sem dependências externas.
 * Projeto entregue como primeira versão jogável para GitHub Pages.
 */
(() => {
'use strict';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W=960,H=540, TAU=Math.PI*2, SAVE_KEY='lauana-reino-das-mares-v1';
const $ = id => document.getElementById(id);
const ui = {hud:$('hud'),overlay:$('mainOverlay'),pause:$('pauseOverlay'),roster:$('characterOverlay'),ending:$('endingOverlay'),dialogue:$('dialogue'),toast:$('toast')};
const CHARACTERS = [
 {id:'lauana',name:'Lauana',glyph:'♡',hair:'#33223e',skin:'#dda58e',dress:'#f77ebd',accent:'#ffbfe7',power:'Maré protetora',detail:'Afasta perigos e cria um escudo'},
 {id:'lagoona',name:'Lagoona',glyph:'♒',hair:'#f9de79',skin:'#8acddd',dress:'#eb70b4',accent:'#66ecf3',power:'Nado veloz',detail:'Nada mais rápido e não perde ar'},
 {id:'draculaura',name:'Draculaura',glyph:'♥',hair:'#201526',skin:'#f2c1ca',dress:'#ee4eac',accent:'#ff9cd6',power:'Salto noturno',detail:'Pula duas vezes e flutua'},
 {id:'frankie',name:'Frankie',glyph:'ϟ',hair:'#e8f5e7',skin:'#a4d9b5',dress:'#5367c9',accent:'#a3fcef',power:'Choque elétrico',detail:'Atordoa criaturas próximas'},
 {id:'clawdeen',name:'Clawdeen',glyph:'☾',hair:'#66402e',skin:'#ac7454',dress:'#b065d2',accent:'#ecb3ff',power:'Corrida lunar',detail:'Corre mais rápido e ganha impulso'}
];
const npcList=[
 {id:'draculaura',x:495,y:505,text:['Lauana! Você chegou bem na hora! Tem uma magia estranha saindo da piscina.','Encontre os emblemas brilhantes pela escola. Eles ajudam a abrir o caminho até Skull Shores!']},
 {id:'frankie',x:1030,y:480,text:['Detectei uma energia elétrica diferente no oceano!','Se precisar de ajuda, use meu poder com K ou o botão PODER.']},
 {id:'clawdeen',x:1310,y:735,text:['O visual da sua equipe pode ser trocado pelo botão PERSONAGENS!','Explora a escola com calma. O segredo está nas pequenas coisas, ghoul!']},
 {id:'lagoona',x:1460,y:365,text:['Lauana, as correntes levaram três conchas até a praia de Skull Shores!','Ache pelo menos dois emblemas na escola e use o portal rosa para chegar lá.']}
];
const schoolGems=[{x:620,y:620},{x:1080,y:360},{x:1370,y:800}];
const beachFloors=[
 {x:-100,y:463,w:670,h:180},{x:635,y:462,w:440,h:180},{x:1165,y:462,w:420,h:180},
 {x:1670,y:455,w:470,h:180},{x:2235,y:457,w:440,h:180},{x:2765,y:462,w:700,h:180},
 {x:345,y:355,w:123,h:18},{x:760,y:346,w:124,h:18},{x:1230,y:354,w:132,h:18},
 {x:1850,y:340,w:122,h:18},{x:2440,y:345,w:130,h:18},{x:3000,y:355,w:120,h:18}
];
const beachShells=[{x:414,y:310},{x:1895,y:295},{x:3060,y:310}];
const beachPearls=[{x:230,y:411},{x:420,y:285},{x:785,y:310},{x:960,y:420},{x:1280,y:320},{x:1465,y:420},{x:1730,y:416},{x:1900,y:305},{x:2085,y:406},{x:2490,y:308},{x:2610,y:418},{x:2870,y:416},{x:3060,y:285},{x:3290,y:417}];
const beachEnemies=[{x:840,min:735,max:1010,dir:1},{x:1450,min:1210,max:1515,dir:-1},{x:2040,min:1770,max:2110,dir:-1},{x:2500,min:2320,max:2620,dir:1},{x:3200,min:2850,max:3290,dir:-1}];
const reefCrystals=[{x:575,y:270},{x:1370,y:790},{x:2270,y:325}];
const reefPearls=[{x:245,y:370},{x:460,y:620},{x:700,y:380},{x:980,y:200},{x:1110,y:580},{x:1450,y:380},{x:1680,y:760},{x:1900,y:300},{x:2110,y:610},{x:2350,y:450},{x:2530,y:780}];
const reefBubbles=[{x:380,y:210},{x:815,y:520},{x:1190,y:280},{x:1530,y:800},{x:1950,y:490},{x:2380,y:690}];
const reefRocks=[{x:755,y:100,w:85,h:210},{x:1040,y:620,w:220,h:80},{x:1680,y:0,w:110,h:185},{x:1990,y:810,w:200,h:110}];
const reefEnemies=[{x:720,y:700,ox:720,oy:700,phase:0},{x:1100,y:390,ox:1100,oy:390,phase:1.7},{x:1660,y:490,ox:1660,oy:490,phase:4},{x:2130,y:660,ox:2130,oy:660,phase:2.3}];
const schoolObstacles=[{x:280,y:155,w:250,h:62},{x:280,y:290,w:250,h:48},{x:760,y:670,w:165,h:145},{x:1260,y:600,w:135,h:65},{x:1340,y:215,w:130,h:55},{x:80,y:80,w:70,h:70}];
const portalBeach={x:1580,y:492,r:95},portalReef={x:1568,y:886,r:90};
const state = {
 scene:'menu',health:3,pearls:0,char:'lauana',school:{x:350,y:550},beach:{x:80,y:350,vx:0,vy:0,ground:false,jumps:0},reef:{x:110,y:380,vx:0,vy:0,air:50},
 schoolTokens:[],beachShells:[],beachPearls:[],reefCrystals:[],reefPearls:[],schoolDone:false,beachDone:false,reefDone:false,
 checkpoint:80,abilityReady:0,shieldUntil:0,invulnUntil:0,bossHP:3,lastAttack:0,memoryWon:false,win:false,playTime:0,cam:{x:0,y:0},shake:0,particles:[],
 dialogue:null,dialogueIndex:0,paused:false,lastObjective:'',toastUntil:0,toastText:'',sound:true,frameTime:0,autosaveTime:0
};
const keys={left:false,right:false,up:false,down:false,jump:false,special:false,interact:false,attack:false};
let audioCtx=null;
const clamp=(a,l,h)=>Math.min(h,Math.max(l,a));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(x,y,xx,yy)=>Math.hypot(x-xx,y-yy);
const chr=()=>CHARACTERS.find(c=>c.id===state.char)||CHARACTERS[0];
const completed=(arr,index)=>arr.includes(index);
const near=(x,y,obj,r=65)=>dist(x,y,obj.x,obj.y)<r;
const within=(x,y,r)=>x>=r.x&&y>=r.y&&x<=r.x+r.w&&y<=r.y+r.h;
const collision=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const rand=(n)=>((Math.sin(n*127.1+78.233)*43758.5453)%1+1)%1;
function playSound(freq=660, duration=.09,type='sine',volume=.09){
 if(!state.sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioCtx??=new AC();if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(70,freq*.73),audioCtx.currentTime+duration);g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch(err){/* Audio opcional */}
}
function melody(){playSound(740,.16);setTimeout(()=>playSound(980,.16),95);setTimeout(()=>playSound(1320,.25),205)}
function showToast(t,seconds=2.3){state.toastText=t;state.toastUntil=performance.now()+seconds*1000;ui.toast.textContent=t;ui.toast.classList.remove('hidden')}
function hideToast(){ui.toast.classList.add('hidden')}
function emit(x,y,color='#f8c0ec',count=14){for(let i=0;i<count;i++){const a=Math.random()*TAU,sp=55+Math.random()*140;state.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.4+Math.random()*.5,max:.9,color,sz:2+Math.random()*4})}}
function updateParticles(dt){state.particles=state.particles.filter(p=>p.life>0);for(const p of state.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=50*dt;p.life-=dt}}
function renderParticles(){for(const p of state.particles){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,TAU);ctx.fill()}ctx.globalAlpha=1}
function safeSave(){if(state.scene==='menu')return;try{localStorage.setItem(SAVE_KEY,JSON.stringify({v:1,scene:state.scene,char:state.char,health:state.health,pearls:state.pearls,school:state.school,beach:{x:state.beach.x,y:state.beach.y},reef:{x:state.reef.x,y:state.reef.y},schoolTokens:state.schoolTokens,beachShells:state.beachShells,beachPearls:state.beachPearls,reefCrystals:state.reefCrystals,reefPearls:state.reefPearls,schoolDone:state.schoolDone,beachDone:state.beachDone,reefDone:state.reefDone,checkpoint:state.checkpoint,win:state.win,bossHP:state.bossHP,memoryWon:state.memoryWon,playTime:state.playTime}))}catch(err){/* Privacidade ou armazenamento bloqueado */}}
function savedData(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return raw?.v===1&&['school','beach','reef'].includes(raw.scene)?raw:null}catch(err){return null}}
function restoreSave(data){if(!data)return false;const arrayOr=(x)=>Array.isArray(x)?x.filter(n=>Number.isInteger(n)&&n>=0&&n<50):[];state.scene=data.scene;state.char=CHARACTERS.some(c=>c.id===data.char)?data.char:'lauana';state.health=clamp(Number(data.health)||3,1,3);state.pearls=clamp(Number(data.pearls)||0,0,9999);state.school={x:clamp(Number(data.school?.x)||350,100,1640),y:clamp(Number(data.school?.y)||550,90,965)};state.beach={x:clamp(Number(data.beach?.x)||80,20,3330),y:clamp(Number(data.beach?.y)||340,0,500),vx:0,vy:0,ground:false,jumps:0};state.reef={x:clamp(Number(data.reef?.x)||110,50,2590),y:clamp(Number(data.reef?.y)||380,45,930),vx:0,vy:0,air:50};state.schoolTokens=arrayOr(data.schoolTokens);state.beachShells=arrayOr(data.beachShells);state.beachPearls=arrayOr(data.beachPearls);state.reefCrystals=arrayOr(data.reefCrystals);state.reefPearls=arrayOr(data.reefPearls);state.schoolDone=!!data.schoolDone;state.beachDone=!!data.beachDone;state.reefDone=!!data.reefDone;state.checkpoint=clamp(Number(data.checkpoint)||80,80,2700);state.win=!!data.win;state.bossHP=clamp(Number(data.bossHP??3),0,3);state.memoryWon=!!data.memoryWon;state.playTime=Number(data.playTime)||0;state.abilityReady=0;return true}
function newGame(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}Object.assign(state,{scene:'school',health:3,pearls:0,char:'lauana',school:{x:350,y:550},beach:{x:80,y:350,vx:0,vy:0,ground:false,jumps:0},reef:{x:110,y:380,vx:0,vy:0,air:50},schoolTokens:[],beachShells:[],beachPearls:[],reefCrystals:[],reefPearls:[],schoolDone:false,beachDone:false,reefDone:false,checkpoint:80,abilityReady:0,shieldUntil:0,invulnUntil:0,bossHP:3,lastAttack:0,memoryWon:false,win:false,playTime:0,particles:[],paused:false});beginGame();speak('Lauana',['Bem-vinda à Monster High, Lauana! ♡','O oceano começou a brilhar com uma magia desconhecida... Explore a escola e encontre dois emblemas para abrir o caminho da praia.']);}
function beginGame(){ui.overlay.classList.add('hidden');ui.pause.classList.add('hidden');ui.ending.classList.add('hidden');$('memoryOverlay').classList.add('hidden');ui.hud.classList.remove('hidden');state.paused=false;updateHUD();safeSave();canvas.focus({preventScroll:true})}
function openMenu(){safeSave();state.paused=true;ui.dialogue.classList.add('hidden');state.dialogue=null;ui.roster.classList.add('hidden');ui.pause.classList.add('hidden');ui.ending.classList.add('hidden');$('memoryOverlay').classList.add('hidden');ui.overlay.classList.remove('hidden');ui.hud.classList.add('hidden');$('continueBtn').hidden=!savedData();releaseControls()}
function speak(name,lines){state.dialogue={name,lines};state.dialogueIndex=0;renderDialogue();releaseControls()}
function renderDialogue(){const d=state.dialogue;if(!d){ui.dialogue.classList.add('hidden');return}ui.dialogue.classList.remove('hidden');$('dialogueName').textContent=d.name;$('dialogueText').textContent=d.lines[state.dialogueIndex];const c=CHARACTERS.find(c=>c.name===d.name);$('dialogueAvatar').textContent=c?.glyph||'✦';$('dialogueAvatar').style.background=`linear-gradient(135deg,${c?.dress||'#7c53bb'},#47316e)`}
function nextDialogue(){if(!state.dialogue)return;state.dialogueIndex++;if(state.dialogueIndex>=state.dialogue.lines.length){state.dialogue=null;ui.dialogue.classList.add('hidden')}else renderDialogue();playSound(580,.045)}
function pauseGame(){if(state.scene==='menu'||!ui.ending.classList.contains('hidden'))return;if(state.dialogue){nextDialogue();return}if(!ui.roster.classList.contains('hidden')){closeRoster();return}state.paused=!state.paused;ui.pause.classList.toggle('hidden',!state.paused);$('pauseObjective').textContent=state.lastObjective;releaseControls();if(state.paused)safeSave()}
function rosterOpen(){if(state.scene==='menu'||state.dialogue||!ui.pause.classList.contains('hidden')||!ui.ending.classList.contains('hidden'))return;releaseControls();ui.roster.classList.remove('hidden');state.paused=true;renderRoster()}
function closeRoster(){ui.roster.classList.add('hidden');state.paused=false;canvas.focus({preventScroll:true})}
function renderRoster(){$('rosterGrid').innerHTML='';for(const c of CHARACTERS){const b=document.createElement('button');b.className='roster-option'+(state.char===c.id?' selected':'');b.innerHTML=`<span class="roster-icon-face" style="color:${c.accent}">${c.glyph}</span><strong>${c.name}</strong><small>${c.power}</small>`;b.addEventListener('click',()=>{state.char=c.id;playSound(850,.12);closeRoster();updateHUD();safeSave();showToast(`${c.name} selecionada • ${c.power}`)});$('rosterGrid').appendChild(b)}}
function changeScene(scene){state.scene=scene;state.cam={x:0,y:0};state.health=3;state.particles=[];state.abilityReady=0;state.invulnUntil=0;state.shieldUntil=0;state.paused=false;if(scene==='beach'){for(const enemy of beachEnemies)enemy.defeated=false;state.schoolDone=true;state.bossHP=3;state.beach={x:80,y:330,vx:0,vy:0,ground:false,jumps:0};state.checkpoint=80;speak('Lagoona',['Bem-vinda a Skull Shores! Use as plataformas e colete três conchas encantadas.','Pule com ESPAÇO (ou PULAR no celular) e cuidado com os caranguejos. O portal fica no fim da praia!'])}if(scene==='reef'){for(const enemy of reefEnemies)enemy.defeated=false;state.beachDone=true;state.reef={x:110,y:380,vx:0,vy:0,air:50};speak('Lagoona',['O Great Scarrier Reef está cheio de magia! Nade para os lados, para cima e para baixo.','Encontre três cristais mágicos e alcance o palácio brilhante. Lagoona pode respirar debaixo d’água para sempre!'])}if(scene==='school'){state.school={x:350,y:550};showToast('Bem-vinda de volta à Monster High!')}safeSave();updateHUD();melody()}
function completeAdventure(){state.reefDone=true;state.win=true;safeSave();state.paused=true;releaseControls();ui.ending.classList.remove('hidden');$('endingStats').textContent=`✧ ${state.pearls} pérolas • ${state.schoolTokens.length}/3 emblemas • ${state.beachShells.length}/3 conchas • ${state.reefCrystals.length}/3 cristais`;melody();for(let i=0;i<70;i++)emit(Math.random()*W,Math.random()*H,'#ff9bdd',3)}
function updateHUD(){if(state.scene==='menu')return;$('lifeLabel').textContent='♥ '.repeat(state.health)+'♡ '.repeat(3-state.health);$('pearlsLabel').textContent=String(state.pearls).padStart(3,'0');const titles={school:'MONSTER HIGH',beach:'SKULL SHORES',reef:'GREAT SCARRIER REEF'};$('locationLabel').textContent=titles[state.scene]||'';$('activeCharacter').textContent=chr().name.toUpperCase();$('activePower').textContent=`PODER: ${chr().power.toUpperCase()}`;let qt,desc,prog,done,pmax,part;if(state.scene==='school'){qt='Os emblemas da escola';desc='Explore corredores, converse com as ghouls e encontre 2 emblemas para abrir o portal de Skull Shores.';done=Math.min(2,state.schoolTokens.length);pmax=2;part=`EMBLEMAS: ${state.schoolTokens.length}/2`;if(state.schoolTokens.length>=2){qt='O portal de Skull Shores';desc='Emblemas encontrados! Vá ao portal rosa do lado direito da escola e pressione E ou FALAR.';part='PORTAL DESBLOQUEADO';done=2}}else if(state.scene==='beach'){qt='As três conchas mágicas';desc='Corra, pule, evite os caranguejos e reúna as três conchas. O portal oceânico fica no fim da praia.';done=state.beachShells.length;pmax=3;part=`CONCHAS: ${done}/3`}else{qt='O coração do oceano';desc='Nade pelo recife e encontre 3 cristais. Use bolhas de ar e encontre o grande portal no fim do oceano.';done=state.reefCrystals.length;pmax=3;part=`CRISTAIS: ${done}/3`}state.lastObjective=desc;$('questTitle').textContent=qt;$('questDescription').textContent=desc;$('questProgressText').textContent=part;$('questProgressBar').style.width=`${(done/pmax)*100}%`;$('itemsLabel').textContent=`${done}/${pmax}`;for(const [id,ok,complete] of [['School',true,state.schoolDone],['Beach',state.schoolDone,state.beachDone],['Reef',state.beachDone,state.reefDone]]){const el=$('chapter'+id);el.classList.toggle('unlocked',!!ok);el.classList.toggle('completed',!!complete);el.querySelector('.chapter-status').textContent=complete?'✓':ok?'●':'○'}}
function collect(arr,idx,x,y,color,desc){if(completed(arr,idx))return;arr.push(idx);state.pearls+=desc==='pérola'?1:10;emit(x,y,color,22);playSound(900,.12);if(desc!=='pérola'){showToast(`${desc} encontrado! ✦`);safeSave()}updateHUD()}
function takeDamage(hint='Ai! Cuidado com as criaturas!'){const t=performance.now();if(t<state.invulnUntil||t<state.shieldUntil)return;state.health--;state.invulnUntil=t+1700;state.shake=10;playSound(165,.23,'sawtooth',.12);showToast(hint,1.2);if(state.health<=0){state.health=3;if(state.scene==='beach'){state.beach.x=state.checkpoint;state.beach.y=285;state.beach.vx=state.beach.vy=0}else if(state.scene==='reef'){state.reef.x=Math.max(110,state.reef.x-280);state.reef.y=380;state.reef.air=50}else{state.school.x=350;state.school.y=550}showToast('Recomeçando do último ponto! ♡',2.2)}updateHUD()}
function power(){if(state.scene==='menu'||state.paused||state.dialogue)return;let t=performance.now();if(t<state.abilityReady){showToast('Poder recarregando... ✧',.8);return}state.abilityReady=t+5700;playSound(390,.23,'triangle');if(state.char==='lauana'){state.shieldUntil=t+3200;showToast('♡ Escudo das marés ativado!');}else if(state.char==='frankie'){for(const enemy of beachEnemies)enemy.stunnedUntil=t+3000;for(const enemy of reefEnemies)enemy.stunnedUntil=t+3000;showToast('ϟ Choque elétrico! Inimigos atordoados.')}else if(state.char==='clawdeen'){state.boostUntil=t+3300;showToast('☾ Velocidade lunar!')}else if(state.char==='lagoona'){state.reef.air=50;state.boostUntil=t+2600;showToast('♒ Correnteza veloz!')}else if(state.char==='draculaura'){state.floatUntil=t+4000;showToast('♥ Flutuação noturna!')}let p=playerWorldPos();emit(p.x,p.y,chr().accent,28)}
function playerWorldPos(){return state.scene==='school'?state.school:state.scene==='beach'?{x:state.beach.x+17,y:state.beach.y+25}:state.reef}
function interact(){if(state.dialogue){nextDialogue();return}if(state.paused)return;if(state.scene==='school'){const p=state.school;const npc=npcList.filter(n=>near(p.x,p.y,n,84)).sort((a,b)=>dist(p.x,p.y,a.x,a.y)-dist(p.x,p.y,b.x,b.y))[0];if(npc){const c=CHARACTERS.find(c=>c.id===npc.id);speak(c.name,npc.text);return}if(near(p.x,p.y,{x:969,y:236},80)){openMemoryGame();return}if(near(p.x,p.y,portalBeach,100)){if(state.schoolTokens.length<2){speak('Portal das Marés',['O portal ainda está selado. Encontre pelo menos dois emblemas luminosos na escola para atravessar!']);return}changeScene('beach');return}if(near(p.x,p.y,portalReef,96)){if(!state.beachDone){speak('Portal do Recife',['Para abrir este portal, primeiro complete a aventura na praia de Skull Shores!']);return}changeScene('reef');return}showToast('Chegue perto de alguém ou de um portal!',1.3)}else if(state.scene==='beach'){if(state.beach.x>3260){if(state.beachShells.length!==3)showToast(`Faltam ${3-state.beachShells.length} concha(s) para abrir o portal.`);else if(state.bossHP>0)showToast('Derrote o caranguejo gigante para abrir o portal!');else changeScene('reef')}else showToast('Encontre o portal no fim da praia!',1.2)}else if(state.scene==='reef'){if(near(state.reef.x,state.reef.y,{x:2550,y:500},104)){if(state.reefCrystals.length===3)completeAdventure();else showToast(`Ainda faltam ${3-state.reefCrystals.length} cristais!`)}else showToast('Siga as luzes até o portal!',1.1)}}
function attack(){
 if(state.scene==='menu'||state.paused||state.dialogue||state.scene==='school')return;
 const now=performance.now();if(now-state.lastAttack<390)return;
 state.lastAttack=now;playSound(320,.10,'triangle');const p=playerWorldPos();emit(p.x+24,p.y,chr().accent,6);
 if(state.scene==='beach'){
  for(const enemy of beachEnemies)if(!enemy.defeated&&Math.abs(enemy.x-p.x)<81&&Math.abs(435-p.y)<76){enemy.defeated=true;emit(enemy.x,425,'#a8f6ef',20);showToast('Criatura derrotada! ✦',.9);state.pearls+=3;updateHUD()}
  if(state.bossHP>0&&Math.abs(3190-p.x)<112&&Math.abs(412-p.y)<89){state.bossHP--;emit(3190,398,'#ffb4ed',40);state.shake=9;if(state.bossHP===0){showToast('CHEFE VENCIDO! O portal está livre! ♡',3);melody();state.pearls+=25;safeSave()}else showToast(`Caranguejo gigante: ${state.bossHP}/3 ♥`,.9);updateHUD()}
 }else if(state.scene==='reef'){
  for(const enemy of reefEnemies)if(!enemy.defeated&&dist(enemy.x,enemy.y,p.x,p.y)<91){enemy.defeated=true;emit(enemy.x,enemy.y,'#a8f6ef',22);showToast('Água-viva dispersada! ✦',.9);state.pearls+=3;updateHUD()}
 }
}
let memoryGame=null;
function openMemoryGame(){if(state.scene!=='school'||state.paused)return;state.paused=true;releaseControls();const icons=['🐚','🪸','🦇','💎','🦋','🌙'];const cards=[...icons,...icons].sort(()=>Math.random()-.5);memoryGame={cards,visible:[],matched:[],busy:false,moves:0};$('memoryOverlay').classList.remove('hidden');renderMemory()}
function renderMemory(){if(!memoryGame)return;const m=memoryGame;$('memoryGrid').innerHTML='';$('memoryStatus').textContent=m.matched.length/2===6?`TODOS OS PARES! ${state.memoryWon?'PARABÉNS!':'PARABÉNS!'}`:`${m.matched.length/2}/6 PARES • ${m.moves} TENTATIVAS`;
 for(let i=0;i<12;i++){const btn=document.createElement('button');const shown=m.visible.includes(i)||m.matched.includes(i);btn.className='memory-tile'+(shown?' flipped':'')+(m.matched.includes(i)?' matched':'');btn.textContent=shown?m.cards[i]:'✦';btn.disabled=m.matched.includes(i);btn.setAttribute('aria-label',shown?`Carta ${m.cards[i]}`:`Virar carta ${i+1}`);btn.addEventListener('click',()=>memoryFlip(i));$('memoryGrid').appendChild(btn)}}
function memoryFlip(i){const m=memoryGame;if(!m||m.busy||m.matched.includes(i)||m.visible.includes(i))return;m.visible.push(i);playSound(550,.06);if(m.visible.length===2){m.moves++;if(m.cards[m.visible[0]]===m.cards[m.visible[1]]){m.matched.push(...m.visible);m.visible=[];melody();if(m.matched.length===12){if(!state.memoryWon){state.pearls+=30;state.memoryWon=true;showToast('Minigame concluído! +30 pérolas ♡',3);updateHUD();safeSave()}else showToast('Você completou todos os pares! ♡');}}else{m.busy=true;setTimeout(()=>{if(memoryGame!==m)return;m.visible=[];m.busy=false;renderMemory()},850)}}renderMemory()}
function closeMemory(){memoryGame=null;$('memoryOverlay').classList.add('hidden');state.paused=false;canvas.focus({preventScroll:true});safeSave()}
$('memoryExit').addEventListener('click',closeMemory);
function jump(){if(state.dialogue){nextDialogue();return}if(state.scene!=='beach'||state.paused)return;const p=state.beach;if(p.ground){p.vy=-650;p.ground=false;p.jumps=1;playSound(400,.09)}else if(state.char==='draculaura'&&p.jumps<2){p.vy=-585;p.jumps=2;playSound(710,.1)}}
function useControl(action){if(action==='jump')jump();else if(action==='special')power();else if(action==='interact')interact();else if(action==='attack')attack()}
function releaseControls(){for(const k of Object.keys(keys))keys[k]=false;document.querySelectorAll('.active.touch-key,.active.touch-action').forEach(b=>b.classList.remove('active'))}
const keyCodes={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'jump',KeyK:'special',KeyX:'special',KeyJ:'attack',KeyZ:'attack',KeyE:'interact',Enter:'interact'};
document.addEventListener('keydown',(e)=>{const key=keyCodes[e.code];if(key||['Escape','KeyQ'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(!e.repeat)pauseGame();return}if(e.code==='KeyQ'){if(!e.repeat)rosterOpen();return}if(!key)return;if(!keys[key]&&!e.repeat&&['jump','special','interact','attack'].includes(key))useControl(key);keys[key]=true});
document.addEventListener('keyup',e=>{const key=keyCodes[e.code];if(key)keys[key]=false});window.addEventListener('blur',()=>{releaseControls();if(!state.paused&&state.scene!=='menu'&&!state.dialogue&&ui.ending.classList.contains('hidden'))pauseGame()});
for(const button of document.querySelectorAll('[data-control]')){const control=button.dataset.control;const stop=e=>{e.preventDefault();keys[control]=false;button.classList.remove('active')};button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);if(!keys[control]&&['jump','special','interact','attack'].includes(control))useControl(control);keys[control]=true;button.classList.add('active')});button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop)}
document.querySelector('[data-action="roster"]').addEventListener('click',rosterOpen);
$('startBtn').addEventListener('click',newGame);
$('continueBtn').addEventListener('click',()=>{if(restoreSave(savedData())){beginGame();showToast('Seu progresso foi recuperado! ✦')}else newGame()});
$('pauseBtn').addEventListener('click',pauseGame);$('resumeBtn').addEventListener('click',pauseGame);$('menuBtn').addEventListener('click',openMenu);
$('restartStageBtn').addEventListener('click',()=>{ui.pause.classList.add('hidden');state.paused=false;const s=state.scene;if(s==='school'){state.school={x:350,y:550}}else if(s==='beach'){state.beach={x:state.checkpoint,y:310,vx:0,vy:0,ground:false,jumps:0}}else{state.reef={x:110,y:380,vx:0,vy:0,air:50}}state.health=3;safeSave();updateHUD();showToast('Fase reiniciada! ✦')});
$('rosterBtn').addEventListener('click',rosterOpen);$('rosterCloseBtn').addEventListener('click',closeRoster);$('dialogueNext').addEventListener('click',nextDialogue);$('dialogue').addEventListener('click',e=>{if(!e.target.closest('button'))nextDialogue()});
$('returnSchoolBtn').addEventListener('click',()=>{ui.ending.classList.add('hidden');changeScene('school')});$('replayBtn').addEventListener('click',newGame);
$('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'♫':'♪̸';$('soundBtn').title=state.sound?'Desativar som':'Ativar som';if(state.sound)playSound(900,.14)});
$('fullscreenBtn').addEventListener('click',()=>{const el=$('gameFrame');if(document.fullscreenElement)document.exitFullscreen?.();else el.requestFullscreen?.().catch(()=>showToast('Tela cheia indisponível aqui.'))});
window.addEventListener('pagehide',safeSave);window.addEventListener('beforeunload',safeSave);
function update(dt){state.frameTime+=dt;if(performance.now()>state.toastUntil&&!ui.toast.classList.contains('hidden'))hideToast();if(state.scene==='menu'||state.paused||state.dialogue)return;state.playTime+=dt;state.autosaveTime+=dt;if(state.autosaveTime>8){state.autosaveTime=0;safeSave()}if(state.scene==='school')updateSchool(dt);else if(state.scene==='beach')updateBeach(dt);else if(state.scene==='reef')updateReef(dt);updateParticles(dt);if(state.shake>0)state.shake=Math.max(0,state.shake-dt*24)}
function updateSchool(dt){const p=state.school;const d=chr();let dx=Number(keys.right)-Number(keys.left),dy=Number(keys.down)-Number(keys.up);const norm=Math.hypot(dx,dy)||1;let speed=(d.id==='clawdeen'?282:238)*(performance.now()<state.boostUntil?1.6:1);dx=dx/norm*speed*dt;dy=dy/norm*speed*dt;let next=clamp(p.x+dx,72,1685);let coll=schoolObstacles.some(r=>within(next,p.y,{x:r.x-22,y:r.y-17,w:r.w+44,h:r.h+34}));if(!coll)p.x=next;next=clamp(p.y+dy,74,1013);coll=schoolObstacles.some(r=>within(p.x,next,{x:r.x-22,y:r.y-17,w:r.w+44,h:r.h+34}));if(!coll)p.y=next;for(let i=0;i<schoolGems.length;i++)if(!completed(state.schoolTokens,i)&&near(p.x,p.y,schoolGems[i],33))collect(state.schoolTokens,i,schoolGems[i].x,schoolGems[i].y,'#ffa2ed','Emblema');}
function updateBeach(dt){const p=state.beach;let dx=Number(keys.right)-Number(keys.left);const speed=(state.char==='clawdeen'?334:274)*(performance.now()<state.boostUntil?1.45:1);p.vx=dx*speed;const oldX=p.x;const oldY=p.y;p.x=clamp(p.x+p.vx*dt,0,3420);let box={x:p.x+5,y:p.y+5,w:24,h:48};for(const f of beachFloors){if(collision(box,f)&&oldX+29<=f.x+2){p.x=f.x-29}else if(collision(box,f)&&oldX>=f.x+f.w-3){p.x=f.x+f.w-4}}p.vy+=1600*dt;if(state.char==='draculaura'&&keys.jump&&p.vy>0&&performance.now()<state.floatUntil)p.vy=Math.min(p.vy,160);p.vy=Math.min(950,p.vy);p.y+=p.vy*dt;p.ground=false;box={x:p.x+5,y:p.y+5,w:24,h:48};for(const f of beachFloors){if(collision(box,f)&&oldY+53<=f.y+12&&p.vy>=0){p.y=f.y-53;p.vy=0;p.ground=true;p.jumps=0;box.y=p.y+5}else if(collision(box,f)&&oldY>=f.y+f.h-12&&p.vy<0){p.y=f.y+f.h-5;p.vy=0;box.y=p.y+5}}if(p.y>H+100){takeDamage('Você caiu no mar!');p.x=state.checkpoint;p.y=250;p.vy=0;p.vx=0}
 for(let i=0;i<beachPearls.length;i++)if(!completed(state.beachPearls,i)&&near(p.x+17,p.y+27,beachPearls[i],34))collect(state.beachPearls,i,beachPearls[i].x,beachPearls[i].y,'#91f5ef','pérola');
 for(let i=0;i<beachShells.length;i++)if(!completed(state.beachShells,i)&&near(p.x+17,p.y+27,beachShells[i],43))collect(state.beachShells,i,beachShells[i].x,beachShells[i].y,'#ffa3d9','Concha mágica');
 const t=performance.now();for(const enemy of beachEnemies){if(enemy.defeated)continue;if(!enemy.stunnedUntil||t>enemy.stunnedUntil)enemy.x+=enemy.dir*48*dt;if(enemy.x<enemy.min||enemy.x>enemy.max)enemy.dir*=-1;if(t>(enemy.stunnedUntil||0)&&Math.abs(p.x+17-enemy.x)<34&&Math.abs(p.y+32-435)<43)takeDamage('Um caranguejo te acertou!')}
 for(const check of [700,1660,2270,2800])if(p.x>check&&state.checkpoint<check){state.checkpoint=check;showToast('✦ Checkpoint ativado!',1.2);safeSave()}
 if(state.bossHP>0&&Math.abs(p.x+15-3190)<86&&Math.abs(p.y+28-410)<88)takeDamage('O caranguejo gigante atacou!');
 if(p.x>3270&&state.beachShells.length===3&&state.bossHP===0&&keys.up)interact();}
function updateReef(dt){const p=state.reef;const mx=Number(keys.right)-Number(keys.left),my=Number(keys.down)-Number(keys.up),norm=Math.hypot(mx,my)||1;let speed=(state.char==='lagoona'?317:225)*(performance.now()<state.boostUntil?1.35:1);let driftX=0,driftY=0;for(const current of [{x:675,y:310,w:320,h:240,vx:110,vy:-35},{x:1580,y:470,w:350,h:220,vx:-105,vy:32},{x:2180,y:150,w:260,h:320,vx:40,vy:90}])if(within(p.x,p.y,current)){driftX+=current.vx;driftY+=current.vy}
 p.vx=lerp(p.vx,mx/norm*speed+driftX,Math.min(1,dt*6));p.vy=lerp(p.vy,my/norm*speed+driftY,Math.min(1,dt*6));let nextX=clamp(p.x+p.vx*dt,45,2610);if(!reefRocks.some(r=>within(nextX,p.y,{x:r.x-20,y:r.y-25,w:r.w+40,h:r.h+50})))p.x=nextX;let nextY=clamp(p.y+p.vy*dt,70,935);if(!reefRocks.some(r=>within(p.x,nextY,{x:r.x-20,y:r.y-25,w:r.w+40,h:r.h+50})))p.y=nextY;
 if(state.char==='lagoona'||state.char==='lauana'&&performance.now()<state.shieldUntil){p.air=50}else{p.air-=dt;if(p.air<=0){p.air=50;takeDamage('Faltou ar! Pegue as bolhas brilhantes.')}}for(const bubble of reefBubbles)if(near(p.x,p.y,bubble,57))p.air=50;
 for(let i=0;i<reefCrystals.length;i++)if(!completed(state.reefCrystals,i)&&near(p.x,p.y,reefCrystals[i],40))collect(state.reefCrystals,i,reefCrystals[i].x,reefCrystals[i].y,'#93fdf1','Cristal oceânico');
 for(let i=0;i<reefPearls.length;i++)if(!completed(state.reefPearls,i)&&near(p.x,p.y,reefPearls[i],36))collect(state.reefPearls,i,reefPearls[i].x,reefPearls[i].y,'#9cfcef','pérola');
 const t=performance.now();for(const enemy of reefEnemies){if(enemy.defeated)continue;enemy.x=enemy.ox+Math.cos(state.frameTime*1.1+enemy.phase)*75;enemy.y=enemy.oy+Math.sin(state.frameTime*1.6+enemy.phase)*65;if(t>(enemy.stunnedUntil||0)&&dist(p.x,p.y,enemy.x,enemy.y)<40)takeDamage('Cuidado com as águas-vivas!')}
 if(near(p.x,p.y,{x:2550,y:500},82)&&state.reefCrystals.length===3&&keys.up)interact();}
// ====================== ILUSTRAÇÕES DESENHADAS NO CANVAS ======================
function rect(x,y,w,h,fill,r=0){ctx.fillStyle=fill;ctx.beginPath();if(r)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill()}
function line(x1,y1,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill()}
function glow(x,y,r,color){const grad=ctx.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,color);grad.addColorStop(1,'transparent');circle(x,y,r,grad)}
function label(text,x,y,color='#fbe4ff',size=12,align='center',weight='bold'){ctx.save();ctx.fillStyle=color;ctx.font=`${weight} ${size}px Trebuchet MS, Verdana, sans-serif`;ctx.textAlign=align;ctx.shadowColor='#0e0b21';ctx.shadowBlur=5;ctx.fillText(text,x,y);ctx.restore()}
function star(x,y,r=8,color='#ffd2fa',phase=0){ctx.save();ctx.translate(x,y);ctx.rotate(phase);ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(r*.22,-r*.2,r,0);ctx.quadraticCurveTo(r*.22,r*.2,0,r);ctx.quadraticCurveTo(-r*.22,r*.2,-r,0);ctx.quadraticCurveTo(-r*.22,-r*.2,0,-r);ctx.closePath();ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fill();ctx.restore()}
function heart(x,y,s=7,color='#ff9fdf'){ctx.save();ctx.translate(x,y);ctx.scale(s/10,s/10);ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-18,-4,-8,-14,0,-6);ctx.bezierCurveTo(8,-14,18,-4,0,7);ctx.fillStyle=color;ctx.fill();ctx.restore()}
function gothicWindow(x,y,w=62,h=112){ctx.save();ctx.shadowColor='#5ee6fb';ctx.shadowBlur=16;rect(x,y+20,w,h-20,'#18244e',5);ctx.beginPath();ctx.arc(x+w/2,y+24,w/2,Math.PI,TAU);ctx.lineTo(x+w,y+25);ctx.closePath();ctx.fill();ctx.shadowBlur=0;line(x+w/2,y+17,x+w/2,y+h-5,'#886fa4',3);line(x+4,y+h*.54,x+w-4,y+h*.54,'#886fa4',3);rect(x-5,y+h-12,w+10,15,'#755880',3);ctx.restore()}
function drawChibi(x,y,scale,c,step=0){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const bob=Math.sin(state.frameTime*7+step)*1.5;
 ellipse(0,33,22,6,'#07092355');
 ctx.translate(0,bob);
 // cabelo posterior
 ellipse(0,-21,22,31,c.hair);
 ellipse(-13,-2,9,25,c.hair);
 ellipse(14,-2,9,25,c.hair);
 // pernas e botas
 rect(-12,16,10,19,'#e1acc3',3);rect(3,16,10,19,'#dfacbb',3);
 rect(-16,31,15,7,'#26233f',4);rect(3,31,15,7,'#26233f',4);
 // vestido e mangas
 ctx.beginPath();ctx.moveTo(-12,-6);ctx.lineTo(12,-6);ctx.lineTo(21,25);ctx.lineTo(-20,25);ctx.closePath();ctx.fillStyle=c.dress;ctx.fill();
 rect(-24,-6,10,23,c.skin,5);rect(14,-6,10,23,c.skin,5);
 line(-12,10,12,10,'#ffffff73',2);
 star(0,9,5,c.accent);
 // rosto
 ellipse(0,-24,19.2,22,c.skin);
 // franja em 3 pontas
 ctx.beginPath();ctx.moveTo(-19,-30);ctx.quadraticCurveTo(-12,-55,0,-44);ctx.quadraticCurveTo(14,-55,19,-32);ctx.lineTo(13,-33);ctx.lineTo(5,-37);ctx.lineTo(-2,-30);ctx.lineTo(-9,-39);ctx.lineTo(-17,-30);ctx.closePath();ctx.fillStyle=c.hair;ctx.fill();
 if(c.id==='draculaura'){rect(-15,-26,5,22,'#fa70b4',3);heart(12,-13,4,'#ef4e94')}
 if(c.id==='frankie'){rect(-13,-44,6,18,'#252b42',2);line(-15,-10,-6,-8,'#789d95',1)}
 if(c.id==='lagoona'){ctx.beginPath();ctx.moveTo(-20,-23);ctx.lineTo(-28,-34);ctx.lineTo(-27,-9);ctx.closePath();ctx.fillStyle='#69eae2';ctx.fill();}
 if(c.id==='clawdeen'){ctx.beginPath();ctx.moveTo(-19,-40);ctx.lineTo(-24,-55);ctx.lineTo(-9,-46);ctx.fillStyle=c.hair;ctx.fill();ctx.beginPath();ctx.moveTo(19,-40);ctx.lineTo(24,-55);ctx.lineTo(9,-46);ctx.fill()}
 ellipse(-7,-23,3.2,4.4,'#241d32');ellipse(7,-23,3.2,4.4,'#241d32');circle(-6.2,-25.1,1,'#fff');circle(7.8,-25.1,1,'#fff');
 ellipse(0,-13,4,2.2,'#f58aa9');ellipse(-13,-15,3.8,2,'#ffb0ca99');ellipse(13,-15,3.8,2,'#ffb0ca99');
 if(c.id==='lauana'){heart(-16,-37,4,'#ffc4e9');star(16,-47,5,'#b5ffff')}
 ctx.restore();
}
function drawCollectible(x,y,type,t){const wave=Math.sin(t*3+x*.016)*4;glow(x,y+wave,23,type==='pearl'?'#8bfff159':type==='crystal'?'#49fffb72':'#ff86d967');ctx.save();ctx.translate(x,y+wave);if(type==='shell'){ctx.rotate(-.15);ellipse(0,0,15,13,'#ffb5d5');for(let a=-2;a<=2;a++)line(0,11,a*6,-8,'#e972b2',2);star(0,-3,5,'#ffeffa')}else if(type==='crystal'){ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(14,-5);ctx.lineTo(11,12);ctx.lineTo(0,21);ctx.lineTo(-11,11);ctx.lineTo(-14,-5);ctx.closePath();ctx.fillStyle='#79ffec';ctx.fill();line(0,-20,0,18,'#ffffff99',2);line(-12,-5,12,-5,'#d7ffff',2)}else if(type==='pearl'){circle(0,0,8,'#a7fff2');circle(-2,-2,3,'#ffffff');}else{star(0,0,14,'#ffaddb',t*.3)}ctx.restore()}
function drawMenuArt(){
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#121a3b');sky.addColorStop(.5,'#432d72');sky.addColorStop(1,'#0b697a');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 glow(745,140,240,'#71e9fb47');circle(750,146,65,'#d3f6ff');circle(774,121,62,'#292958');
 for(let i=0;i<80;i++){let x=rand(i+30)*W,y=rand(i+140)*360;circle(x,y,.7+rand(i*3)*2,'#b7eafd9e');if(i%9===0)star(x,y,3,'#ffe3f8',state.frameTime*.12)}
 // silhueta da escola (original)
 rect(0,300,W,240,'#092a40');
 for(let i=0;i<10;i++){const bx=i*125-10,bh=70+rand(i*5)*110;rect(bx,310-bh,94,bh+70,'#171c38');ctx.beginPath();ctx.moveTo(bx-10,310-bh);ctx.lineTo(bx+47,262-bh);ctx.lineTo(bx+102,310-bh);ctx.fillStyle='#171c38';ctx.fill();rect(bx+39,245-bh,16,65,'#171c38');gothicWindow(bx+21,300-bh,24,55)}
 const ocean=ctx.createLinearGradient(0,325,0,540);ocean.addColorStop(0,'#156578');ocean.addColorStop(1,'#112b55');rect(0,354,960,190,ocean);
 for(let row=0;row<8;row++){ctx.beginPath();let y=360+row*26;ctx.moveTo(0,y);for(let x=0;x<=W;x+=15)ctx.lineTo(x,y+Math.sin(x*.023+state.frameTime*(.5+row*.1)+row)*7);ctx.strokeStyle=row%2?'#63e6eb21':'#f38ecc18';ctx.lineWidth=2;ctx.stroke()}
 for(let i=0;i<18;i++){let x=i*67+25;glow(x,440+rand(i)*95,25,'#68ffe72c');if(i%3===0)star(x,435+rand(i)*60,6,'#84ffdc')}
}
function drawSchool(){
 const p=state.school;state.cam.x=lerp(state.cam.x,clamp(p.x-W*.5,0,1750-W),.12);state.cam.y=lerp(state.cam.y,clamp(p.y-H*.5,0,1080-H),.12);
 const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#181832');grad.addColorStop(1,'#342044');rect(0,0,W,H,grad);
 ctx.save();ctx.translate(-state.cam.x,-state.cam.y);
 rect(35,35,1680,1012,'#201b38',32);rect(48,48,1653,985,'#4e3c65',24);
 // piso em xadrez gótico
 for(let y=65;y<1010;y+=78)for(let x=68;x<1685;x+=78){const col=(Math.floor(x/78)+Math.floor(y/78))%2?'#3a3154':'#403453';rect(x,y,76,76,col)}
 // tapetes centrais e passarela
 rect(92,425,1570,195,'#6b3966',24);rect(100,433,1554,179,'#813f70',18);rect(108,442,1538,160,'#542a59',14);
 rect(595,82,270,881,'#452c62',18);rect(609,94,242,855,'#63366d',14);for(let i=0;i<14;i++)star(732,125+i*59,7,'#db93d59b');
 // salões
 rect(100,95,490,300,'#433252',20);rect(116,111,458,268,'#624264',16);
 rect(1110,92,537,317,'#25415a',22);rect(1125,107,507,287,'#295b70',14);
 rect(1110,629,540,332,'#563051',20);rect(1127,645,508,299,'#753a64',16);
 for(let x=88;x<1680;x+=156){gothicWindow(x,45,70,100);}
 // teto / lamparinas
 for(let x=130;x<1680;x+=250){glow(x,105,65,'#f48ad631');star(x,107,8,'#ffbef0')}
 // biblioteca
 label('✦ BIBLIOTECA MISTERIOSA ✦',344,136,'#ffc4e9',17);
 for(const r of schoolObstacles.slice(0,2)){rect(r.x-9,r.y-9,r.w+18,r.h+18,'#241a33',8);rect(r.x,r.y,r.w,r.h,'#9b6887',6);for(let z=0;z<8;z++)rect(r.x+14+z*27,r.y+7,17,r.h-14,['#ebaccb','#6adcd8','#dbb8f1','#9c78d2'][z%4],3)}
 for(let i=0;i<4;i++){rect(142+i*100,335,58,16,'#b7789b',4);circle(170+i*100,327,9,'#6efde2')}
 // laboratório
 label('ϟ LABORATÓRIO ELÉTRICO ϟ',1382,148,'#a1f5ff',16);
 for(let x=1160;x<1560;x+=100){rect(x,183,66,25,'#192e49',8);circle(x+33,179,13,'#79f5ec');line(x+33,154,x+33,172,'#d9ffff',3)}
 rect(1315,244,220,44,'#202f54',8);for(let i=0;i<5;i++){rect(1328+i*40,229,14,28,['#ff90d4','#84ecf2','#dbacff'][i%3],5);glow(1335+i*40,239,24,'#c2eeff3f')}
 // cafeteria
 label('♡ CAFETERIA DAS GHOULS ♡',1407,686,'#ffb2db',17);
 for(const r of schoolObstacles.slice(3,4)){rect(r.x,r.y,r.w,r.h,'#542642',14);rect(r.x+9,r.y+9,r.w-18,r.h-18,'#98608a',8)}
 for(const [x,y] of [[1200,740],[1430,810],[1200,896]]){ellipse(x,y,69,39,'#47263d');ellipse(x,y-5,61,35,'#aa7195');star(x,y-5,9,'#ffdfef')}
 // fonte central
 glow(844,738,155,'#ff8cdb1a');ellipse(844,748,102,80,'#2f274e');ellipse(844,736,92,70,'#8ac8ca');ellipse(844,738,73,53,'#4b96ad');for(let j=0;j<7;j++){let a=j/7*TAU+state.frameTime*.3;circle(844+Math.cos(a)*50,737+Math.sin(a)*36,4,'#c7ffff')}
 star(844,725,28,'#ffc0f1',state.frameTime*.18);
 label('SALÃO CENTRAL',846,857,'#dab6dc',16);
 // arcos do acesso principal
 for(let i=0;i<6;i++){let x=180+i*275;rect(x,969,41,65,'#241d3a',9);star(x+20,961,9,'#f3aadf')}
 // destinos
 drawPortal(portalBeach.x,portalBeach.y,'#f489d8','PRAIA SKULL SHORES',state.schoolTokens.length>=2);
 drawPortal(portalReef.x,portalReef.y,'#57ffde','PORTAL DO RECIFE',state.beachDone);
 // cristais da escola
 for(let i=0;i<schoolGems.length;i++)if(!completed(state.schoolTokens,i))drawCollectible(schoolGems[i].x,schoolGems[i].y,'gem',state.frameTime);
 // estação de minigame
 glow(969,236,58,'#ffb1dd38');rect(918,196,102,70,'#30264e',12);rect(929,206,80,49,'#9464a2',8);
 for(let i=0;i<4;i++)star(941+i*17,228,8,['#ffafda','#7bf7e4','#d9a7f7','#f8eab1'][i]);
 label('MEMÓRIA DAS CONCHAS',969,187,'#f1c9f1',11);
 if(near(p.x,p.y,{x:969,y:236},80))prompt('E • JOGAR MEMÓRIA',969,173);
 // personagens da escola
 for(const n of npcList){const c=CHARACTERS.find(v=>v.id===n.id);drawChibi(n.x,n.y,.94,c,n.x*.01);label(c.name,n.x,n.y-54,'#f8ecff',12);if(near(p.x,p.y,n,84))prompt('E • CONVERSAR',n.x,n.y-77)}
 // protagonista
 if(performance.now()>state.invulnUntil||Math.floor(state.frameTime*14)%2===0)drawChibi(p.x,p.y,1,chr(),p.x*.04);
 if(performance.now()<state.shieldUntil){ctx.strokeStyle='#77ffecac';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y-9,47,0,TAU);ctx.stroke()}
 if(near(p.x,p.y,portalBeach,100))prompt(state.schoolTokens.length>=2?'E • ENTRAR NA PRAIA':'✧ PORTAL SELADO',portalBeach.x,portalBeach.y-105);
 if(near(p.x,p.y,portalReef,100))prompt(state.beachDone?'E • ENTRAR NO RECIFE':'✧ AINDA BLOQUEADO',portalReef.x,portalReef.y-100);
 renderParticles();ctx.restore();
}
function prompt(t,x,y){rect(x-100,y-13,200,28,'#14132cd9',8);label(t,x,y+5,'#f1e1ff',11)}
function drawPortal(x,y,color,title,open){const t=state.frameTime;glow(x,y,105,open?color+'55':'#6b617b33');ctx.save();ctx.translate(x,y);ctx.rotate(t*.35);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,34+i*12,55+i*9,i*.4,0,TAU);ctx.strokeStyle=open?color+'b0':'#b9a5bd55';ctx.lineWidth=4-i*.7;ctx.stroke()}for(let i=0;i<7;i++){let a=i/7*TAU;star(Math.cos(a)*57,Math.sin(a)*54,5,open?color:'#957d9d',a+t*.3)}ctx.restore();star(x,y,22,open?'#fff3fc':'#a194b1',t*.5);label(title,x,y+92,open?'#ffd5f0':'#aea3bf',13)}
function drawBeach(){
 const p=state.beach;state.cam.x=lerp(state.cam.x,clamp(p.x-380,0,3460-W),.13);state.cam.y=0;
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#20183d');sky.addColorStop(.55,'#9563a5');sky.addColorStop(1,'#f0a3b7');rect(0,0,W,H,sky);
 glow(760,112,170,'#ffc8e44b');circle(760,112,47,'#fff5d6');circle(780,95,40,'#9c74a9');
 for(let i=0;i<50;i++){let x=(rand(i+37)*1200-state.cam.x*.1+1200)%1200-30,y=rand(i+120)*260;circle(x,y,.6+rand(i+67)*1.2,'#fff6ff9f')}
 for(let i=0;i<13;i++){let xx=i*185-(state.cam.x*.2%185);ellipse(xx,285+Math.sin(i)*17,125,36,'#55396b5e');ellipse(xx+40,276+Math.sin(i)*17,90,37,'#754f8763')}
 // cidade distante, navio fantasma e montanhas
 ctx.save();ctx.translate(-state.cam.x*.17,0);for(let i=0;i<17;i++){const ix=i*260;ctx.beginPath();ctx.moveTo(ix-180,379);ctx.lineTo(ix,289+rand(i+10)*78);ctx.lineTo(ix+220,379);ctx.fillStyle=i%2?'#534a77':'#5d477c';ctx.fill()}ctx.restore();
 const sea=ctx.createLinearGradient(0,335,0,540);sea.addColorStop(0,'#1d98a3');sea.addColorStop(1,'#17476d');rect(0,355,W,185,sea);
 for(let row=0;row<9;row++){ctx.beginPath();const y=372+row*20;ctx.moveTo(0,y);for(let x=0;x<=W;x+=12)ctx.lineTo(x,y+Math.sin((x+state.cam.x*.19)*.024+state.frameTime*(1+row*.1))*5);ctx.strokeStyle=row%2?'#dcffec2c':'#fff4e31f';ctx.lineWidth=2;ctx.stroke()}
 ctx.save();ctx.translate(-state.cam.x,0);
 // vegetação ao fundo
 for(let i=0;i<35;i++){let x=i*106+35;glow(x,414,42,i%2?'#ff9eea20':'#8ffde72b');if(i%3===0)drawPalm(x,456,.5)}
 // terras e plataformas
 for(const f of beachFloors){if(f.y<400){rect(f.x+3,f.y+5,f.w,20,'#3d4b63',6);rect(f.x,f.y,f.w,12,'#b8f2df',5);for(let i=12;i<f.w;i+=30)star(f.x+i,f.y-6,3,'#fff9ef')}else{const sand=ctx.createLinearGradient(0,f.y,0,H+65);sand.addColorStop(0,'#e6b4b2');sand.addColorStop(.23,'#916687');sand.addColorStop(1,'#4a3b74');rect(f.x,f.y,f.w,180,sand,4);rect(f.x,f.y-6,f.w,14,'#ffe4bb',6);for(let i=20;i<f.w;i+=43){circle(f.x+i,f.y+29,3,'#ffcfa16b');star(f.x+i+10,f.y+54,3,'#e9b2d398')}for(let i=0;i<5;i++){let x=f.x+35+i*f.w/5;drawCoral(x,f.y+2,10+i%3*5,i%2?'#e784c4':'#68d5cb')}}}
 // placas de checkpoint
 for(const cp of [700,1660,2270,2800]){line(cp,376,cp,457,'#fff1dd',5);ctx.beginPath();ctx.moveTo(cp,377);ctx.lineTo(cp+64,392);ctx.lineTo(cp,409);ctx.closePath();ctx.fillStyle=state.checkpoint>=cp?'#75ffe4':'#df94c2';ctx.fill();star(cp+21,393,7,'#f8fcfa')}
 // inimigos
 for(const e of beachEnemies)if(!e.defeated)drawCrab(e.x,435,e.stunnedUntil>performance.now());
 // último chefe
 if(state.bossHP>0)drawCrabBoss(3190,406,state.bossHP);
 for(let i=0;i<beachPearls.length;i++)if(!completed(state.beachPearls,i))drawCollectible(beachPearls[i].x,beachPearls[i].y,'pearl',state.frameTime);
 for(let i=0;i<beachShells.length;i++)if(!completed(state.beachShells,i))drawCollectible(beachShells[i].x,beachShells[i].y,'shell',state.frameTime);
 drawPortal(3370,375,'#72ffe9','PORTAL DO RECIFE',state.bossHP===0&&state.beachShells.length===3);
 if(p.x>3190&&state.beachShells.length===3&&state.bossHP===0)prompt('E • MERGULHAR',3360,250);
 if(performance.now()>state.invulnUntil||Math.floor(state.frameTime*17)%2===0)drawChibi(p.x+17,p.y+27,.78,chr(),p.x*.06);
 if(performance.now()<state.shieldUntil){ctx.strokeStyle='#70faeecb';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+17,p.y+23,34,0,TAU);ctx.stroke()}
 if(performance.now()-state.lastAttack<160){star(p.x+(p.vx<0?-15:49),p.y+26,15,chr().accent,state.frameTime*9)}
 renderParticles();ctx.restore();
 // instrução temporária quando perto do portal
 if(p.x>3240&&state.beachShells.length<3){label(`Procure as conchas: ${state.beachShells.length}/3`,480,88,'#ffefff',15)}
}
function drawPalm(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);line(0,0,8,-98,'#6b395f',12);for(let i=0;i<5;i++){let a=i/5*TAU-.6;ctx.beginPath();ctx.moveTo(8,-98);ctx.quadraticCurveTo(8+Math.cos(a)*70,-138+Math.sin(a)*22,8+Math.cos(a)*115,-88+Math.sin(a)*48);ctx.strokeStyle='#4a7b85';ctx.lineWidth=8;ctx.stroke()}ctx.restore()}
function drawCoral(x,y,h=16,c='#ef7fc5'){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-5,y-h,x-14,y-h*1.5);ctx.moveTo(x,y);ctx.quadraticCurveTo(x+7,y-h,x+12,y-h*1.7);ctx.moveTo(x,y);ctx.quadraticCurveTo(x+1,y-h,x+2,y-h*2);ctx.stroke();ctx.restore()}
function drawCrab(x,y,stunned=false){ctx.save();ctx.translate(x,y+Math.sin(state.frameTime*7+x)*2);ellipse(0,17,21,5,'#1c2c427f');for(let i=-1;i<=1;i+=2){line(i*9,7,i*24,19,'#e87ba2',4);line(i*18,-1,i*32,-15,'#e87ba2',4);circle(i*35,-17,8,'#fa99b8')}ellipse(0,0,22,15,stunned?'#9db4bc':'#e77ea8');line(-7,-8,-7,-21,'#f8b5ce',3);line(7,-8,7,-21,'#f8b5ce',3);circle(-7,-21,5,'#faf6ff');circle(7,-21,5,'#faf6ff');circle(-7,-21,2,'#292544');circle(7,-21,2,'#292544');if(stunned)star(0,-39,10,'#ffffa9');ctx.restore()}
function drawCrabBoss(x,y,hp){ctx.save();ctx.translate(x,y+Math.sin(state.frameTime*3)*4);glow(0,0,110,'#ff5aa034');ellipse(0,42,80,13,'#10173677');for(let i=-1;i<=1;i+=2){line(i*42,12,i*72,31,'#cc5f8f',12);line(i*43,-8,i*105,-51,'#d96e9b',12);circle(i*112,-60,25,'#ee9dba');ctx.beginPath();ctx.moveTo(i*105,-48);ctx.lineTo(i*139,-74);ctx.lineTo(i*132,-32);ctx.fillStyle='#ffb4d0';ctx.fill()}ellipse(0,0,65,43,'#bc497f');ellipse(0,-13,57,30,'#e879a6');circle(-19,-26,11,'#fff');circle(19,-26,11,'#fff');circle(-19,-27,5,'#20172d');circle(19,-27,5,'#20172d');star(0,-5,11,'#ffdde8');for(let i=0;i<3;i++)heart(-32+i*32,-67,7,i<hp?'#ff93bf':'#56455c');ctx.restore()}
function drawReef(){
 const p=state.reef;state.cam.x=lerp(state.cam.x,clamp(p.x-W*.46,0,2670-W),.105);state.cam.y=lerp(state.cam.y,clamp(p.y-H*.5,0,1000-H),.105);
 const water=ctx.createLinearGradient(0,0,0,H);water.addColorStop(0,'#07517a');water.addColorStop(.5,'#143d71');water.addColorStop(1,'#25184b');rect(0,0,W,H,water);
 // luzes que penetram na água
 ctx.save();for(let i=0;i<8;i++){const x=i*160-state.cam.x*.12%160;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+74,H);ctx.lineTo(x+200,H);ctx.lineTo(x+44,0);ctx.fillStyle='#80f6ee09';ctx.fill()}ctx.restore();
 for(let i=0;i<70;i++){const x=((rand(i*9+1)*1500-state.cam.x*.12)%1300+1300)%1300-70,y=((rand(i+54)*800+state.frameTime*(13+rand(i)*24))%650+650)%650;circle(x,y,1+rand(i+5)*3,'#b9fff064')}
 ctx.save();ctx.translate(-state.cam.x,-state.cam.y);
 // camadas do oceano: corais e colunas
 for(let i=0;i<24;i++){const x=i*130,top=830+Math.sin(i*2.1)*90;ellipse(x,995,120,210,'#163052ba');drawCoral(x+rand(i)*50,top+35,36+rand(i+5)*18,i%2?'#5edcca77':'#df74c477');glow(x,top+20,70,i%2?'#50fadc13':'#fa95dd15')}
 for(let i=0;i<14;i++){const x=i*220+90,y=rand(i+140)*860+80;for(let j=0;j<4;j++)circle(x+Math.sin(state.frameTime+j)*7,y-j*30-(state.frameTime*25%130),3+j,'#b4fff25d')}
 // correntes visuais
 for(const flow of [{x:675,y:310,w:320,h:240},{x:1580,y:470,w:350,h:220},{x:2180,y:150,w:260,h:320}]){ctx.strokeStyle='#78ffe73b';ctx.lineWidth=3;for(let j=0;j<5;j++){ctx.beginPath();for(let k=0;k<10;k++){const xx=flow.x+k*flow.w/9;const yy=flow.y+flow.h/6*(j+1)+Math.sin(k*.9+state.frameTime*2)*9;if(k===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke()}}
 // rochas sólidas
 for(const r of reefRocks){rect(r.x,r.y,r.w,r.h,'#132b56',22);rect(r.x+11,r.y+10,r.w-22,r.h-20,'#31557b',17);for(let i=0;i<5;i++){const px=r.x+rand(i+r.x)*r.w,py=r.y+rand(i+r.y)*r.h;star(px,py,5,'#70c5c6a3')}}
 // plantas e arquitetura secreta
 for(let i=0;i<19;i++){let x=110+i*139,y=930-(i%4)*29;drawCoral(x,y,31+i%3*14,['#ff81d0','#62eadd','#a99cff'][i%3])}
 rect(2475,440,150,135,'#215778',26);for(let i=0;i<6;i++)line(2492+i*21,445,2492+i*21,568,'#87d0ce77',3);
 for(const bubble of reefBubbles){glow(bubble.x,bubble.y,65,'#9bfce72e');ctx.strokeStyle='#acfff3bb';ctx.lineWidth=4;ctx.beginPath();ctx.arc(bubble.x,bubble.y,34,0,TAU);ctx.stroke();star(bubble.x,bubble.y,10,'#d0fff9');label('AR',bubble.x,bubble.y+55,'#bbfff5',11)}
 for(let i=0;i<reefPearls.length;i++)if(!completed(state.reefPearls,i))drawCollectible(reefPearls[i].x,reefPearls[i].y,'pearl',state.frameTime);
 for(let i=0;i<reefCrystals.length;i++)if(!completed(state.reefCrystals,i))drawCollectible(reefCrystals[i].x,reefCrystals[i].y,'crystal',state.frameTime);
 for(const en of reefEnemies)if(!en.defeated)drawJelly(en.x,en.y,en.stunnedUntil>performance.now());
 drawPortal(2550,500,'#78fff0','PALÁCIO DAS MARÉS',state.reefCrystals.length===3);
 if(near(p.x,p.y,{x:2550,y:500},110))prompt(state.reefCrystals.length===3?'E • SALVAR O REINO':'✦ REÚNA 3 CRISTAIS',2550,395);
 // jogador inclinado ao nadar
 ctx.save();ctx.translate(p.x,p.y);ctx.rotate(clamp(p.vy*.00045,-.3,.3));if(performance.now()>state.invulnUntil||Math.floor(state.frameTime*17)%2===0)drawChibi(0,0,.9,chr(),p.x*.05);ctx.restore();
 if(performance.now()<state.shieldUntil){ctx.strokeStyle='#9affddc1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y-6,43,0,TAU);ctx.stroke()}
 renderParticles();ctx.restore();
 // medidor de oxigênio, no canvas para não interferir com mobile
 if(state.char!=='lagoona'){rect(377,14,205,26,'#101e3eae',10);rect(382,32,195,4,'#29455d',3);rect(382,32,195*clamp(p.air/50,0,1),4,p.air<12?'#ff9cb5':'#89fff2',3);label('◉ AR  '+Math.ceil(p.air)+'s',480,27,'#d8fff9',11)}else{rect(391,14,180,25,'#101e3eac',9);label('♒ RESPIRAÇÃO LIVRE',481,31,'#b0ffec',11)}
}
function drawJelly(x,y,stunned=false){ctx.save();ctx.translate(x,y);const wave=Math.sin(state.frameTime*5+x)*5;glow(0,0,54,'#ec88e53b');for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*8,3);ctx.quadraticCurveTo(i*10+Math.sin(state.frameTime*4+i)*6,18,i*9,32+wave);ctx.strokeStyle='#ffa7efac';ctx.lineWidth=3;ctx.stroke()}ctx.beginPath();ctx.arc(0,0,26,Math.PI,TAU);ctx.lineTo(26,0);ctx.quadraticCurveTo(0,15,-26,0);ctx.fillStyle=stunned?'#809ba4':'#bc80e3';ctx.fill();circle(-9,-3,3,'#202343');circle(9,-3,3,'#202343');if(stunned)star(0,-34,8,'#ffffa7');ctx.restore()}
function drawCompass(){
 let target=null,name='';const pos=playerWorldPos();
 if(state.scene==='school'){
   if(state.schoolTokens.length<2){const pending=schoolGems.filter((_,i)=>!state.schoolTokens.includes(i));pending.sort((a,b)=>dist(pos.x,pos.y,a.x,a.y)-dist(pos.x,pos.y,b.x,b.y));target=pending[0];name='EMBLEMA BRILHANTE'}
   else{target=portalBeach;name='PORTAL DA PRAIA'}
 }else if(state.scene==='beach'){
   if(state.beachShells.length<3){const pending=beachShells.filter((_,i)=>!state.beachShells.includes(i));pending.sort((a,b)=>dist(pos.x,pos.y,a.x,a.y)-dist(pos.x,pos.y,b.x,b.y));target=pending[0];name='CONCHA ENCANTADA'}
   else if(state.bossHP>0){target={x:3190,y:405};name='CARANGUEJO GIGANTE'}
   else{target={x:3370,y:375};name='PORTAL SUBMARINO'}
 }else if(state.scene==='reef'){
   if(state.reefCrystals.length<3){const pending=reefCrystals.filter((_,i)=>!state.reefCrystals.includes(i));pending.sort((a,b)=>dist(pos.x,pos.y,a.x,a.y)-dist(pos.x,pos.y,b.x,b.y));target=pending[0];name='CRISTAL OCEÂNICO'}
   else{target={x:2550,y:500};name='PALÁCIO DAS MARÉS'}
 }
 if(!target)return;
 const angle=Math.atan2(target.y-pos.y,target.x-pos.x);
 ctx.save();rect(368,57,224,30,'#101832c2',11);ctx.translate(388,72);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-5,-8);ctx.lineTo(-2,0);ctx.lineTo(-5,8);ctx.closePath();ctx.fillStyle='#8ffff0';ctx.fill();ctx.restore();label(name,487,77,'#fff1fa',10);
}
function frame(time){if(!state.frameTime)state.frameTime=time*.001;let dt=clamp((time-(frame.prev||time))/1000,0,.034);frame.prev=time;update(dt);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);if(state.shake>0){ctx.save();ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake)}if(state.scene==='menu')drawMenuArt();else if(state.scene==='school')drawSchool();else if(state.scene==='beach')drawBeach();else if(state.scene==='reef')drawReef();if(state.scene!=='menu')drawCompass();if(state.shake>0)ctx.restore();requestAnimationFrame(frame)}
$('continueBtn').hidden=!savedData();
requestAnimationFrame(frame);
})();
