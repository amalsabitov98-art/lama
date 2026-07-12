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

// ---- route directions -------------------------------------------------------
// A direction fixes the cities, airport codes, flight TIMES and hotel order.
// Only the dates change: the user types one "outbound" date and the rest
// (return date, hotel date ranges) are computed. Every filled field stays
// editable afterwards. To add a new direction later, just extend this object.
const DIRECTIONS={
  trabzon:{
    f1:{dc:'ТАШКЕНТ',dk:'ТАШКЕНТ (TAS)',dt:'14:30', ac:'ТРАБЗОН',ak:'ТРАБЗОН (TZX)',at:'16:20', dayOff:0},
    f2:{dc:'БАТУМИ', dk:'БАТУМИ (BUS)', dt:'00:20', ac:'ТАШКЕНТ',ak:'ТАШКЕНТ (TAS)',at:'04:20', dayOff:8},
    h1:{l:'ОТЕЛЬ РИЗЕ:', n:'RHISOS GOLD OTEL RIZE', from:0, nights:4},
    h2:{l:'ОТЕЛЬ БАТУМИ:',n:'BATUMI VIEW LUXURY',   from:4, nights:3},
    bag:'20 кг',
  },
  batumi:{
    f1:{dc:'ТАШКЕНТ',dk:'ТАШКЕНТ (TAS)',dt:'20:50', ac:'БАТУМИ', ak:'БАТУМИ (BUS)', at:'23:20', dayOff:0},
    f2:{dc:'ТРАБЗОН',dk:'ТРАБЗОН (TZX)',dt:'17:20', ac:'ТАШКЕНТ',ak:'ТАШКЕНТ (TAS)',at:'22:20', dayOff:7},
    h1:{l:'ОТЕЛЬ БАТУМИ:',n:'BATUMI VIEW LUXURY',   from:0, nights:4},
    h2:{l:'ОТЕЛЬ РИЗЕ:', n:'RHISOS GOLD OTEL RIZE', from:4, nights:3},
    bag:'23 кг',
  },
};
const CABIN='8 кг'; // hand luggage — same for both directions
function nightsWord(n){ n=Math.abs(n)%100; const a=n%10;
  if(a===1&&n!==11)return'ночь'; if(a>=2&&a<=4&&(n<12||n>14))return'ночи'; return'ночей'; }
function applyDirection(){
  const dir=DIRECTIONS[$('direction').value]; if(!dir) return;
  const set=(id,val)=>{ const el=$(id); if(el) el.value=val; };
  // cities / codes / times — constant for the direction
  set('f1_dc',dir.f1.dc);set('f1_dk',dir.f1.dk);set('f1_dt',dir.f1.dt);
  set('f1_ac',dir.f1.ac);set('f1_ak',dir.f1.ak);set('f1_at',dir.f1.at);
  set('f2_dc',dir.f2.dc);set('f2_dk',dir.f2.dk);set('f2_dt',dir.f2.dt);
  set('f2_ac',dir.f2.ac);set('f2_ak',dir.f2.ak);set('f2_at',dir.f2.at);
  set('h1_l',dir.h1.l);set('h1_n',dir.h1.n);
  set('h2_l',dir.h2.l);set('h2_n',dir.h2.n);
  // dates — computed from the single outbound date (if valid)
  const D=parseDate($('startDate').value.trim()); if(!D) return;
  const add=days=>{ const d=new Date(D); d.setDate(d.getDate()+days); return d; };
  set('f1_dd',fmtDate(D));set('f1_ad',fmtDate(D));
  const R=add(dir.f2.dayOff); set('f2_dd',fmtDate(R));set('f2_ad',fmtDate(R));
  set('depDate',fmtDate(D));
  set('h1_d',`${fmtDate(add(dir.h1.from))} - ${fmtDate(add(dir.h1.from+dir.h1.nights))} (${dir.h1.nights} ${nightsWord(dir.h1.nights)})`);
  set('h2_d',`${fmtDate(add(dir.h2.from))} - ${fmtDate(add(dir.h2.from+dir.h2.nights))} (${dir.h2.nights} ${nightsWord(dir.h2.nights)})`);
}
$('direction').addEventListener('change',applyDirection);
$('startDate').addEventListener('change',applyDirection);

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
    cabin:CABIN,                                        // ручная кладь — одинаковая
    baggage:(DIRECTIONS[$('direction').value]||{}).bag||'', // багаж — по направлению
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
    // hard errors (real mistakes) vs soft notes (missing data — informational)
    const hard=[], soft=[];
    rooms.forEach(rm=>{ if(cap[rm]&&g.length>cap[rm]) hard.push(`${g.length} чел. в ${rm} (макс ${cap[rm]})`); });
    if(!rooms.filter(Boolean).length) soft.push('нет размещения');
    if(g.some(p=>!p.passport)) soft.push('нет паспорта');
    if(g.some(p=>!p.dob)) soft.push('нет даты рождения');
    const warn=hard.join('; '), note=soft.join('; ');
    // cost box: price left blank, room from Excel, cabin fixed, baggage per direction
    const cost={price:'',room:rooms.filter(Boolean).join(', '),cabin:c.cabin,baggage:c.baggage};
    return {order_no:no,passengers:pax,rooms,warn,note,cost,
      flights:c.flights,hotels:c.hotels,transfers:c.transfers,agency:c.agency};
  });
}

