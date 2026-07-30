const cards=[...document.querySelectorAll('.lesson-card')];
const search=document.querySelector('#searchInput');
let activeFilter='all';

function applyFilters(){
  const term=search.value.trim().toLowerCase();
  let visible=0;
  cards.forEach(card=>{
    const matchesFilter=activeFilter==='all'||card.dataset.status===activeFilter;
    const matchesSearch=!term||card.dataset.title.includes(term)||card.textContent.toLowerCase().includes(term);
    card.hidden=!(matchesFilter&&matchesSearch);
    if(!card.hidden)visible++;
  });
  document.querySelector('#lessonCount').textContent=`${visible} bài học`;
  document.querySelector('#emptyState').hidden=visible!==0;
}

document.querySelectorAll('[data-filter]').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    activeFilter=button.dataset.filter;
    applyFilters();
  });
});
search.addEventListener('input',applyFilters);

const sidebar=document.querySelector('#sidebar');
const backdrop=document.querySelector('#navBackdrop');
document.querySelector('#openNav').addEventListener('click',()=>{sidebar.classList.add('open');backdrop.classList.add('open')});
function closeNav(){sidebar.classList.remove('open');backdrop.classList.remove('open')}
document.querySelector('#closeNav').addEventListener('click',closeNav);
backdrop.addEventListener('click',closeNav);

document.querySelectorAll('.lesson-link').forEach(link=>{
  link.addEventListener('click',()=>document.body.classList.add('page-leaving'));
});
