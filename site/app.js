const $ = id => document.getElementById(id);
document.getElementById('logo').src = 'data:image/png;base64,' + LOGO_B64;

// ---- default transfers ----
const DEF_TRANSFERS = [
  "Групповой трансфер: Батуми (отель) → Ризе (отель)",
  "Групповой трансфер: Ризе (отель) → Батуми (аэропорт)",
  "Экскурсия по городу Батуми",
  "Экскурсия по городу Ризе",
  "Экскурсия по городу Трабзон",
];
function addTransfer(val=""){
  const wrap=$('transfers');
  const div=document.createElement('div'); div.className='titem';
  const inp=document.createElement('input'); inp.value=val;
  const del=document.createElement('button'); del.className='mini'; del.textContent='×';
  del.onclick=()=>div.remove();
  div.append(inp,del); wrap.append(div);
}
DEF_TRANSFERS.forEach(addTransfer);
$('addTransfer').onclick=()=>addTransfer();

// ---- collect group config from form ----
function cfg(){
  const v=id=>$(id).value.trim();
  const or=(id)=>v(id)|| $(id).placeholder;
  return {
    flights:[
      {dep_date:or('f1_dd'),dep_time:or('f1_dt'),dep_city:or('f1_dc'),dep_code:or('f1_dk'),
       arr_date:or('f1_ad'),arr_time:or('f1_at'),arr_city:or('f1_ac'),arr_code:or('f1_ak')},
      {dep_date:or('f2_dd'),dep_time:or('f2_dt'),dep_city:or('f2_dc'),dep_code:or('f2_dk'),
       arr_date:or('f2_ad'),arr_time:or('f2_at'),arr_city:or('f2_ac'),arr_code:or('f2_ak')},
    ],
    hotels:[
      {label:or('h1_l'),name:or('h1_n'),dates:or('h1_d')},
      {label:or('h2_l'),name:or('h2_n'),dates:or('h2_d')},
    ],
    transfers:[...document.querySelectorAll('#transfers input')].map(i=>i.value.trim()).filter(Boolean),
    agency:{name:v('ag_n'),phone:v('ag_p'),email:v('ag_e'),address:v('ag_a')},
    startNo:parseInt(v('startNo'))||364,
    depDate:v('depDate')||$('f1_dd').value.trim()||$('f1_dd').placeholder,
  };
}

// ---- Excel reading + grouping ----
let GROUPS=null;
function parseDate(val){
  if(val==null||val==="") return null;
  if(typeof val==='number'){ // excel serial -> build a local date from UTC parts
    const d=new Date(Math.round((val-25569)*86400*1000)); // instant at UTC midnight
    return new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()); // no TZ day-shift
  }
  const s=String(val);
  let m=s.match(/(\d{4})-(\d{2})-(\d{2})/); if(m) return new Date(+m[1],+m[2]-1,+m[3]);
  m=s.match(/(\d{2})\.(\d{2})\.(\d{4})/); if(m) return new Date(+m[3],+m[2]-1,+m[1]);
  const d=new Date(s); return isNaN(d)?null:d;
}
function fmtDate(d){ if(!d)return"";
  return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear(); }
function category(dob,ref){
  if(!dob) return "ADULT";
  let age=ref.getFullYear()-dob.getFullYear();
  if((ref.getMonth()<dob.getMonth())||(ref.getMonth()===dob.getMonth()&&ref.getDate()<dob.getDate())) age--;
  if(age<2)return"INFANT"; if(age<12)return"CHILD"; return"ADULT";
}
function colorOf(cell){
  if(cell&&cell.s){ const f=cell.s.fgColor||cell.s.bgColor;
    if(f&&f.rgb) return f.rgb; }
  return null;
}
// find the last header row so data reading starts right after it.
// Works whether the sheet has 1 or 2 header rows (or none) — never drops the
// first tourist. A row is a header if its cells read like column titles.
function headerEndRow(ws,ref){
  const cell=(col,r)=>{ const c=ws[col+(r+1)]; return c&&c.v!=null?String(c.v).trim().toLowerCase():""; };
  const looksHeader=(r)=>{
    const a=cell('A',r),b=cell('B',r),c=cell('C',r),f=cell('F',r);
    return /full\s*name|ф\.?\s*и\.?\s*о|фамилия|passenger/.test(b)
        || /\broom\b|комнат|размещ/.test(f)
        || /date\s*of\s*birth|birth|рожд/.test(c)
        || a==='№'||a==='#'||/^no\.?$/.test(a);
  };
  let last=-1;
  for(let r=ref.s.r;r<=Math.min(ref.e.r,ref.s.r+9);r++) if(looksHeader(r)) last=r;
  return last; // -1 => no header found
}

