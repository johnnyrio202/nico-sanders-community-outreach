(async()=>{

/* Mock data. In production, events come from /api/events and funding from a new table. */
let EVENTS=[],FUND=[],RESDATA=[];
const _raw=async u=>{try{const r=await fetch(u);return r.ok?await r.json():[]}catch(e){return[]}};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const today=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())};
const parse=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const dayDiff=s=>Math.round((parse(s)-today())/864e5);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mon=d=>d.toLocaleString('en-US',{month:'short'});
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function rel(n){return n<=0?'today':n===1?'tomorrow':'in '+n+' days'}

function icsFor(ev){
  const d=ev.d.replace(/-/g,'');
  const s=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Nico Sanders Community Outreach//EN','BEGIN:VEVENT','UID:'+d+'-'+ev.t.length+'@nicosanders.net','DTSTAMP:'+d+'T000000Z','DTSTART;VALUE=DATE:'+d,'SUMMARY:'+ev.t.replace(/,/g,'\\,'),'LOCATION:'+ev.loc.replace(/,/g,'\\,'),'DESCRIPTION:'+ev.time,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/calendar'}));a.download='event.ics';a.click();toast('Added to your calendar file');
}
function share(ev){const txt=ev.t+' — '+ev.d+' · '+ev.loc;if(navigator.share){navigator.share({title:ev.t,text:txt})}else{navigator.clipboard&&navigator.clipboard.writeText(txt);toast('Event details copied')}}

