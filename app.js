/* theme toggle (persisted) */
(function(){
  const root=document.documentElement, btn=document.getElementById('themeBtn');
  if(!btn) return;
  const saved=localStorage.getItem('pg-theme');
  if(saved){root.setAttribute('data-theme',saved);}
  const moon='<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  const sun='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const sync=()=>{
    const dark=root.getAttribute('data-theme')==='dark';
    btn.innerHTML=dark?sun:moon;
    btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  };
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
