const $ = id => document.getElementById(id);
const screens = ['screen1','screen2','screen3','screen4'];
let current = 'screen1';
let letterTimers = [];
function showScreen(id){
  screens.forEach(s=>{const el=$(s);el.hidden=s!==id;el.classList.toggle('active',s===id)});
  current=id;
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='screen2')requestAnimationFrame(positionRunaway);
}
// Gentle, continuous floating hearts
const hearts=$('hearts');
function addHeart(){
  if(document.hidden)return;
  const el=document.createElement('span');el.className='heart';
  el.textContent=['♥','♡','💕','💗','✦'][Math.floor(Math.random()*5)];
  el.style.setProperty('--left',Math.random()*100+'%');
  el.style.setProperty('--size',(12+Math.random()*18)+'px');
  el.style.setProperty('--duration',(7+Math.random()*7)+'s');
  el.style.setProperty('--drift',(-75+Math.random()*150)+'px');
  hearts.appendChild(el);el.addEventListener('animationend',()=>el.remove(),{once:true});
}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<12;i++)setTimeout(addHeart,i*180);setInterval(addHeart,430)}
$('firstYes').addEventListener('click',()=>showScreen('screen2'));
const runaway=$('runaway');
let lastMove=0;
function positionRunaway(){
  if(current!=='screen2')return;
  const rect=runaway.getBoundingClientRect();
  if(!runaway.classList.contains('floating')){
    runaway.style.left=rect.left+'px';runaway.style.top=rect.top+'px';
    runaway.classList.add('floating');
  }
}
function flee(pointerX,pointerY){
  if(current!=='screen2')return;
  if(Date.now()-lastMove<100)return;
  lastMove=Date.now();positionRunaway();
  const margin=16,w=runaway.offsetWidth,h=runaway.offsetHeight;
  const maxX=Math.max(margin,innerWidth-w-margin),maxY=Math.max(margin,innerHeight-h-margin);
  let x=margin,y=margin;
  for(let i=0;i<20;i++){
    x=margin+Math.random()*Math.max(0,maxX-margin);
    y=margin+Math.random()*Math.max(0,maxY-margin);
    if(Math.hypot(x+w/2-pointerX,y+h/2-pointerY)>Math.min(innerWidth,innerHeight)*.34)break;
  }
  runaway.style.left=x+'px';runaway.style.top=y+'px';
}
runaway.addEventListener('pointerenter',e=>flee(e.clientX,e.clientY));
runaway.addEventListener('pointerdown',e=>{e.preventDefault();flee(e.clientX,e.clientY)});
runaway.addEventListener('click',e=>{e.preventDefault();flee(e.clientX,e.clientY)});
document.addEventListener('pointermove',e=>{
  if(current!=='screen2'||e.pointerType==='touch')return;
  const r=runaway.getBoundingClientRect();
  const dx=Math.max(r.left-e.clientX,0,e.clientX-r.right);
  const dy=Math.max(r.top-e.clientY,0,e.clientY-r.bottom);
  if(Math.hypot(dx,dy)<85)flee(e.clientX,e.clientY);
});
window.addEventListener('resize',()=>{
  if(current==='screen2'&&runaway.classList.contains('floating')){
    runaway.style.left=Math.min(parseFloat(runaway.style.left)||20,innerWidth-runaway.offsetWidth-12)+'px';
    runaway.style.top=Math.min(parseFloat(runaway.style.top)||20,innerHeight-runaway.offsetHeight-12)+'px';
  }
});
const apologyLines=[
  "Hey Bambi... ❤️",
  "I don't really know where to start, except with this: I'm genuinely sorry.",
  "I said things I never wanted to say. I meant to express something completely different, but the words came out wrong, and I hurt you.",
  "I fucked things up. I know that, and I'm not going to pretend otherwise.",
  "My intention was never to hurt you, make you feel unwanted, or make you doubt how important you are to me.",
  "But I understand that intentions don't erase the pain caused by what I actually said.",
  "You deserved patience, kindness, and a little more thought from me. Instead, I let my words get ahead of my heart.",
  "I wish I could take that moment back. I can't, but I can take responsibility for it.",
  "I'm sorry for the hurt, for the confusion, and for making a difficult moment even harder.",
  "I care about you so much, even when I do a terrible job of showing it.",
  "I don't expect you to forget everything just because I made a cute little website with Bambi's face on it.",
  "You can take your time. Your feelings matter, and I want to listen instead of defending myself.",
  "I want to communicate better, think before I speak, and show you through my actions that I mean this apology.",
  "You mean a lot to me, and I'm so sorry I made you feel anything less than that.",
  "If I could send you the biggest, warmest hug through this screen, I would. 🥺❤️",
  "I'm sorry, truly. And thank you for reading every word."
];
function clearLetterTimers(){letterTimers.forEach(clearTimeout);letterTimers=[]}
function startLetter(){
  clearLetterTimers();$('letterLines').replaceChildren();$('signature').hidden=true;
  $('next').hidden=true;$('paper').classList.remove('visible');
  $('envelopeStage').className='envelope-stage';$('letterStatus').textContent='Opening your letter...';
  showScreen('screen3');
  letterTimers.push(setTimeout(()=>$('envelopeStage').classList.add('open'),450));
  letterTimers.push(setTimeout(()=>{
    $('envelopeStage').classList.add('done');$('paper').classList.add('visible');
    $('letterStatus').textContent='One sentence at a time, straight from my heart ♡';
    apologyLines.forEach((line,index)=>{
      letterTimers.push(setTimeout(()=>{
        const p=document.createElement('p');p.className='letter-line';p.textContent=line;
        $('letterLines').appendChild(p);
        const paper=$('paper');paper.scrollTo({top:paper.scrollHeight,behavior:'smooth'});
        if(index===apologyLines.length-1){
          letterTimers.push(setTimeout(()=>{
            $('signature').hidden=false;$('next').hidden=false;
            $('letterStatus').textContent='Every word, with love. ♡';
            paper.scrollTo({top:paper.scrollHeight,behavior:'smooth'});
          },1100));
        }
      },index*2250));
    });
  },1700));
}
$('forgive').addEventListener('click',startLetter);
$('next').addEventListener('click',()=>showScreen('screen4'));
$('replay').addEventListener('click',()=>{clearLetterTimers();runaway.classList.remove('floating');runaway.removeAttribute('style');showScreen('screen1')});