const [_ev,_fu,_rs]=await Promise.all([_raw('/api/events'),_raw('/api/funding'),_raw('/api/resources')]);
EVENTS=_ev.map(e=>({t:e.title,d:e.event_date,time:e.event_time||'See source',loc:e.location||'See source',c:e.category||'Community',img:e.image_url||'',desc:e.description||'',url:e.url,slug:e.slug}));
FUND=_fu.map(f=>({url:f.url,type:f.type,t:f.title,p:f.summary,who:f.audience,end:f.deadline,note:f.note,slug:f.slug}));
RESDATA=_rs;
const slug=s=>s.toLowerCase().replace(/['’]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70).replace(/-+$/,'');
const BLURB={'Housing & Cost of Living':'Heating and electric bill help, emergency utility assistance and food support, right when winter hits.','Mental Health & Safety':'988 Lifeline, 24-hour crisis support and county crisis response. Free and confidential.','Schools & Opportunity':'Enrollment, job training and apprenticeships.','Small Business & Economy':'Loans, counseling and local networking.','Grants & Scholarships':'State and federal funding for people and projects.','Community Organizations':'Associations, libraries and councils near you.','Environment & Infrastructure':'Alerts, 311 and road projects.','Good Government':'Councils, hearings and who represents you.','Local Events':'Places that post community events and calendars.'};
const CATNAMES=[...new Set(RESDATA.map(r=>r.category))];
if(CATNAMES.length){
  const ORDER=['Housing & Cost of Living','Mental Health & Safety'];
  CATNAMES.sort((a,b)=>{const x=ORDER.indexOf(a),y=ORDER.indexOf(b);return (x<0?99:x)-(y<0?99:y)});
  $('#bento').innerHTML=CATNAMES.map(c=>{const items=RESDATA.filter(r=>r.category===c);const n=items.length;const keys=items.map(r=>r.title+' '+r.description).join(' ');
    return `<a class="res${ORDER.includes(c)?' big':''}" href="/resources/${slug(c)}" data-k="${esc(c+' '+keys)}"><span class="ic">${esc(c[0])}</span><h3 class="d">${esc(c)}</h3><p>${esc(BLURB[c]||'')}</p><span class="n">${n} resource${n===1?'':'s'} →</span></a>`}).join('');
  const gs=$$('.glance [data-count]');gs[1].dataset.count=CATNAMES.length;gs[2].dataset.count=RESDATA.length;gs[2].dataset.suffix='';
}
let filter='week', cat='all', expanded=false;
const CATS=['all',...new Set(EVENTS.map(e=>e.c))];
$('#cats').innerHTML=CATS.map(c=>`<button class="cbtn" data-c="${c}" aria-pressed="${c==='all'}">${c==='all'?'All types':c}</button>`).join('');
function inRange(ev){
  const n=dayDiff(ev.d); if(n<0) return false;
  if(cat!=='all'&&ev.c!==cat) return false;
  if(filter==='all') return true;
  if(filter==='week') return n<=6;
  const wd=parse(ev.d).getDay(); return n<=13&&(wd===6||wd===0)&&n<=((6-today().getDay()+7)%7)+1;
}
const dow=d=>d.toLocaleString('en-US',{weekday:'short'});
function renderEvents(){
  const list=EVENTS.filter(inRange);
  $('#fcount').textContent=list.length+(list.length===1?' event':' events');
  const LIM=6,vis=expanded?list:list.slice(0,LIM);
  const mb=$('#emore');mb.hidden=list.length<=LIM;mb.textContent=expanded?'Show fewer':'Show all '+list.length+' events';
  $('#erail').innerHTML=list.length?vis.map(ev=>{
    const d=parse(ev.d),n=dayDiff(ev.d),ix=EVENTS.indexOf(ev);
    const th=ev.img?`<button class="thbtn" data-open="${ix}" aria-label="Enlarge flyer for ${esc(ev.t)}"><img src="${ev.img}" alt="" loading="lazy"></button><div class="pop" aria-hidden="true"><img src="${ev.img}" alt=""></div>`
      :`<button class="thbtn" data-open="${ix}" aria-label="Details for ${esc(ev.t)}"><div class="tile"><b class="d">${d.getDate()}</b><span>${mon(d)}</span></div></button>`;
    return `<article class="ev"><div class="th">${th}</div><div class="bd"><span class="when">${dow(d)} · ${mon(d)} ${d.getDate()} · ${esc(ev.time)}${n<=1?`<em>${n<=0?'Today':'Tomorrow'}</em>`:''}</span><h3 class="d">${esc(ev.t)}</h3><p class="loc">${esc(ev.loc)}</p><p class="snip">${esc(ev.desc)}</p><div class="act"><a href="/events/${ev.slug}">Details</a><a href="${ev.url}" target="_blank" rel="noopener">Source ↗</a><span class="cat">${esc(ev.c)}</span><button data-ics="${ix}">+ Calendar</button><button data-share="${ix}">Share</button></div></div></article>`}).join('')
   :`<div class="empty">Nothing in this view yet. Try “All upcoming”.</div>`;
}
$$('.filters .fbtn').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.f;expanded=false;$$('.filters .fbtn').forEach(x=>x.setAttribute('aria-pressed',x===b));renderEvents()}));
$('#emore').addEventListener('click',()=>{expanded=!expanded;renderEvents()});
$('#cats').addEventListener('click',e=>{const b=e.target.closest('.cbtn');if(!b)return;cat=b.dataset.c;expanded=false;$$('#cats .cbtn').forEach(x=>x.setAttribute('aria-pressed',x===b));renderEvents()});
$('#erail').addEventListener('click',e=>{
  const i=e.target.dataset.ics,j=e.target.dataset.share,o=e.target.closest('[data-open]');
  if(i!==undefined)return icsFor(EVENTS[i]);
  if(j!==undefined)return share(EVENTS[j]);
  if(o)openLB(EVENTS[o.dataset.open],o.dataset.open);
});
/* lightbox */
const lb=document.createElement('dialog');lb.className='lb';lb.setAttribute('aria-label','Event details');document.body.appendChild(lb);
function openLB(ev,ix){
  const d=parse(ev.d);
  lb.innerHTML=`<button class="close" aria-label="Close">×</button><div class="in" style="${ev.img?'':'grid-template-columns:1fr'}">${ev.img?`<div class="im"><img src="${ev.img}" alt="Flyer for ${esc(ev.t)}"></div>`:''}<div class="tx"><span class="when">${dow(d)} · ${mon(d)} ${d.getDate()} · ${esc(ev.time)}</span><h3 class="d">${esc(ev.t)}</h3><p><b>${esc(ev.loc)}</b></p><p>${esc(ev.desc)}</p><div class="row"><a class="btn p" href="${ev.url}" target="_blank" rel="noopener">Read more at source ↗</a><a class="btn o" href="/events/${ev.slug}">Full page</a><button class="btn o" data-ics="${ix}">+ Calendar</button><button class="btn o" data-share="${ix}">Share</button></div></div></div>`;
  lb.showModal();
}
lb.addEventListener('click',e=>{
  if(e.target===lb||e.target.classList.contains('close'))return lb.close();
  const i=e.target.dataset.ics,j=e.target.dataset.share;
  if(i!==undefined)icsFor(EVENTS[i]);if(j!==undefined)share(EVENTS[j]);
});
renderEvents();

/* live ribbon + next up */
(function(){
  const up=EVENTS.filter(e=>dayDiff(e.d)>=0).sort((a,b)=>a.d.localeCompare(b.d));
  if(!up.length){$('#ribbonLink').textContent='Check back soon for new events';return}
  const first=up[0],second=up.find(e=>e!==first&&e.d!==first.d)||up[1];
  const f=e=>`${parse(e.d).toLocaleString('en-US',{weekday:'short'})} ${mon(parse(e.d))} ${parse(e.d).getDate()} · ${e.t}`;
  $('#ribbonLink').textContent=f(first)+(second?'   |   '+f(second):'');
  $('#nextUp').hidden=false;$('#nextTitle').textContent=first.t;$('#nextWhen').textContent=first.time+' · '+rel(dayDiff(first.d));
})();