// ---- render report ----
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderReport(vs){
  const list=$('rlist'); list.innerHTML='';
  const hard=vs.filter(v=>v.warn).length, soft=vs.filter(v=>v.note).length, sum=$('rsummary');
  if(sum){
    sum.style.display='block';
    if(hard){ sum.className='rsum bad';
      sum.textContent=`⚠ Ошибки у ${hard} из ${vs.length} — проверьте выделенные строки перед печатью.`; }
    else if(soft){ sum.className='rsum soft';
      sum.textContent=`${soft} с пометками (нет паспорта/даты) — не критично, печатать можно.`; }
    else { sum.className='rsum ok';
      sum.textContent=`✓ Всё в порядке — ${vs.length} ваучеров.`; }
  }
  vs.forEach(v=>{
    const row=document.createElement('div'); row.className='rrow'+(v.warn?' warn':'');
    const tag=v.warn?`<span class="flag">⚠ ${esc(v.warn)}</span>`
      :v.note?`<span class="note">${esc(v.note)}</span>`:'';
    row.innerHTML=`<span class="no">${esc(v.order_no)}</span>
      <span class="pax">${v.passengers.map(p=>esc(p.name)).join('; ')}</span>
      <span class="rm">${esc(v.rooms.join(','))}</span>
      ${tag}`;
    // per-voucher download button (named by the main passenger)
    const btn=document.createElement('button'); btn.type='button'; btn.className='rdl';
    btn.textContent='скачать';
    btn.onclick=async()=>{
      btn.disabled=true; btn.textContent='…';
      try{
        const bytes=await makePdf([v]);
        const base=safeName((v.passengers[0]||{}).name)||v.order_no;
        saveBlob(new Blob([bytes],{type:'application/pdf'}),base+'.pdf');
      }catch(e){ alert('Не удалось создать PDF: '+e.message); }
      finally{ btn.disabled=false; btn.textContent='скачать'; }
    };
    row.append(btn);
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

// ---- Excel template download ----
$('dlTemplate').onclick=()=>{
  const bin=atob(XLSX_TEMPLATE_B64), arr=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  saveBlob(new Blob([arr],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'Etihad_template.xlsx');
};

// ---- continue numbering across sessions ----
try{ const n=localStorage.getItem('etihad_nextNo'); if(n) $('startNo').value=n; }catch(e){}

// ---- generate on click ----
let LAST=null;
$('go').onclick=async()=>{
  if(!GROUPS)return;
  const c=cfg();
  const vs=buildVouchers(GROUPS,c);
  renderReport(vs);
  $('go').textContent='Готово ✓ '+vs.length+' ваучеров';
  LAST=vs;
  try{ localStorage.setItem('etihad_nextNo',String(c.startNo+vs.length)); }catch(e){} // next batch continues
};

$('dlAll').onclick=async()=>{
  if(!LAST)return;
  const bytes=await makePdf(LAST);
  saveBlob(new Blob([bytes],{type:'application/pdf'}),'ALL_VOUCHERS.pdf');
};
// turn a passenger name into a safe file name: "KHOLIKOV MUKHAMMADAKHROR" -> "KHOLIKOV_MUKHAMMADAKHROR"
function safeName(s){
  return String(s||'').trim()
    .replace(/[\/:*?"<>|]+/g,'') // strip filesystem-illegal chars
    .replace(/\s+/g,'_').replace(/_+/g,'_').replace(/^_+|_+$/g,''); // -> single underscores
}
$('dlZip').onclick=async()=>{
  if(!LAST)return;
  const zip=new JSZip(); const seen={};
  for(const v of LAST){
    const bytes=await makePdf([v]);
    let base=safeName((v.passengers[0]||{}).name) || v.order_no; // name of the main passenger
    seen[base]=(seen[base]||0)+1;
    const name=seen[base]===1?base:base+'_'+seen[base];          // dedupe collisions
    zip.file(name+'.pdf',bytes);
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
