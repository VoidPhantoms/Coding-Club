const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
let W, H, particles = [];
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas(){
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const count = Math.min(130, Math.floor((W*H)/11000));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*1.6+.3,
    vx:(Math.random()-.5)*.12, vy:(Math.random()-.5)*.12,
    a:Math.random()*.7+.15
  }));
}
function drawSpace(){
  ctx.clearRect(0,0,W,H);
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(170,150,255,${p.a})`;ctx.fill();
  }
  requestAnimationFrame(drawSpace);
}
resizeCanvas(); window.addEventListener("resize", resizeCanvas); drawSpace();

// Cursor liquid glow
const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.animate({left:e.clientX+"px",top:e.clientY+"px"},{duration:450,fill:"forwards"});
});

// 3D tilt cards
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    const max=Number(card.dataset.tilt||8);
    card.style.transform=`perspective(1000px) rotateX(${-y*max}deg) rotateY(${x*max}deg) translateZ(5px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

// Magnetic buttons
document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    if(matchMedia("(pointer: coarse)").matches)return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

// Scroll reveal
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}
  })
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Subtle parallax on hero background
window.addEventListener("scroll",()=>{
  const hero=document.querySelector(".hero-bg");
  if(hero) hero.style.transform=`translateY(${Math.min(window.scrollY*.08,45)}px)`;
});

// Smooth active nav feel
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}
  });
});
