(function(){
const $=s=>document.querySelector(s);
const CATS=['Green Screen','Lyrics Overlays','Black Bars','Transitions','Effects','PNGs','Other'];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>{try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?x.href:'#';}catch(e){return '#';}};
let items=[],cat='All',q='';
const state=(h,err)=>{const s=$('#state');s.className='state'+(err?' err':'');s.innerHTML=h;};
function chips(){$('#chips').innerHTML=['All',...CATS].map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join('');}
const thumb=m=>m.thumb?`<img class="thumb" loading="lazy" alt="${esc(m.title)} thumbnail" src="${esc(safe(m.thumb))}">`:'<div class="thumb"></div>';
function render(){
  const list=items.filter(m=>(cat==='All'||m.category===cat)&&String(m.title).toLowerCase().includes(q));
  $('#grid').innerHTML=list.map(m=>`<article class="card" data-i="${items.indexOf(m)}">${thumb(m)}
    <div class="cb"><span class="tag">${esc(m.category)}</span><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p>
    <a class="btn sm" href="${esc(safe(m.file))}" download target="_blank" rel="noopener">Download</a></div></article>`).join('');
  if(!items.length)state('No materials yet. Check back soon.');
  else if(!list.length)state('No materials match your search. Try another word or category.');
  else state('');
}
async function load(){
  state('<div class="spin"></div>Loading materials…');
  try{
    const r=await fetch('materials.json',{cache:'no-cache'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const d=await r.json();
    items=d.filter(m=>m&&m.published!==false&&m.title&&m.file);
    render();
  }catch(e){state('Could not load materials. Check materials.json for a typo (comma or quote), then refresh.',true);}
}
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;cat=b.dataset.c;chips();render();});
$('#q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();render();});
document.addEventListener('click',e=>{
  const d=$('#dlg');
  if(e.target.id==='close'||e.target===d){d.close();return;}
  if(e.target.closest('a.btn'))return;
  const c=e.target.closest('.card');if(!c)return;
  const m=items[+c.dataset.i];
  d.innerHTML=`${thumb(m)}<div class="dbody"><span class="tag">${esc(m.category)}</span><h2 style="margin:0">${esc(m.title)}</h2>
  <p>${esc(m.description)}</p><div class="row"><a class="btn" href="${esc(safe(m.file))}" download target="_blank" rel="noopener">Download free</a>
  <button class="btn ghost" id="close">Close</button></div></div>`;
  d.showModal();
});
chips();load();
})();
