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

/* hero typewriter — types the headline like a person: a couple of typos,
   a beat to notice, a backspace to fix, then it lands on the real text */
(function(){
  const els=document.querySelectorAll('[data-typewriter]');
  if(!els.length) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return; /* honour reduced-motion: leave the real text in place */

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const rand=(a,b)=>a+Math.random()*(b-a);
  /* QWERTY neighbours for believable slips */
  const near={a:'sqwz',b:'vghn',c:'xdfv',d:'serfcx',e:'wrsdf',f:'drtgcv',g:'ftyhbv',h:'gyujbn',i:'ujko',j:'huikmn',k:'jiolm',l:'kop',m:'njk',n:'bhjm',o:'iklp',p:'ol',q:'wa',r:'edft',s:'awedxz',t:'rfgy',u:'yhji',v:'cfgb',w:'qase',x:'zsdc',y:'tghu',z:'asx'};
  const slip=ch=>{const l=ch.toLowerCase(),n=near[l];if(!n)return ch;const w=n[Math.floor(Math.random()*n.length)];return ch===l?w:w.toUpperCase();};
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const caret='<span class="tw-caret" aria-hidden="true"></span>';

  function runsOf(el){
    const runs=[];
    el.childNodes.forEach(n=>{
      if(n.nodeType===3) runs.push({text:n.textContent,cls:null});
      else if(n.nodeType===1) runs.push({text:n.textContent,cls:n.getAttribute('class')});
    });
    return runs;
  }
  function paint(el,runs,visible,extra){
    let left=visible,html='';
    for(const r of runs){
      if(left<=0) break;
      const take=Math.min(left,r.text.length);
      const part=esc(r.text.slice(0,take));
      html+=r.cls?'<span class="'+r.cls+'">'+part+'</span>':part;
      left-=take;
    }
    el.innerHTML=html+esc(extra||'')+caret;
  }

  async function play(el){
    const html=el.innerHTML;                 /* exact final markup, restored at the end */
    const runs=runsOf(el);
    const full=runs.map(r=>r.text).join('');
    el.setAttribute('aria-label',full);
    el.style.minHeight=el.getBoundingClientRect().height+'px'; /* no layout jump */
    el.classList.add('tw-typing');

    /* pick up to two typo spots at fresh words, spread across the line */
    const starts=[];
    for(let i=1;i<full.length;i++) if(full[i-1]===' '&&/[a-z]/i.test(full[i])) starts.push(i);
    const typos=new Set();
    [0.34,0.7].forEach(f=>{
      let best=-1,bd=1e9;const t=Math.floor(full.length*f);
      starts.forEach(s=>{const d=Math.abs(s-t);if(d<bd){bd=d;best=s;}});
      if(best>0) typos.add(best);
    });

    await sleep(420);
    let v=0;
    while(v<full.length){
      if(typos.has(v)){
        let wrong='';const n=2+Math.floor(Math.random()*2);
        for(let i=0;i<n&&v+i<full.length;i++){
          wrong+=slip(full[v+i]);
          paint(el,runs,v,wrong);
          await sleep(rand(75,130));
        }
        await sleep(rand(240,360));        /* notice the mistake */
        while(wrong.length){
          wrong=wrong.slice(0,-1);
          paint(el,runs,v,wrong);
          await sleep(rand(55,95));        /* backspace */
        }
        await sleep(rand(110,180));
      }
      v++;
      paint(el,runs,v,'');
      const ch=full[v-1];
      await sleep(/[.,—-]/.test(ch)?rand(220,340):ch===' '?rand(70,150):rand(45,110));
    }

    await sleep(650);
    el.classList.remove('tw-typing');
    el.classList.add('tw-done');
    el.innerHTML=html;                       /* restore exact final markup (grad span, caret gone) */
    el.style.minHeight='';
  }

  els.forEach(play);
})();

/* scroll reveal */
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length) return;
  const show=el=>el.classList.add('in');

  /* no IntersectionObserver (or older mobile browsers): just show everything */
  if(!('IntersectionObserver' in window)){
    els.forEach(show);
    return;
  }

  /* rootMargin pulls the trigger line up from the viewport bottom so elements
     reveal as they enter — and a tiny threshold means tall blocks (taller than
     a phone screen) and bottom-of-page elements still fire reliably on mobile,
     where dynamic toolbars shrink the visible viewport. */
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});
  },{threshold:.01,rootMargin:'0px 0px -10% 0px'});

  els.forEach((el,i)=>{
    el.style.transitionDelay=(i%6*60)+'ms';
    io.observe(el);
  });

  /* safety net: if anything is still hidden shortly after load (observer never
     fired for an element already framed in a short mobile viewport), reveal it */
  window.addEventListener('load',()=>{
    setTimeout(()=>{
      els.forEach(el=>{
        if(el.classList.contains('in')) return;
        const r=el.getBoundingClientRect();
        if(r.top<window.innerHeight&&r.bottom>0){show(el);io.unobserve(el);}
      });
    },400);
  });
})();