function readExcel(buf){
  const wb=XLSX.read(buf,{type:'array',cellStyles:true});
  const ws=wb.Sheets[wb.SheetNames[0]];
  const ref=XLSX.utils.decode_range(ws['!ref']);
  const start=headerEndRow(ws,ref)+1; // first data row (0-indexed); 0 if no header
  const rows=[];
  for(let r=start;r<=ref.e.r;r++){
    const name=ws['B'+(r+1)]; const dob=ws['C'+(r+1)];
    const pass=ws['D'+(r+1)]; const room=ws['F'+(r+1)];
    const nameVal = (name && name.v!=null && String(name.v).trim()!=="") ? String(name.v).trim() : null;
    rows.push({
      name:nameVal,
      dob:dob&&dob.v!=null?parseDate(dob.v):null,
      passport:pass&&pass.v!=null?String(pass.v).trim():"",
      room:room&&room.v!=null?String(room.v).trim():"",
      color:colorOf(room),
    });
  }
  // group by color change; blank name = boundary+skip
  const groups=[]; let cur=[]; let prev=null;
  for(const row of rows){
    if(!row.name){ if(cur.length){groups.push(cur);cur=[];} prev=null; continue; }
    if(row.color!==prev && cur.length){ groups.push(cur); cur=[]; }
    cur.push(row); prev=row.color;
  }
  if(cur.length) groups.push(cur);
  return groups;
}

// ---- build voucher data list ----
function buildVouchers(groups,c){
  const ref=parseDate(c.depDate)||new Date();
  const cap={DBL:2,TWIN:2,TRPL:3};
  return groups.map((g,i)=>{
    const no='EVB-'+String(c.startNo+i).padStart(4,'0');
    const pax=g.map(p=>({name:p.name,passport:p.passport,dob:fmtDate(p.dob),
      category:category(p.dob,ref)}));
    const rooms=[...new Set(g.map(p=>p.room))];
    let warn=""; rooms.forEach(rm=>{ if(cap[rm]&&g.length>cap[rm]) warn=`${g.length} чел. в ${rm} (макс ${cap[rm]})`; });
    return {order_no:no,passengers:pax,rooms,warn,
      flights:c.flights,hotels:c.hotels,transfers:c.transfers,agency:c.agency};
  });
}

// ---- render report ----
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderReport(vs){
  const list=$('rlist'); list.innerHTML='';
  vs.forEach(v=>{
    const row=document.createElement('div'); row.className='rrow'+(v.warn?' warn':'');
    row.innerHTML=`<span class="no">${esc(v.order_no)}</span>
      <span class="pax">${v.passengers.map(p=>esc(p.name)).join('; ')}</span>
      <span class="rm">${esc(v.rooms.join(','))}</span>
      ${v.warn?`<span class="flag">⚠ ${esc(v.warn)}</span>`:''}`;
    list.append(row);
  });
  $('report').style.display='block';
}

// ---- file handling ----
const drop=$('drop'), fileInput=$('file');
drop.onclick=()=>fileInput.click();
drop.ondragover=e=>{e.preventDefault();drop.classList.add('over');};
drop.ondragleave=()=>drop.classList.remove('over');
drop.ondrop=e=>{e.preventDefault();drop.classList.remove('over');
  if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);};
fileInput.onchange=e=>{if(e.target.files[0])handleFile(e.target.files[0]);};

function handleFile(f){
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      GROUPS=readExcel(rd.result);
      drop.querySelector('strong').textContent='✓ '+f.name+' ('+GROUPS.length+' ваучеров)';
      $('go').disabled=false; $('go').textContent='Создать '+GROUPS.length+' ваучеров';
    }catch(err){ alert('Не удалось прочитать файл: '+err.message); }
  };
  rd.readAsArrayBuffer(f);
}

// ---- generate on click ----
let LAST=null;
$('go').onclick=async()=>{
  if(!GROUPS)return;
  const c=cfg();
  const vs=buildVouchers(GROUPS,c);
  renderReport(vs);
  $('go').textContent='Готово ✓ '+vs.length+' ваучеров';
  LAST=vs;
};

$('dlAll').onclick=async()=>{
  if(!LAST)return;
  const bytes=await makePdf(LAST);
  saveBlob(new Blob([bytes],{type:'application/pdf'}),'ALL_VOUCHERS.pdf');
};
$('dlZip').onclick=async()=>{
  if(!LAST)return;
  const zip=new JSZip();
  for(const v of LAST){
    const bytes=await makePdf([v]);
    zip.file(v.order_no+'.pdf',bytes);
  }
  const blob=await zip.generateAsync({type:'blob'});
  saveBlob(blob,'vouchers.zip');
};
function saveBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=name; a.style.display='none';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000); // revoke late so the download isn't cancelled
}
