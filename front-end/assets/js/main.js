// Carrossel 
const track = document.querySelector('.carousel__track');
const slides = Array.from(document.querySelectorAll('.slide'));
const prev = document.querySelector('.carousel__nav--prev');
const next = document.querySelector('.carousel__nav--next');
const viewport = document.querySelector('.carousel__viewport');

let index = 0;
function update(){ track.style.transform = `translateX(-${index * 100}%)`; }
function goPrev(){ index = (index - 1 + slides.length) % slides.length; update(); }
function goNext(){ index = (index + 1) % slides.length; update(); }

prev?.addEventListener('click', goPrev);
next?.addEventListener('click', goNext);

// autoplay
let timer = setInterval(goNext, 3500);
function pause(){ clearInterval(timer); timer = null; }
function resume(){ if(!timer) timer = setInterval(goNext, 3500); }
viewport.addEventListener('mouseenter', pause);
viewport.addEventListener('mouseleave', resume);

// acessibilidade 
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft') goPrev();
  if(e.key === 'ArrowRight') goNext();
});

// foco visível
document.querySelectorAll('button, a, input').forEach(el=>{
  el.addEventListener('focus', ()=> el.classList.add('focus'));
  el.addEventListener('blur',  ()=> el.classList.remove('focus'));
});
