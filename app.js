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

/* hero headline: flip through fonts, then settle on the default */
(function(){
  const h1=document.querySelector('.hero h1');
  if(!h1) return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // distinct faces to cycle through before landing on the CSS default (Cormorant Garamond)
  const fonts=[
    "'JetBrains Mono', monospace",
    "'EB Garamond', serif",
    "Georgia, serif",
    "'Courier New', monospace",
    "'Trebuchet MS', sans-serif",
    "'Times New Roman', serif"
  ];

  // wrap each word in a .flip span, keeping the .grad phrase as a single unit
  const units=[];
  const wrapText=(text)=>{
    const frag=document.createDocumentFragment();
    text.split(/(\s+)/).forEach(tok=>{
      if(tok.trim()===''){ if(tok) frag.appendChild(document.createTextNode(tok)); return; }
      const s=document.createElement('span');
      s.className='flip'; s.textContent=tok;
      units.push(s); frag.appendChild(s);
    });
    return frag;
  };
  Array.from(h1.childNodes).forEach(node=>{
    if(node.nodeType===3){ h1.replaceChild(wrapText(node.textContent), node); }
    else if(node.nodeType===1){ node.classList.add('flip'); units.push(node); }
  });

  // timing — deliberately unhurried
  const STEP=190;     // ms between font swaps within a word
  const FLIPS=5;      // font changes before a word lands
  const STAGGER=140;  // ms between successive words starting
  let landed=0;

  const animateWord=(el,wordIdx)=>{
    let n=0;
    const swap=()=>{
      if(n>=FLIPS){
        el.style.fontFamily='';          // back to the CSS default face
        el.classList.add('landed');
        if(++landed===units.length) h1.classList.add('font-set');
        return;
      }
      el.style.fontFamily=fonts[(n+wordIdx)%fonts.length];
      n++;
      setTimeout(swap, STEP);
    };
    swap();
  };

  // small delay so it's visible after first paint, then stagger word-by-word
  setTimeout(()=>{
    units.forEach((el,idx)=>setTimeout(()=>animateWord(el,idx), idx*STAGGER));
  }, 280);
})();
