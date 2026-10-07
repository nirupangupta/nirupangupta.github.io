(async function(){
  let d=await window.PortfolioData.load();
  const previewMode=new URLSearchParams(location.search).get('preview')==='1';
  if(previewMode){try{const draft=JSON.parse(localStorage.getItem('portfolioDraftPreview')); if(draft) d=Object.assign({},d,draft);}catch(e){}}
  const $=id=>document.getElementById(id);
  if($('profileImage')&&d.profile.image) $('profileImage').src=d.profile.image;
  if(previewMode){const b=document.createElement('div');b.className='draft-banner';b.innerHTML=`<strong>DRAFT PREVIEW</strong><span>Not published yet</span><button id="exitPreview">Back to Admin</button>`;document.body.prepend(b);document.getElementById('exitPreview').onclick=()=>{localStorage.removeItem('portfolioDraftPreview');location.href='admin/'}}
  if($('heroPositioning')) $('heroPositioning').textContent=d.profile.positioning;
  if($('heroHeadline')) $('heroHeadline').textContent=d.profile.headline;
  if($('heroIntro')) $('heroIntro').textContent=d.profile.intro;
  if($('heroLocation')) $('heroLocation').textContent=d.profile.location;
  if($('contactLocation')) $('contactLocation').textContent=d.profile.location;
  if($('contactEmail')) { $('contactEmail').textContent=d.profile.email; $('contactEmail').href='mailto:'+d.profile.email; }
  if($('contactPhone')) { $('contactPhone').textContent=d.profile.phone; $('contactPhone').href='tel:'+d.profile.phone.replace(/[^+\d]/g,''); }
  if($('contactLinkedin')) { $('contactLinkedin').textContent=d.profile.linkedin.replace(/^https?:\/\/(www\.)?/,'')+' ↗'; $('contactLinkedin').href=d.profile.linkedin; }
  if($('aboutTitle')) $('aboutTitle').textContent=d.about.title;
  if($('aboutBody1')) $('aboutBody1').textContent=d.about.body1;
  if($('aboutBody2')) $('aboutBody2').textContent=d.about.body2;
  const proof=$('proofGrid'); if(proof) proof.innerHTML=d.proof.map(x=>`<div class="proof-item"><div class="proof-num">${x[0]}</div><div class="proof-label">${x[1]}</div></div>`).join('');
  const thinking=$('thinkingGrid'); if(thinking) thinking.innerHTML=d.thinking.map(x=>`<div class="process-item"><div class="process-num">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('');
  const impact=$('impactGrid'); if(impact) impact.innerHTML=d.impact.map(x=>`<div class="impact"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('');
  const caps=$('capabilitiesGrid'); if(caps) caps.innerHTML=d.capabilities.map(x=>`<span class="pill">${x}</span>`).join('');
  const career=$('careerGrid'); if(career) career.innerHTML=d.career.map(x=>`<div class="career-row"><div><div class="career-company">${x.company}</div><div class="career-role">${x.role}</div>${(x.promotions||[]).length?`<div class="promotion-list">${x.promotions.map(p=>`<div class="promotion"><b>Promotion</b> ${p.role||''} · ${p.date||''}</div>`).join('')}</div>`:''}</div><div class="career-desc">${x.description}</div><div class="career-date">${x.date}</div></div>`).join('');
  const work=$('workGrid'); if(work) { const projects=[...d.projects].filter(p=>p.published!==false).sort((a,b)=>a.order-b.order); work.innerHTML=projects.map((p,i)=>`<article class="work-card ${i===0?'feature ':''}reveal interactive-card"><div><div class="work-tag">${p.category||p.tag}</div><div class="work-number">${p.company}</div><h3>${p.title}</h3><p class="work-desc">${p.summary}</p><div class="metrics">${(p.metrics||[]).map(m=>`<div class="metric"><strong>${m[0]}</strong><span>${m[1]}</span></div>`).join('')}</div></div><a class="card-link" href="${p.caseStudy||'#'}">${p.caseStudy?'Read case study →':'View project →'}</a></article>`).join(''); work.querySelectorAll('.reveal').forEach(el=>window.initReveal?.(el)); }
  if($('productResume')) $('productResume').href=d.resumes.product;
  if($('salesResume')) $('salesResume').href=d.resumes.sales;
  if($('heroResume')) $('heroResume').href=d.resumes.product;
  if($('navResume')) $('navResume').href=d.resumes.product;
})();