/* funding & jobs with live countdown badges */
let ft='all';
function renderFund(){
  const items=FUND.filter(x=>(ft==='all'||x.type===ft)&&(x.end===null||dayDiff(x.end)>=0)).sort((a,b)=>(a.end||'9999').localeCompare(b.end||'9999'));
  $('#fgrid').innerHTML=items.map(x=>{
    let b;
    if(x.end){const n=dayDiff(x.end);b=`<span class="badge ${n<=14?'urgent':'open'}">${x.note||'Closes'} ${x.note?'':rel(n)} ${x.note?'':'· '+parse(x.end).toLocaleString('en-US',{month:'short',day:'numeric'})}</span>`}
    else b=`<span class="badge ${x.note==='Rolling'||x.note==='Ongoing'?'roll':'open'}">${x.note}</span>`;
    return `<article class="fc"><span class="type">${x.type}</span><h3 class="d"><a href="/funding/${x.slug}" style="text-decoration:none">${esc(x.t)}</a></h3><p>${esc(x.p)}</p><span class="who">For: ${esc(x.who)}</span><a class="src" href="${x.url}" target="_blank" rel="noopener">Learn more at source ↗</a>${b}</article>`}).join('');
}
$$('.tabs .fbtn').forEach(b=>b.addEventListener('click',()=>{ft=b.dataset.t;$$('.tabs .fbtn').forEach(x=>x.setAttribute('aria-pressed',x===b));renderFund()}));
renderFund();

/* resource search */
$('#q').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();let shown=0;
  $$('#bento .res').forEach(c=>{const hit=!q||(c.textContent+' '+c.dataset.k).toLowerCase().includes(q);c.classList.toggle('hide',!hit);if(hit)shown++});
  $('#noresult').style.display=shown?'none':'block';
});

/* ===== premium features ===== */
const GALLERY=[
 {src:"/concept-assets/nico-daily-record.jpeg",cap:"Receiving an award from The Daily Record"},
 {src:"/concept-assets/nico-elections.jpeg",cap:"At the Maryland State Board of Elections"},
 {src:"/concept-assets/nico-ravens.jpg",cap:"At a Ravens game"},
 {src:"/concept-assets/nico-family.jpeg",cap:"With his family"},
 {src:"/concept-assets/nico-community.jpeg",cap:"Out in the community"},
 {src:"/concept-assets/nico-family-holiday.jpg",cap:"Holiday with family"}
];
$('#gal').innerHTML=GALLERY.map((g,i)=>`<button class="gph" data-g="${i}" aria-label="Enlarge photo: ${esc(g.cap)}"><img src="${g.src}" alt="${esc(g.cap)}" loading="lazy"></button>`).join('');
const step=()=>Math.max(260,$('#gal').clientWidth*.8);
$('#galPrev').onclick=()=>$('#gal').scrollBy({left:-step()});
$('#galNext').onclick=()=>$('#gal').scrollBy({left:step()});
$('#gal').addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('#gal').scrollBy({left:step()});if(e.key==='ArrowLeft')$('#gal').scrollBy({left:-step()})});
$('#gal').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=GALLERY[b.dataset.g];
  lb.innerHTML=`<button class="close" aria-label="Close">×</button><div class="in" style="grid-template-columns:1fr"><div class="im" style="max-height:82vh"><img src="${g.src}" alt="${esc(g.cap)}"></div></div>`;lb.showModal()});

