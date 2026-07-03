// PDF rendering with pdf-lib, layout matched to the EVB reference sample.
const { PDFDocument, rgb } = PDFLib;

function b64ToBytes(b64){
  const bin=atob(b64); const arr=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
  return arr;
}
const COL={
  green:rgb(0.118,0.353,0.227), dgreen:rgb(0.078,0.263,0.173),
  grey:rgb(0.42,0.49,0.45), lgrey:rgb(0.60,0.64,0.61),
  border:rgb(0.72,0.78,0.74), ink:rgb(0.10,0.10,0.10),
};
const W=595.28, H=841.89;

async function makePdf(vouchers){
  const doc=await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const reg=await doc.embedFont(b64ToBytes(FONT_REG),{subset:true});
  const bold=await doc.embedFont(b64ToBytes(FONT_BOLD),{subset:true});
  const logo=await doc.embedPng(b64ToBytes(LOGO_B64));

  for(const v of vouchers){
    const page=doc.addPage([W,H]);
    drawVoucher(page,v,{reg,bold,logo});
  }
  return await doc.save();
}

function drawVoucher(p,d,F){
  const ML=50, CR=540, CW=CR-ML, CX=(ML+CR)/2;   // content box
  const R=6;                                       // corner radius

  const T=(s,x,yy,size,font,color)=>p.drawText(String(s||""),{x,y:yy,size,font,color});
  const center=(s,cx,yy,size,font,color)=>{
    const tw=font.widthOfTextAtSize(String(s||""),size); T(s,cx-tw/2,yy,size,font,color);
  };
  const right=(s,rx,yy,size,font,color)=>{
    const tw=font.widthOfTextAtSize(String(s||""),size); T(s,rx-tw,yy,size,font,color);
  };
  // rounded rectangle. (x,top)=top-left corner in PDF coords, grows downward.
  const rr=(x,top,w,h,{r=R,stroke=COL.green,sw=1,fill=rgb(1,1,1)}={})=>{
    const pth=`M ${r} 0 H ${w-r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h-r} `
      +`A ${r} ${r} 0 0 1 ${w-r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h-r} V ${r} `
      +`A ${r} ${r} 0 0 1 ${r} 0 Z`;
    p.drawSvgPath(pth,{x,y:top,borderColor:stroke,borderWidth:sw,color:fill});
  };
  // filled "person" glyph centred at (cx,cy)
  const person=(cx,cy)=>{
    const rh=4.6;                       // head radius
    const hcy=cy+5.2;                    // head centre (above icon centre)
    p.drawCircle({x:cx,y:hcy,size:rh,color:COL.green});
    const bw=15.4, bh=8.2, br=7.7;       // shoulders: rounded-top bar
    const bx=cx-bw/2, bt=hcy-rh-1.3;
    const pth=`M 0 ${bh} V ${br} A ${br} ${br} 0 0 1 ${br} 0 H ${bw-br} `
      +`A ${br} ${br} 0 0 1 ${bw} ${br} V ${bh} Z`;
    p.drawSvgPath(pth,{x:bx,y:bt,color:COL.green,borderWidth:0});
  };
  // filled green disc with a white plane, centred at (cx,cy)
  const planeDisc=(cx,cy)=>{
    p.drawCircle({x:cx,y:cy,size:13,color:COL.green});
    center("✈",cx+1,cy-4.4,15,F.bold,rgb(1,1,1));
  };
  // ---- header ----
  // the logo asset is the genuine mark (leaf + ETIHAD wordmark), cut from
  // the approved sample — drawn as-is, nothing is typeset over it.
  const lh=55, lw=lh/logoRatio(F.logo);
  p.drawImage(F.logo,{x:CX-lw/2,y:806-lh,width:lw,height:lh});
  right("Номер заказа:",CR,785,9,F.bold,COL.green);
  right(d.order_no,CR,763,18,F.bold,COL.dgreen);

  // ---- passengers ----
  T("Информация о пассажирах:",ML,718,11,F.bold,COL.dgreen);
  const nameW=279, docW=97, dobW=97, gap=8;
  const docX=ML+nameW+gap, dobX=docX+docW+gap;
  const ph=40, pgap=12;
  let top=712;
  for(const pax of d.passengers){
    const cy=top-ph/2;
    rr(ML,top,nameW,ph);
    person(ML+22,cy);
    T(pax.name,ML+42,cy-3.6,11,F.bold,COL.ink);
    rr(docX,top,docW,ph);
    T("НОМЕР ДОКУМЕНТА:",docX+9,top-13,6.3,F.reg,COL.lgrey);
    T(pax.passport,docX+9,top-27,9.5,F.bold,COL.ink);
    rr(dobX,top,dobW,ph);
    T("ДАТА РОЖДЕНИЯ:",dobX+9,top-13,6.3,F.reg,COL.lgrey);
    T(pax.dob,dobX+9,top-26,9.5,F.bold,COL.ink);
    T(pax.category,dobX+9,top-37,7.5,F.bold,COL.green);
    top-=ph+pgap;
  }
  const paxBottom=top+pgap;

  // ---- route ----
  const routeHead=paxBottom-29;
  T("Информация о маршруте:",ML,routeHead,11,F.bold,COL.dgreen);
  const fh=55, fgap=15, fcRight=329;
  const boxW=(fcRight-ML-10)/2;               // two flight boxes with 10pt centre gap
  const depX=ML, arrX=ML+boxW+10, pcx=ML+boxW+5;
  const costX=347, costW=CR-costX;
  const routeTop=routeHead-8;
  let fTop=routeTop;
  for(const s of d.flights){
    const cy=fTop-fh/2;
    rr(depX,fTop,boxW,fh);
    let dcx=depX+boxW/2;
    center(s.dep_date,dcx,fTop-13,8,F.reg,COL.ink);
    center(s.dep_time,dcx,fTop-25,8,F.reg,COL.ink);
    center(s.dep_city,dcx,fTop-40,11,F.bold,COL.ink);
    center(s.dep_code,dcx,fTop-50,7,F.reg,COL.grey);
    rr(arrX,fTop,boxW,fh);
    let acx=arrX+boxW/2;
    center(s.arr_date,acx,fTop-13,8,F.reg,COL.ink);
    center(s.arr_time,acx,fTop-25,8,F.reg,COL.ink);
    center(s.arr_city,acx,fTop-40,11,F.bold,COL.ink);
    center(s.arr_code,acx,fTop-50,7,F.reg,COL.grey);
    planeDisc(pcx,cy);
    fTop-=fh+fgap;
  }
  const flightBottom=fTop+fgap, costH=routeTop-flightBottom;
  rr(costX,routeTop,costW,costH);
  T("СТОИМОСТЬ:",costX+16,routeTop-32,8,F.bold,COL.ink);
  T("РАЗМЕЩЕНИЕ:",costX+108,routeTop-32,8,F.bold,COL.ink);
  T("РУЧНАЯ КЛАДЬ:",costX+16,routeTop-71,8,F.bold,COL.ink);
  T("БАГАЖ:",costX+108,routeTop-71,8,F.bold,COL.ink);

  // ---- hotels ----
  const hw=(CW-16)/2, hh=44;
  const hTop=flightBottom-12;
  d.hotels.forEach((ht,i)=>{
    const hx=ML+i*(hw+16);
    rr(hx,hTop,hw,hh);
    T(ht.label,hx+14,hTop-14,7,F.reg,COL.grey);
    T(ht.name,hx+14,hTop-28,10.5,F.bold,COL.ink);
    T(ht.dates,hx+14,hTop-39,7.5,F.reg,COL.grey);
  });
  const hotelBottom=hTop-hh;

  // ---- transfers ----
  const transHead=hotelBottom-14;
  T("Трансфер и экскурсии:",ML,transHead,11,F.bold,COL.dgreen);
  const rowH=16.8, tTop=transHead-20.5;
  const th=d.transfers.length*rowH;
  rr(ML,tTop,CW,th);
  d.transfers.forEach((t,i)=>{
    const ry=tTop-i*rowH;
    T(t,ML+14,ry-11,8.5,F.reg,COL.ink);
    if(i>0) p.drawLine({start:{x:ML+1,y:ry},end:{x:CR-1,y:ry},thickness:0.6,color:COL.border});
  });

  // ---- agency footer ----
  // every footer line shrinks to fit its box so nothing ever crosses the border
  const fit=(s,max,size)=>{ while(size>4 && F.bold.widthOfTextAtSize(s,size)>max) size-=0.1; return size; };
  const ag=d.agency, aw=(CW-16)/2, ah=25, agap=12;
  let aTop=tTop-th-12.5;
  const agName="АГЕНТСТВО: "+ag.name;
  rr(ML,aTop,aw,ah); T(agName,ML+14,aTop-16,fit(agName,aw-26,8.5),F.bold,COL.ink);
  const agPhone="ТЕЛЕФОН: "+ag.phone;
  rr(ML+aw+16,aTop,aw,ah); T(agPhone,ML+aw+30,aTop-16,fit(agPhone,aw-42,8.5),F.bold,COL.ink);
  aTop-=ah+agap;
  const agMail="ЭЛ. ПОЧТА: "+(ag.email||"");
  rr(ML,aTop,aw,ah); T(agMail,ML+14,aTop-16,fit(agMail,aw-26,8.5),F.bold,COL.ink);
  rr(ML+aw+16,aTop,aw,ah);
  const adr="АДРЕС: "+ag.address;
  T(adr,ML+aw+30,aTop-15,fit(adr,aw-42,6.3),F.bold,COL.grey);

  // ---- bottom separator ----
  const sepY=aTop-ah-9;
  p.drawLine({start:{x:ML,y:sepY},end:{x:CR,y:sepY},thickness:0.8,color:COL.border});
}

let _lr=null;
function logoRatio(img){ if(_lr==null)_lr=img.height/img.width; return _lr; }
