/* theme toggle (persisted) */
(function(){
  const root=document.documentElement, btn=document.getElementById('themeBtn');
  if(!btn) return;
  const saved=localStorage.getItem('pg-theme');
  if(saved){root.setAttribute('data-theme',saved);}
  const sync=()=>btn.textContent=root.getAttribute('data-theme')==='dark'?'☀️':'🌙';
  sync();
  btn.addEventListener('click',()=>{
    const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);localStorage.setItem('pg-theme',next);sync();
  });
})();

/* mobile menu */
(function(){
  const btn=document.getElementById('menuBtn'), nav=document.getElementById('nav');
  if(!btn||!nav) return;
  btn.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
})();

/* scroll reveal */
(function(){
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.14});
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    el.style.transitionDelay=(i%6*60)+'ms';
    io.observe(el);
  });
})();