/* announcement carousel */
(function(){
  const money=s=>parse(s).toLocaleString('en-US',{month:'short',day:'numeric'});
  const slides=[];
  const grant=FUND.filter(f=>f.end&&dayDiff(f.end)>=0&&f.type==='Grant').sort((a,b)=>a.end.localeCompare(b.end))[0];
  if(grant)slides.push({k:'Open now · Nonprofits',h:grant.t+' is open',p:'Applications close '+money(grant.end)+'.',b:'See details',href:'/funding/'+grant.slug});
  const food=EVENTS.filter(e=>dayDiff(e.d)>=0&&dayDiff(e.d)<=14&&e.c==='Food help').slice(0,2);
  if(food.length)slides.push({k:'Coming up',h:'Free food help near you',p:food.map(e=>e.t+' ('+mon(parse(e.d))+' '+parse(e.d).getDate()+')').join(' and ')+'.',b:'See food events',href:'/events?category=food-help'});
  slides.push({k:'Stay in the loop',h:'New events and deadlines, in your inbox',p:'Short updates when something new goes up. Nothing else.',b:'Sign up',href:'#join'});
  const tr=$('#annTrack'),dots=$('#annDots');let i=0,timer;
  tr.innerHTML=slides.map((x,n)=>`<div class="ann-slide" role="group" aria-roledescription="slide" aria-label="${n+1} of ${slides.length}"><small>${x.k}</small><h3 class="d">${x.h}</h3><p>${x.p}</p><a class="btn" href="${x.href}">${x.b}</a></div>`).join('');
  dots.innerHTML=slides.map((_,n)=>`<button aria-label="Go to slide ${n+1}"></button>`).join('');
  function go(n){i=(n+slides.length)%slides.length;tr.style.transform=`translateX(-${i*100}%)`;[...dots.children].forEach((d,k)=>d.setAttribute('aria-current',k===i))}
  const play=()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;clearInterval(timer);timer=setInterval(()=>go(i+1),6500)};
  $('.ann-nav.prev').onclick=()=>{go(i-1);play()};$('.ann-nav.next').onclick=()=>{go(i+1);play()};
  dots.onclick=e=>{const k=[...dots.children].indexOf(e.target);if(k>=0){go(k);play()}};
  const sec=$('#ann');sec.addEventListener('mouseenter',()=>clearInterval(timer));sec.addEventListener('mouseleave',play);sec.addEventListener('focusin',()=>clearInterval(timer));
  go(0);play();
})();

/* mobile menu */
$('#menuBtn').onclick=()=>{const m=$('#mnav');m.hidden=!m.hidden;$('#menuBtn').setAttribute('aria-expanded',!m.hidden)};
$('#mnav').addEventListener('click',e=>{if(e.target.closest('a')){$('#mnav').hidden=true;$('#menuBtn').setAttribute('aria-expanded','false')}});
/* help fab */
$('#helpFab').onclick=()=>{const p=$('#helpPanel');p.hidden=!p.hidden;$('#helpFab').setAttribute('aria-expanded',!p.hidden)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#helpPanel').hidden=true;$('#helpFab').setAttribute('aria-expanded','false')}});

/* search overlay */
(function(){
  const sr=$('#sr'),q=$('#srq'),res=$('#srres');
  const RES=CATNAMES.map(c=>[c,BLURB[c]||'']);
  function run(){
    const t=q.value.trim().toLowerCase();
    if(!t){res.innerHTML='<div class="none">Type to search events, funding and resources.</div>';return}
    const ev=EVENTS.filter(e=>dayDiff(e.d)>=0&&(e.t+' '+e.desc+' '+e.loc+' '+e.c).toLowerCase().includes(t)).slice(0,6);
    const fu=FUND.filter(f=>(f.t+' '+f.p+' '+f.type).toLowerCase().includes(t)).slice(0,5);
    const rs=RES.filter(r=>(r[0]+' '+r[1]).toLowerCase().includes(t)).slice(0,4);
    let h='';
    if(ev.length)h+='<h4>Events</h4>'+ev.map(e=>`<button class="hit" data-ev="${EVENTS.indexOf(e)}">${esc(e.t)}<small>${mon(parse(e.d))} ${parse(e.d).getDate()} · ${esc(e.time)}</small></button>`).join('');
    if(fu.length)h+='<h4>Funding &amp; jobs</h4>'+fu.map(f=>`<a href="/funding/${f.slug}">${esc(f.t)}<small>${esc(f.type)} · ${esc(f.who)}</small></a>`).join('');
    if(rs.length)h+='<h4>Resources</h4>'+rs.map(r=>`<a href="/resources/${slug(r[0])}">${esc(r[0])}<small>${esc(r[1])}</small></a>`).join('');
    res.innerHTML=h||'<div class="none">No matches. Try “food”, “grant” or “job”.</div>';
  }
  $('#openSearch').onclick=()=>{sr.showModal();q.focus();run()};
  $('#srclose').onclick=()=>sr.close();
  q.addEventListener('input',run);
  sr.addEventListener('click',e=>{if(e.target===sr)sr.close();const h=e.target.closest('[data-ev]');if(h){sr.close();openLB(EVENTS[h.dataset.ev],h.dataset.ev)}if(e.target.closest('[data-close]'))sr.close()});
})();

/* reveal on scroll + count-up */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add('in');const c=en.target.querySelector('[data-count]');if(c&&!c.dataset.done){c.dataset.done=1;const to=+c.dataset.count,suf=c.dataset.suffix||'',t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1100);c.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0)}io.unobserve(en.target)}),{threshold:.2});
  $$('.rv').forEach(el=>io.observe(el));
})();


})();
