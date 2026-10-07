(function(){
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal observer is intentionally exposed because the public CMS renderer
  // replaces the project/career DOM after this script loads.
  const revealObserver = ('IntersectionObserver' in window && !reduced)
    ? new IntersectionObserver((entries)=>entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      }),{threshold:.08,rootMargin:'0px 0px -40px 0px'})
    : null;

  window.initReveal = function(target){
    const nodes = target
      ? (target instanceof Element ? [target] : Array.from(target))
      : Array.from(document.querySelectorAll('.reveal'));
    nodes.forEach(el=>{
      if(!el) return;
      if(reduced || !revealObserver){el.classList.add('show');return;}
      revealObserver.observe(el);
    });
  };

  function initTheme(){
    let theme='dark';
    try{theme=localStorage.getItem('ng-theme') || 'dark';}catch(e){}
    if(theme!=='light' && theme!=='dark') theme='dark';
    document.documentElement.dataset.theme=theme;
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>{
      const active=btn.dataset.themeChoice===theme;
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        theme=btn.dataset.themeChoice==='light'?'light':'dark';
        document.documentElement.dataset.theme=theme;
        try{localStorage.setItem('ng-theme',theme);}catch(e){}
        document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeChoice===theme?'true':'false'));
      });
    });
  }

  function initSmoothLinks(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:reduced?'auto':'smooth'});}
    }));
  }

  function initMouseDepth(){
    if(reduced || !window.matchMedia || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    const portrait=document.querySelector('[data-mouse="portrait"]');
    const root=document.querySelector('main');
    if(portrait && root){
      root.addEventListener('pointermove',e=>{
        const r=root.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5);
        const y=((e.clientY-r.top)/r.height-.5);
        portrait.style.setProperty('--mouse-x',(x*12).toFixed(2)+'px');
        portrait.style.setProperty('--mouse-y',(y*9).toFixed(2)+'px');
      },{passive:true});
      root.addEventListener('pointerleave',()=>{
        portrait.style.setProperty('--mouse-x','0px');
        portrait.style.setProperty('--mouse-y','0px');
      });
    }

    document.addEventListener('pointermove',e=>{
      const card=e.target.closest && e.target.closest('.interactive-card');
      if(!card) return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--ry',(x*3.2).toFixed(2)+'deg');
      card.style.setProperty('--rx',(-y*3.2).toFixed(2)+'deg');
    },{passive:true});
    document.addEventListener('pointerover',e=>{
      const card=e.target.closest && e.target.closest('.interactive-card');
      if(card){card.classList.add('interactive-card');}
    },{passive:true});
    document.addEventListener('pointerout',e=>{
      const card=e.target.closest && e.target.closest('.interactive-card');
      if(card && !card.contains(e.relatedTarget)){
        card.style.setProperty('--ry','0deg');
        card.style.setProperty('--rx','0deg');
      }
    },{passive:true});
  }

  function init(){
    initTheme();
    initSmoothLinks();
    window.initReveal();
    initMouseDepth();
  }
  init();
})();
