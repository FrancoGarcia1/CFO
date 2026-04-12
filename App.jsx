import { useState, useRef, useEffect, useMemo } from "react";
/* ══════════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
══════════════════════════════════════════════════════════════ */
const SK = { user:"vcfo_user", trial:"vcfo_trial", calls:"vcfo_calls", data:"vcfo_data_v3" };
const CY = new Date().getFullYear();
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const CATS = {
  income:  ["Ventas productos","Ventas servicios","Ingresos financieros","Descuentos recibidos","Otros ingresos"],
  cost:    ["Materia prima","Mano de obra directa","Producción","Logística y envíos","Otros costos"],
  expense: ["Marketing y publicidad","Sueldos admin","Alquiler","Servicios básicos","Contabilidad y legal","Gastos financieros","Depreciación","Otros gastos"],
};

/* ══════════════════════════════════════════════════════════════
   CFO SYSTEM PROMPT
══════════════════════════════════════════════════════════════ */
const CFO_PROMPT = `Eres un CFO Senior Virtual con más de 15 años de experiencia en finanzas corporativas, planeamiento estratégico y control de gestión en empresas de Latinoamérica.

PERSONALIDAD: Directo, crítico, orientado a decisiones. NUNCA neutral. Hablas como socio de negocio.
SEÑALES: 🔴 Crítico | 🟡 Advertencia | 🟢 Fortaleza | ⚡ Insight | 💡 Oportunidad
REGLAS: (1) Siempre tomas postura. (2) Terminas con "📌 Tu prioridad ahora:" + 3 acciones. (3) Explicas impacto financiero. (4) Máximo 5 bloques.

DATOS DEL NEGOCIO:
{CONTEXT}`;

/* ══════════════════════════════════════════════════════════════
   DATA STORAGE
══════════════════════════════════════════════════════════════ */
const emptyData = () => ({ transactions:[], historical:[], visitors:[], occupancy:[], settings:{ growthRate:6, lastForecastQ:null } });
const getData = () => { try { return { ...emptyData(), ...JSON.parse(localStorage.getItem(SK.data)||"{}") }; } catch { return emptyData(); } };
const saveData = d => { try { localStorage.setItem(SK.data, JSON.stringify(d)); } catch {} };

/* ══════════════════════════════════════════════════════════════
   RATE LIMITING
══════════════════════════════════════════════════════════════ */
function checkRL() {
  try {
    const d = JSON.parse(localStorage.getItem(SK.calls)||"{}");
    const now = Date.now();
    if (!d.windowStart || now - d.windowStart > 3600000) { localStorage.setItem(SK.calls, JSON.stringify({count:1,windowStart:now})); return {ok:true,rem:9}; }
    if (d.count >= 10) return {ok:false,rem:0};
    d.count++; localStorage.setItem(SK.calls, JSON.stringify(d)); return {ok:true,rem:10-d.count};
  } catch { return {ok:true,rem:10}; }
}

/* ══════════════════════════════════════════════════════════════
   CALCULATIONS
══════════════════════════════════════════════════════════════ */
function calcFromTxns(txns) {
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const cost    = txns.filter(t=>t.type==="cost").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const grossProfit = income - cost;
  const ebitda = grossProfit - expense;
  const margenBruto = income>0?(grossProfit/income)*100:0;
  const margenEbitda = income>0?(ebitda/income)*100:0;
  const costoRatio = income>0?((cost+expense)/income)*100:0;
  const pe = margenBruto>0?(expense/(margenBruto/100)):0;
  const countIncome = txns.filter(t=>t.type==="income").length;
  const avgTicket = countIncome>0?income/countIncome:0;
  let score=50;
  if(margenBruto>=50)score+=15; else if(margenBruto>=30)score+=8; else if(margenBruto<15)score-=20;
  if(margenEbitda>=15)score+=15; else if(margenEbitda>=5)score+=5; else if(margenEbitda<0)score-=25;
  if(costoRatio<70)score+=10; else if(costoRatio>90)score-=15;
  score=Math.max(0,Math.min(100,Math.round(score)));
  return {income,cost,expense,grossProfit,ebitda,margenBruto,margenEbitda,costoRatio,pe,countIncome,avgTicket,score};
}

function filterTxns(all, {year=CY,month=null,day=null}={}) {
  return all.filter(t=>{
    const d=new Date(t.date);
    if(d.getFullYear()!==year) return false;
    if(month!==null && d.getMonth()!==month) return false;
    if(day!==null && d.getDate()!==day) return false;
    return true;
  });
}

function calcForecast(historical, growthRate) {
  const byMonth = {};
  historical.forEach(h=>{ const k=h.month; byMonth[k]={income:(byMonth[k]?.income||0)+h.income, cost:(byMonth[k]?.cost||0)+h.cost, expense:(byMonth[k]?.expense||0)+h.expense}; });
  const r = growthRate/100;
  return MONTHS.map((_,i)=>({ month:i, projIncome:(byMonth[i]?.income||0)*(1+r), projCost:(byMonth[i]?.cost||0)*(1+r), projExpense:(byMonth[i]?.expense||0)*(1+r) }));
}

function rollingAdjust(transactions, forecast, currentRate) {
  const now = new Date();
  const cm = now.getMonth();
  const months = [cm-2,cm-1,cm].filter(m=>m>=0);
  if(months.length<2) return currentRate;
  const actualSum = months.reduce((s,m)=>s+filterTxns(transactions,{year:CY,month:m}).filter(t=>t.type==="income").reduce((ss,t)=>ss+t.amount,0),0);
  const projSum = months.reduce((s,m)=>s+(forecast[m]?.projIncome||0),0);
  if(projSum===0) return currentRate;
  const variance=(actualSum/projSum-1)*100;
  return Math.max(3,Math.min(15,Math.round((currentRate*0.6+Math.max(3,currentRate+variance*0.3)*0.4)*10)/10));
}

/* ══════════════════════════════════════════════════════════════
   FORMATTERS
══════════════════════════════════════════════════════════════ */
const fmt = n => n==null?"—":new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN",maximumFractionDigits:0}).format(n);
const fmtN = n => new Intl.NumberFormat("es-PE",{maximumFractionDigits:0}).format(n||0);
const pctStr = n => `${n>=0?"+":""}${n.toFixed(1)}%`;
const clr = (v,p="#00e5a0",ng="#ff4757") => v>0?p:v<0?ng:"#8892b0";

/* ══════════════════════════════════════════════════════════════
   EXPORT UTILS
══════════════════════════════════════════════════════════════ */
function exportCSV(transactions) {
  const h = ["Fecha","Período","Tipo","Categoría","Concepto","Monto (S/)","Nota"];
  const rows = transactions.map(t=>[t.date,t.period,t.type==="income"?"Ingreso":t.type==="cost"?"Costo":"Gasto",t.category,t.concept,t.amount,t.note||""]);
  const csv = [h,...rows].map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));
  const a = document.createElement("a"); a.href=url; a.download=`vCFO_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
}

function exportPnLCSV(data) {
  const rows = [
    ["Concepto","Monto (S/)","% Ingresos"],
    ["INGRESOS",data.income,"100%"],
    ["(-) Costo de ventas",data.cost,`${data.income>0?((data.cost/data.income)*100).toFixed(1):0}%`],
    ["= Utilidad Bruta",data.grossProfit,`${data.margenBruto.toFixed(1)}%`],
    ["(-) Gastos operativos",data.expense,`${data.income>0?((data.expense/data.income)*100).toFixed(1):0}%`],
    ["= EBITDA",data.ebitda,`${data.margenEbitda.toFixed(1)}%`],
    ["Punto de equilibrio",data.pe,""],
    ["Ticket promedio",data.avgTicket,""],
    ["Health Score",data.score+"/100",""],
  ];
  const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));
  const a = document.createElement("a"); a.href=url; a.download=`vCFO_PnL_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
}

function parseCSVUpload(text) {
  const lines = text.trim().split("\n"); if(lines.length<2) return [];
  const headers = lines[0].split(",").map(h=>h.replace(/"/g,"").trim().toLowerCase());
  const typeMap = {ingreso:"income",costo:"cost",gasto:"expense",income:"income",cost:"cost",expense:"expense"};
  return lines.slice(1).map(line=>{
    const vals = line.split(",").map(v=>v.replace(/"/g,"").trim());
    const obj = {}; headers.forEach((h,i)=>obj[h]=vals[i]||"");
    const type = typeMap[(obj.tipo||obj.type||"ingreso").toLowerCase()]||"income";
    return { id:Date.now()+Math.random(), date:obj.fecha||obj.date||new Date().toISOString().slice(0,10), period:obj.período||obj.period||"monthly", type, category:obj.categoría||obj.categoria||obj.category||CATS[type][0], concept:obj.concepto||obj.concept||"Sin concepto", amount:parseFloat(obj.monto||obj.amount||0), note:obj.nota||obj.note||"" };
  }).filter(t=>t.amount>0);
}

function downloadTemplate() {
  const csv = `"fecha","período","tipo","categoría","concepto","monto","nota"\n"${new Date().toISOString().slice(0,10)}","monthly","Ingreso","Ventas productos","Venta enero",5000,""\n"${new Date().toISOString().slice(0,10)}","monthly","Costo","Materia prima","Compra insumos",2000,"Proveedor X"\n"${new Date().toISOString().slice(0,10)}","monthly","Gasto","Marketing y publicidad","Publicidad digital",500,""`;
  const url = URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));
  const a = document.createElement("a"); a.href=url; a.download="plantilla_vCFO.csv"; a.click(); URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════
   SVG CHARTS
══════════════════════════════════════════════════════════════ */
function BarChart({data,height=160,color="#00e5a0",color2=null}) {
  if(!data||data.length===0) return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:"#3a4460",fontSize:12}}>Sin datos suficientes</div>;
  const allVals=[...data.map(d=>d.value),...(data.map(d=>d.value2||0))];
  const max=Math.max(...allVals,1);
  const bw=100/data.length;
  const ch=height-32;
  return(
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{display:"block"}}>
      {data.map((d,i)=>{
        const h1=(d.value/max)*ch;
        const h2=d.value2?(d.value2/max)*ch:0;
        return(
          <g key={i}>
            {color2&&h2>0&&<rect x={i*bw+1} y={height-32-h2} width={bw/2-1} height={h2} fill={color2} opacity={0.7} rx={1}/>}
            <rect x={color2?i*bw+bw/2:i*bw+1} y={height-32-h1} width={color2?bw/2-1:bw-2} height={h1} fill={color} opacity={0.85} rx={1}/>
            <text x={i*bw+bw/2} y={height-6} textAnchor="middle" fontSize={4.5} fill="#5a6480">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({data,data2,height=140}) {
  if(!data||data.length<2) return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:"#3a4460",fontSize:12}}>Sin datos suficientes</div>;
  const all=[...data.map(d=>d.value),...(data2||[]).map(d=>d.value)];
  const max=Math.max(...all,1),min=0;
  const W=100,H=height,pad=12,cW=W-pad*2,cH=H-pad*2;
  const pt=(d,i,arr)=>`${pad+(i/(arr.length-1))*cW},${pad+cH-((d.value-min)/(max-min))*cH}`;
  return(
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:"block"}}>
      <polyline points={data.map((d,i)=>pt(d,i,data)).join(" ")} fill="none" stroke="#00e5a0" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
      {data2&&<polyline points={data2.map((d,i)=>pt(d,i,data2)).join(" ")} fill="none" stroke="#f5a623" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3,2"/>}
      {data.map((d,i)=>{ const [x,y]=pt(d,i,data).split(","); return(<g key={i}><circle cx={x} cy={y} r={1.5} fill="#00e5a0"/><text x={x} y={H-3} textAnchor="middle" fontSize={4.5} fill="#5a6480">{d.label}</text></g>); })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCORE RING
══════════════════════════════════════════════════════════════ */
function ScoreRing({score}) {
  const color=score>=70?"#00e5a0":score>=45?"#f5a623":"#ff4757";
  const label=score>=70?"SALUDABLE":score>=45?"EN RIESGO":"CRÍTICO";
  const r=46,circ=2*Math.PI*r,dash=(score/100)*circ;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={108} height={108} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#1a1f2e" strokeWidth={8}/>
        <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 55 55)" style={{transition:"stroke-dasharray 1s ease"}}/>
        <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={22} fontWeight={800} fontFamily="'DM Mono',monospace">{score}</text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fill="#5a6480" fontSize={7} fontWeight={700} fontFamily="sans-serif" letterSpacing={2}>{label}</text>
      </svg>
      <span style={{color:"#5a6480",fontSize:9,letterSpacing:2,fontWeight:700}}>HEALTH SCORE</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING
══════════════════════════════════════════════════════════════ */
function Landing({onStart}) {
  const RED="#dc2626";
  return(
    <div style={{minHeight:"100vh",background:"#000",fontFamily:"'Space Grotesk',sans-serif",color:"#fff"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}`}</style>
      <nav style={{padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:RED,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📊</div>
          <span style={{fontWeight:800,fontSize:17}}>Franco García<span style={{color:RED}}> · CFO</span></span>
        </div>
        <button onClick={onStart} style={{padding:"9px 22px",background:RED,border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Prueba gratis →</button>
      </nav>

      <div style={{maxWidth:900,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}>
        <div style={{fontSize:11,color:RED,fontWeight:700,letterSpacing:3,marginBottom:16}}>FRANCO GARCÍA · CONSULTOR FINANCIERO</div>
        <h1 style={{fontSize:"clamp(32px,7vw,62px)",fontWeight:800,lineHeight:1.1,letterSpacing:-2,margin:"0 0 24px"}}>
          Tu <span style={{color:RED}}>CFO Senior</span><br/>sin contratar uno
        </h1>
        <p style={{color:"#888",fontSize:"clamp(14px,2vw,18px)",maxWidth:520,margin:"0 auto 40px",lineHeight:1.7}}>
          IA que registra tus finanzas, analiza tu P&L, genera proyecciones y te dice exactamente qué hacer — como un CFO con 15 años de experiencia.
        </p>
        <button onClick={onStart} style={{padding:"18px 44px",background:RED,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:17,cursor:"pointer",fontFamily:"inherit",marginBottom:12,boxShadow:`0 0 40px rgba(220,38,38,.3)`}}>
          🚀 Comenzar prueba gratuita
        </button>
        <p style={{color:"#444",fontSize:12,marginBottom:60}}>Sin tarjeta · 1 análisis completo · Datos 100% privados</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:48}}>
          {[
            {ic:"📥",t:"Registro diario/semanal/mensual",d:"Ingresa cada transacción por concepto"},
            {ic:"📊",t:"Dashboard completo",d:"Ventas, KPIs, tickets, visitantes, ocupación"},
            {ic:"📈",t:"Rolling Forecast",d:"Proyección 5-7% con ajuste trimestral automático"},
            {ic:"🔬",t:"Simulador P&L",d:"Simula cambios en líneas del estado de resultados"},
            {ic:"📤",t:"Exporta PDF y Excel",d:"Informes listos para presentar o analizar"},
            {ic:"🤖",t:"CFO AI Chat",d:"Pregunta y obtén análisis estratégico en segundos"},
          ].map((f,i)=>(
            <div key={i} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:"18px 16px",textAlign:"left"}}>
              <div style={{fontSize:22,marginBottom:8}}>{f.ic}</div>
              <div style={{fontWeight:700,color:"#fff",fontSize:13,marginBottom:5}}>{f.t}</div>
              <div style={{color:"#555",fontSize:11,lineHeight:1.5}}>{f.d}</div>
            </div>
          ))}
        </div>

        {/* Bio card */}
        <div style={{maxWidth:680,width:"100%",background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:16,padding:"28px 32px",display:"flex",gap:24,alignItems:"flex-start",textAlign:"left",marginBottom:24}}>
          <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><img src="/franco.jpg" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/></div>
          <div>
            <div style={{fontSize:10,color:RED,fontWeight:700,letterSpacing:2.5,marginBottom:6}}>QUIÉN SOY</div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}}>Franco García</div>
            <div style={{fontSize:12,color:"#888",marginBottom:12,lineHeight:1.6}}>
              Administrador de Empresas · MBA por la UNI · Más de 8 años en el rubro financiero y de gestión empresarial. He sido Gerente en empresas importantes del país, liderando áreas de finanzas, planeamiento estratégico y control de gestión.
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["🎓 MBA — UNI","📊 +8 años de experiencia","🏢 Gerente en empresas líderes","💼 Administrador de Empresas"].map((b,i)=>(
                <span key={i} style={{padding:"4px 12px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:20,fontSize:11,color:"#888",fontWeight:600}}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:480,padding:"20px 28px",background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,display:"inline-block"}}>
          <p style={{color:"#777",fontSize:13,lineHeight:1.7,margin:0,fontStyle:"italic"}}>
            "Un consultor financiero senior cobra entre S/ 10,000 y S/ 30,000 al mes.<br/>
            <strong style={{color:RED}}>Con Franco García · Consultor Financiero tienes ese mismo nivel de análisis disponible 24/7."</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════════════════════ */
function Register({onSuccess}) {
  const[f,setF]=useState({nombre:"",email:"",telefono:"",empresa:""});
  const[err,setErr]=useState(""),[loading,setLoading]=useState(false);
  const ch=e=>setF(p=>({...p,[e.target.name]:e.target.value}));
  function submit(){
    if(!f.nombre.trim()){setErr("Ingresa tu nombre");return;}
    if(!f.email.includes("@")){setErr("Email inválido");return;}
    if(f.telefono.replace(/\D/g,"").length<9){setErr("Teléfono inválido");return;}
    setLoading(true);
    setTimeout(()=>{ localStorage.setItem(SK.user,JSON.stringify({...f,at:Date.now()})); localStorage.setItem(SK.trial,"false"); onSuccess(f); },700);
  }
  const RED="#dc2626";
  return(
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Space Grotesk',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:46,height:46,background:RED,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 14px"}}>📊</div>
          <h2 style={{margin:"0 0 6px",fontWeight:800,fontSize:22,color:"#fff"}}>Activa tu prueba gratuita</h2>
          <p style={{color:"#555",fontSize:13,margin:0}}>1 análisis financiero completo · Sin costo</p>
        </div>
        <div style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:14,padding:"26px 22px"}}>
          {[["nombre","NOMBRE COMPLETO","Juan García"],["email","CORREO ELECTRÓNICO","juan@empresa.com","email"],["telefono","TELÉFONO / WHATSAPP","+51 999 999 999","tel"],["empresa","EMPRESA (opcional)","Distribuidora López SAC"]].map(([n,l,p,t])=>(
            <div key={n} style={{marginBottom:13}}>
              <label style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5}}>{l}</label>
              <input name={n} type={t||"text"} placeholder={p} value={f[n]} onChange={ch} style={{width:"100%",background:"#111",border:"1px solid #222",borderRadius:8,padding:"11px 13px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}
          {err&&<p style={{color:RED,fontSize:12,margin:"0 0 10px",textAlign:"center"}}>{err}</p>}
          <button onClick={submit} disabled={loading} style={{width:"100%",padding:13,background:RED,border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
            {loading?"Activando...":"🚀 Activar análisis gratuito"}
          </button>
          <p style={{color:"#333",fontSize:11,textAlign:"center",marginTop:12,lineHeight:1.6}}>Tus datos son privados y no se comparten con terceros.</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRIAL EXPIRED
══════════════════════════════════════════════════════════════ */
function TrialExpired() {
  return(
    <div style={{minHeight:"100vh",background:"#070a10",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Space Grotesk',sans-serif",color:"#e2e8f0"}}>
      <div style={{maxWidth:460,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:14}}>🔒</div>
        <h2 style={{fontWeight:800,fontSize:22,margin:"0 0 10px",color:"#fff"}}>Prueba gratuita utilizada</h2>
        <p style={{color:"#5a6480",fontSize:13,lineHeight:1.7,marginBottom:28}}>Viste el poder de tener un CFO Senior en tu negocio.<br/>Activa tu plan para acceso ilimitado.</p>
        <div style={{background:"#0d1117",border:"1px solid #161d2e",borderRadius:14,padding:26,marginBottom:20}}>
          <div style={{fontSize:10,color:"#00e5a0",fontWeight:700,letterSpacing:2,marginBottom:8}}>PLAN MENSUAL</div>
          <div style={{fontSize:34,fontWeight:800,color:"#fff",marginBottom:4}}>S/ 800<span style={{fontSize:15,color:"#5a6480",fontWeight:400}}>/mes</span></div>
          {["Registro ilimitado de transacciones","Dashboard + exportes PDF y Excel","Rolling forecast trimestral","Simulador P&L completo","Chat CFO sin límites","1 sesión de revisión por videollamada"].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,textAlign:"left"}}>
              <span style={{color:"#00e5a0"}}>✓</span><span style={{color:"#8892b0",fontSize:12}}>{f}</span>
            </div>
          ))}
          <a href="mailto:contacto@vcfo.ai?subject=Quiero activar Franco García · Consultor Financiero" style={{display:"block",marginTop:18,padding:13,background:"linear-gradient(135deg,#00e5a0,#0070ff)",borderRadius:10,color:"#000",fontWeight:800,fontSize:14,textDecoration:"none"}}>
            Activar plan completo →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const[screen,setScreen]=useState("landing");
  const[user,setUser]=useState(null);
  const[trialUsed,setTrialUsed]=useState(false);
  const[tab,setTab]=useState("entrada");
  const[appData,setAppData]=useState(getData());
  const[rlMsg,setRlMsg]=useState("");

  // ── Auth init
  useEffect(()=>{
    try{
      const u=localStorage.getItem(SK.user);
      const t=localStorage.getItem(SK.trial);
      if(u){ setUser(JSON.parse(u)); setTrialUsed(t==="true"); setScreen(t==="true"?"expired":"app"); }
    }catch{}
  },[]);

  const persist = d => { setAppData(d); saveData(d); };

  // ── Period & filter state
  const[viewPeriod,setViewPeriod]=useState("month"); // day|week|month|year
  const[viewYear,setViewYear]=useState(CY);
  const[viewMonth,setViewMonth]=useState(new Date().getMonth());

  // ── Derived KPIs
  const filteredTxns = useMemo(()=>{
    if(viewPeriod==="year") return filterTxns(appData.transactions,{year:viewYear});
    if(viewPeriod==="month") return filterTxns(appData.transactions,{year:viewYear,month:viewMonth});
    if(viewPeriod==="week"){
      const now=new Date(); const dayOfWeek=now.getDay();
      const monday=new Date(now); monday.setDate(now.getDate()-(dayOfWeek===0?6:dayOfWeek-1));
      return appData.transactions.filter(t=>{ const d=new Date(t.date); return d>=monday&&d<=now; });
    }
    if(viewPeriod==="day"){ const today=new Date().toISOString().slice(0,10); return appData.transactions.filter(t=>t.date===today); }
    return appData.transactions;
  },[appData.transactions,viewPeriod,viewYear,viewMonth]);

  const kpis = useMemo(()=>calcFromTxns(filteredTxns),[filteredTxns]);
  const monthlyData = useMemo(()=>MONTHS.map((_,i)=>calcFromTxns(filterTxns(appData.transactions,{year:viewYear,month:i}))),[appData.transactions,viewYear]);
  const forecast = useMemo(()=>calcForecast(appData.historical,appData.settings.growthRate),[appData.historical,appData.settings.growthRate]);

  // ── Conversemos state
  const[messages,setMessages]=useState([]);
  const[chatInput,setChatInput]=useState("");
  const[chatLoading,setChatLoading]=useState(false);
  const chatRef=useRef(null);
  useEffect(()=>{chatRef.current?.scrollTo(0,chatRef.current.scrollHeight);},[messages]);

  async function callCFO(userMsg,history=[]) {
    const isTrial=!trialUsed;
    if(!isTrial){const{ok,rem}=checkRL(); if(!ok){setRlMsg("Límite de 10 consultas/hora alcanzado."); throw new Error("rl");} if(rem<=2)setRlMsg(`Te quedan ${rem} consultas esta hora.`); else setRlMsg("");}
    const ctx=`Período: ${viewPeriod} | Ingresos: ${fmt(kpis.income)} | Costos: ${fmt(kpis.cost)} | Gastos: ${fmt(kpis.expense)}\nUtilidad Bruta: ${fmt(kpis.grossProfit)} (${kpis.margenBruto.toFixed(1)}%)\nEBITDA: ${fmt(kpis.ebitda)} (${kpis.margenEbitda.toFixed(1)}%) | Score: ${kpis.score}/100\nPunto equilibrio: ${fmt(kpis.pe)} | Ticket promedio: ${fmt(kpis.avgTicket)}\nTransacciones: ${kpis.countIncome} | Ratio costos: ${kpis.costoRatio.toFixed(1)}%\nTasa crecimiento proyectada: ${appData.settings.growthRate}%`;
    const sys=CFO_PROMPT.replace("{CONTEXT}",ctx);
    const res=await fetch("/api/cfo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...history,{role:"user",content:userMsg}]})});
    const data=await res.json();
    return data.content?.map(b=>b.text||"").join("")||"Error.";
  }

  async function sendChat() {
    if(!chatInput.trim()||chatLoading) return;
    const msg=chatInput.trim(); setChatInput("");
    setMessages(p=>[...p,{role:"user",content:msg}]); setChatLoading(true);
    try{
      const text=await callCFO(msg,messages.map(m=>({role:m.role,content:m.content})));
      setMessages(p=>[...p,{role:"assistant",content:text}]);
      if(!trialUsed){localStorage.setItem(SK.trial,"true");setTrialUsed(true);}
    }catch(e){if(e.message!=="rl")setMessages(p=>[...p,{role:"assistant",content:"Error de conexión."}]);}
    setChatLoading(false);
  }

  async function runCFODiagnosis() {
    setChatLoading(true);
    try{
      const text=await callCFO(`Realiza un diagnóstico financiero completo del período ${viewPeriod}. Sé directo y crítico. Identifica el problema más urgente. Usa señales visuales 🔴🟡🟢⚡💡.`);
      setMessages([{role:"assistant",content:text}]);
      if(!trialUsed){localStorage.setItem(SK.trial,"true");setTrialUsed(true);}
    }catch{}
    setChatLoading(false); setTab("cfo");
  }

  // ── Simulator state
  const[simLines,setSimLines]=useState({income:0,cost:0,expense:0});
  const simResult = useMemo(()=>{
    const ni=kpis.income*(1+simLines.income/100);
    const nc=kpis.cost*(1+simLines.cost/100);
    const ne=kpis.expense*(1+simLines.expense/100);
    const ngp=ni-nc; const nebitda=ngp-ne;
    return{income:ni,cost:nc,expense:ne,grossProfit:ngp,ebitda:nebitda,margenBruto:ni>0?(ngp/ni)*100:0,margenEbitda:ni>0?(nebitda/ni)*100:0,deltaEbitda:nebitda-kpis.ebitda};
  },[kpis,simLines]);

  // ── Add transaction
  const[txnForm,setTxnForm]=useState({date:new Date().toISOString().slice(0,10),period:"monthly",type:"income",category:CATS.income[0],concept:"",amount:"",note:""});
  const[txnErr,setTxnErr]=useState("");
  function addTxn(){
    if(!txnForm.concept.trim()||!txnForm.amount){setTxnErr("Completa concepto y monto");return;}
    const newTxn={...txnForm,id:Date.now(),amount:parseFloat(txnForm.amount)};
    const d={...appData,transactions:[...appData.transactions,newTxn]};
    persist(d); setTxnErr(""); setTxnForm(p=>({...p,concept:"",amount:"",note:""}));
  }
  function deleteTxn(id){persist({...appData,transactions:appData.transactions.filter(t=>t.id!==id)});}

  // ── Historical form
  const[histForm,setHistForm]=useState({year:CY-1,month:0,income:"",cost:"",expense:""});
  function addHistorical(){
    if(!histForm.income){return;}
    const h={year:+histForm.year,month:+histForm.month,income:+histForm.income,cost:+histForm.cost||0,expense:+histForm.expense||0};
    const existing=appData.historical.filter(x=>!(x.year===h.year&&x.month===h.month));
    persist({...appData,historical:[...existing,h]});
    setHistForm(p=>({...p,income:"",cost:"",expense:""}));
  }

  // ── Rolling forecast update
  function updateRollingForecast(){
    const newRate=rollingAdjust(appData.transactions,forecast,appData.settings.growthRate);
    persist({...appData,settings:{...appData.settings,growthRate:newRate,lastForecastQ:new Date().toISOString().slice(0,7)}});
  }

  // ── Upload
  function handleFileUpload(e){
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const txns=parseCSVUpload(ev.target.result);
      if(txns.length>0){persist({...appData,transactions:[...appData.transactions,...txns]}); alert(`✅ ${txns.length} transacciones importadas correctamente`);}
      else alert("⚠️ No se encontraron datos válidos. Verifica el formato del archivo.");
    };
    reader.readAsText(file,"utf-8"); e.target.value="";
  }

  // ── Visitors/Occupancy
  const[voForm,setVoForm]=useState({date:new Date().toISOString().slice(0,10),visitors:"",occupancy:""});
  function addVO(){
    const d={...appData};
    if(voForm.visitors) d.visitors=[...appData.visitors.filter(v=>v.date!==voForm.date),{date:voForm.date,count:+voForm.visitors}];
    if(voForm.occupancy) d.occupancy=[...appData.occupancy.filter(v=>v.date!==voForm.date),{date:voForm.date,pct:+voForm.occupancy}];
    persist(d); setVoForm(p=>({...p,visitors:"",occupancy:""}));
  }
  const avgVisitors=useMemo(()=>{ const v=appData.visitors.filter(x=>new Date(x.date).getMonth()===viewMonth&&new Date(x.date).getFullYear()===viewYear); return v.length>0?v.reduce((s,x)=>s+x.count,0)/v.length:0; },[appData.visitors,viewMonth,viewYear]);
  const avgOccupancy=useMemo(()=>{ const o=appData.occupancy.filter(x=>new Date(x.date).getMonth()===viewMonth&&new Date(x.date).getFullYear()===viewYear); return o.length>0?o.reduce((s,x)=>s+x.pct,0)/o.length:0; },[appData.occupancy,viewMonth,viewYear]);

  // ── STYLES
  const S={
    card:{background:"#0d1117",border:"1px solid #161d2e",borderRadius:12,padding:18},
    cardT:{fontSize:10,fontWeight:700,letterSpacing:2.5,color:"#4a5568",marginBottom:14,display:"flex",alignItems:"center",gap:6},
    label:{fontSize:10,color:"#4a5568",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5},
    inp:{width:"100%",background:"#10151f",border:"1px solid #1a2236",borderRadius:7,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"},
    sel:{width:"100%",background:"#10151f",border:"1px solid #1a2236",borderRadius:7,padding:"9px 12px",color:"#e2e8f0",fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"},
    btn:{padding:"10px 20px",background:"linear-gradient(135deg,#00e5a0,#0070ff)",border:"none",borderRadius:9,color:"#000",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"},
    btnSm:{padding:"6px 14px",background:"#1a2236",border:"1px solid #252d42",borderRadius:7,color:"#8892b0",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit"},
    kpiCard:(c)=>({background:"#0d1117",border:"1px solid #161d2e",borderRadius:10,padding:"13px 14px",borderLeft:`3px solid ${c}`}),
    kpiL:{fontSize:9,letterSpacing:2.5,color:"#4a5568",fontWeight:700,marginBottom:5},
    kpiV:(c)=>({fontSize:18,fontWeight:800,color:c,fontFamily:"'DM Mono',monospace",marginBottom:2}),
    kpiS:{fontSize:10,color:"#4a5568"},
    tabBtn:(a)=>({padding:"8px 16px",border:"none",background:a?"#1a2236":"transparent",color:a?"#00e5a0":"#4a5568",fontWeight:700,fontSize:11,cursor:"pointer",letterSpacing:1,borderRadius:6,fontFamily:"inherit",whiteSpace:"nowrap"}),
    msgU:{alignSelf:"flex-end",background:"#1a2236",borderRadius:"12px 12px 3px 12px",padding:"10px 14px",maxWidth:"85%",fontSize:13,lineHeight:1.6},
    msgB:{alignSelf:"flex-start",background:"#0d1117",border:"1px solid #161d2e",borderRadius:"3px 12px 12px 12px",padding:"12px 15px",maxWidth:"90%",fontSize:13,lineHeight:1.75,whiteSpace:"pre-wrap"},
  };

  if(screen==="landing") return <Landing onStart={()=>setScreen("register")}/>;
  if(screen==="register") return <Register onSuccess={u=>{setUser(u);setScreen("app");}}/>;
  if(screen==="expired") return <TrialExpired/>;

  const periodLabel=viewPeriod==="day"?"Hoy":viewPeriod==="week"?"Esta semana":viewPeriod==="month"?`${MONTHS[viewMonth]} ${viewYear}`:viewPeriod==="year"?`Año ${viewYear}`:"";

  return(
    <div style={{minHeight:"100vh",background:"#070a10",color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;} input:focus,select:focus,textarea:focus{border-color:#00e5a0!important;outline:none!important;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1a2236;border-radius:4px}
        .hov:hover{opacity:.8!important} .tbhov:hover{color:#00e5a0!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .fu{animation:fadeUp .3s ease} .pulse{animation:pulse 1.4s infinite}
        @media print{.no-print{display:none!important}.print-only{display:block!important}}
        .print-only{display:none}
        @media(max-width:640px){.mob-hide{display:none!important}.tab-scroll{overflow-x:auto;}}
      `}</style>

      {/* ── HEADER */}
      <header className="no-print" style={{borderBottom:"1px solid #141a2a",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0d17",position:"sticky",top:0,zIndex:100,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#00e5a0,#0070ff)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>📊</div>
          <span style={{fontWeight:800,fontSize:15,color:"#fff"}}>Franco García<span style={{color:"#dc2626"}}> · CFO</span></span>
        </div>
        {user&&<span className="mob-hide" style={{fontSize:11,color:"#4a5568"}}>{user.nombre} {trialUsed&&<span style={{color:"#ff4757",fontWeight:700}}>· PRUEBA USADA</span>}</span>}
      </header>

      {/* ── TABS */}
      <div className="no-print tab-scroll" style={{background:"#0a0d17",borderBottom:"1px solid #141a2a",display:"flex",gap:2,padding:"6px 12px",overflowX:"auto"}}>
        {[["entrada","📥 Entrada"],["dashboard","📊 Dashboard"],["forecast","📈 Forecast"],["simulador","🔬 Simulador"],["cfo","💬 Conversemos"],["reportes","📤 Reportes"]].map(([k,l])=>(
          <button key={k} className="tbhov" style={S.tabBtn(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {rlMsg&&<div style={{background:"rgba(245,166,35,.08)",borderBottom:"1px solid rgba(245,166,35,.15)",padding:"7px 16px",fontSize:12,color:"#f5a623",textAlign:"center"}}>⏱ {rlMsg}</div>}

      {/* ── PERIOD SELECTOR */}
      <div className="no-print" style={{background:"#0d1117",borderBottom:"1px solid #161d2e",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:"#4a5568",fontWeight:700,letterSpacing:1.5}}>PERÍODO:</span>
        {["day","week","month","year"].map(p=>(
          <button key={p} style={{...S.btnSm,background:viewPeriod===p?"#252d42":"#1a2236",color:viewPeriod===p?"#00e5a0":"#5a6480"}} onClick={()=>setViewPeriod(p)}>
            {p==="day"?"Diario":p==="week"?"Semanal":p==="month"?"Mensual":"Anual"}
          </button>
        ))}
        {(viewPeriod==="month"||viewPeriod==="year")&&(
          <select value={viewYear} onChange={e=>setViewYear(+e.target.value)} style={{...S.sel,width:80,marginBottom:0}}>
            {[CY-2,CY-1,CY,CY+1].map(y=><option key={y}>{y}</option>)}
          </select>
        )}
        {viewPeriod==="month"&&(
          <select value={viewMonth} onChange={e=>setViewMonth(+e.target.value)} style={{...S.sel,width:90,marginBottom:0}}>
            {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </select>
        )}
        <span style={{fontSize:11,color:"#00e5a0",fontWeight:700,marginLeft:"auto"}}>{periodLabel}</span>
      </div>

      <main style={{flex:1,padding:"16px",maxWidth:1120,margin:"0 auto",width:"100%"}}>

        {/* ══════════ ENTRADA DE DATOS ══════════ */}
        {tab==="entrada"&&(
          <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>

            {/* Upload masivo */}
            <div style={S.card}>
              <div style={S.cardT}><span>📤</span> CARGA MASIVA (CSV / EXCEL)</div>
              <p style={{color:"#5a6480",fontSize:12,lineHeight:1.6,marginBottom:12}}>Sube un archivo CSV con tus transacciones. El agente las clasifica automáticamente.</p>
              <button className="hov" style={{...S.btn,width:"100%",marginBottom:8}} onClick={()=>document.getElementById("fileup").click()}>
                📁 Seleccionar archivo
              </button>
              <input id="fileup" type="file" accept=".csv,.xlsx,.xls" style={{display:"none"}} onChange={handleFileUpload}/>
              <button className="hov" style={{...S.btnSm,width:"100%"}} onClick={downloadTemplate}>⬇ Descargar plantilla CSV</button>
              <div style={{marginTop:14,padding:"10px 12px",background:"rgba(0,229,160,.05)",border:"1px solid rgba(0,229,160,.1)",borderRadius:8,fontSize:11,color:"#5a6480",lineHeight:1.6}}>
                <strong style={{color:"#8892b0"}}>Columnas requeridas:</strong><br/>
                fecha | período | tipo (Ingreso/Costo/Gasto) | categoría | concepto | monto | nota
              </div>
            </div>

            {/* Registro manual */}
            <div style={S.card}>
              <div style={S.cardT}><span>➕</span> REGISTRAR TRANSACCIÓN</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={S.label}>FECHA</label><input type="date" style={S.inp} value={txnForm.date} onChange={e=>setTxnForm(p=>({...p,date:e.target.value}))}/></div>
                <div><label style={S.label}>PERÍODO</label>
                  <select style={S.sel} value={txnForm.period} onChange={e=>setTxnForm(p=>({...p,period:e.target.value}))}>
                    <option value="daily">Diario</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={S.label}>TIPO</label>
                  <select style={S.sel} value={txnForm.type} onChange={e=>setTxnForm(p=>({...p,type:e.target.value,category:CATS[e.target.value][0]}))}>
                    <option value="income">💰 Ingreso</option><option value="cost">🔧 Costo</option><option value="expense">📋 Gasto</option>
                  </select>
                </div>
                <div><label style={S.label}>CATEGORÍA</label>
                  <select style={S.sel} value={txnForm.category} onChange={e=>setTxnForm(p=>({...p,category:e.target.value}))}>
                    {CATS[txnForm.type].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label style={S.label}>CONCEPTO</label>
              <input style={{...S.inp,marginBottom:8}} placeholder="Describe el ingreso/costo/gasto" value={txnForm.concept} onChange={e=>setTxnForm(p=>({...p,concept:e.target.value}))}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={S.label}>MONTO (S/)</label><input type="number" style={S.inp} placeholder="0" value={txnForm.amount} onChange={e=>setTxnForm(p=>({...p,amount:e.target.value}))}/></div>
                <div><label style={S.label}>NOTA</label><input style={S.inp} placeholder="Opcional" value={txnForm.note} onChange={e=>setTxnForm(p=>({...p,note:e.target.value}))}/></div>
              </div>
              {txnErr&&<p style={{color:"#ff4757",fontSize:11,marginBottom:8}}>{txnErr}</p>}
              <button className="hov" style={{...S.btn,width:"100%"}} onClick={addTxn}>➕ Registrar</button>
            </div>

            {/* Visitantes y ocupación */}
            <div style={S.card}>
              <div style={S.cardT}><span>👥</span> VISITANTES Y OCUPACIÓN</div>
              <label style={S.label}>FECHA</label>
              <input type="date" style={{...S.inp,marginBottom:8}} value={voForm.date} onChange={e=>setVoForm(p=>({...p,date:e.target.value}))}/>
              <label style={S.label}>N° VISITANTES</label>
              <input type="number" style={{...S.inp,marginBottom:8}} placeholder="0" value={voForm.visitors} onChange={e=>setVoForm(p=>({...p,visitors:e.target.value}))}/>
              <label style={S.label}>OCUPACIÓN (%)</label>
              <input type="number" style={{...S.inp,marginBottom:12}} placeholder="0-100" min={0} max={100} value={voForm.occupancy} onChange={e=>setVoForm(p=>({...p,occupancy:e.target.value}))}/>
              <button className="hov" style={{...S.btn,width:"100%"}} onClick={addVO}>Guardar</button>
            </div>

            {/* Últimas transacciones */}
            <div style={{...S.card,gridColumn:"1/-1"}}>
              <div style={{...S.cardT,marginBottom:12}}>
                <span>📋</span> ÚLTIMAS TRANSACCIONES
                <button className="hov" style={{...S.btnSm,marginLeft:"auto"}} onClick={()=>exportCSV(appData.transactions)}>⬇ Exportar CSV</button>
              </div>
              {filteredTxns.length===0&&<p style={{color:"#4a5568",fontSize:13,textAlign:"center",padding:"20px 0"}}>Sin transacciones en este período.<br/>Agrega la primera arriba.</p>}
              <div style={{maxHeight:320,overflowY:"auto"}}>
                {[...filteredTxns].reverse().slice(0,50).map(t=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #0d1117",flexWrap:"wrap"}}>
                    <span style={{fontSize:10,color:"#3a4460",flexShrink:0,width:80}}>{t.date}</span>
                    <span style={{fontSize:11,color:t.type==="income"?"#00e5a0":t.type==="cost"?"#ff4757":"#f5a623",fontWeight:700,width:50,flexShrink:0}}>{t.type==="income"?"↑ ING":t.type==="cost"?"↓ CST":"↓ GST"}</span>
                    <span style={{fontSize:11,color:"#5a6480",flex:1,minWidth:100}}>{t.category}</span>
                    <span style={{fontSize:12,color:"#c8d4e0",flex:2,minWidth:120}}>{t.concept}</span>
                    <span style={{fontSize:13,fontWeight:800,color:t.type==="income"?"#00e5a0":"#ff4757",fontFamily:"'DM Mono',monospace",flexShrink:0}}>{fmt(t.amount)}</span>
                    <button onClick={()=>deleteTxn(t.id)} style={{background:"none",border:"none",color:"#3a4460",cursor:"pointer",fontSize:14,flexShrink:0}}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ DASHBOARD ══════════ */}
        {tab==="dashboard"&&(
          <div className="fu">
            {/* Top row */}
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:14,marginBottom:14,alignItems:"start"}}>
              <div style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",padding:20,minWidth:155}}>
                <ScoreRing score={kpis.score}/>
                <div style={{marginTop:10,textAlign:"center",fontSize:11,color:"#5a6480"}}>{periodLabel}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:9}}>
                {[
                  {l:"INGRESOS",v:fmt(kpis.income),c:"#e2e8f0"},
                  {l:"UTILIDAD BRUTA",v:fmt(kpis.grossProfit),c:kpis.margenBruto>30?"#00e5a0":kpis.margenBruto>15?"#f5a623":"#ff4757"},
                  {l:"EBITDA",v:fmt(kpis.ebitda),c:kpis.ebitda>0?"#00e5a0":"#ff4757"},
                  {l:"MARGEN BRUTO",v:`${kpis.margenBruto.toFixed(1)}%`,c:kpis.margenBruto>30?"#00e5a0":kpis.margenBruto>15?"#f5a623":"#ff4757"},
                  {l:"MARGEN EBITDA",v:`${kpis.margenEbitda.toFixed(1)}%`,c:kpis.ebitda>0?"#00e5a0":"#ff4757"},
                  {l:"PUNTO EQUILIBRIO",v:fmt(kpis.pe),c:"#8892b0"},
                  {l:"TRANSACCIONES",v:fmtN(kpis.countIncome),c:"#8892b0"},
                  {l:"TICKET PROMEDIO",v:fmt(kpis.avgTicket),c:"#8892b0"},
                  {l:"VISITANTES PROM.",v:avgVisitors>0?fmtN(avgVisitors):"—",c:"#8892b0"},
                  {l:"OCUPACIÓN PROM.",v:avgOccupancy>0?`${avgOccupancy.toFixed(1)}%`:"—",c:avgOccupancy>70?"#00e5a0":avgOccupancy>40?"#f5a623":"#8892b0"},
                ].map((k,i)=>(
                  <div key={i} style={S.kpiCard(k.c)}>
                    <div style={S.kpiL}>{k.l}</div>
                    <div style={S.kpiV(k.c)}>{k.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
              <div style={S.card}>
                <div style={S.cardT}><span>📊</span> INGRESOS POR MES</div>
                <BarChart data={monthlyData.map((d,i)=>({label:MONTHS[i],value:d.income}))} color="#00e5a0"/>
              </div>
              <div style={S.card}>
                <div style={S.cardT}><span>📉</span> EBITDA POR MES</div>
                <BarChart data={monthlyData.map((d,i)=>({label:MONTHS[i],value:Math.max(0,d.ebitda),value2:Math.abs(Math.min(0,d.ebitda))}))} color="#00e5a0" color2="#ff4757"/>
              </div>
              <div style={S.card}>
                <div style={S.cardT}><span>📈</span> TENDENCIA INGRESOS</div>
                <LineChart data={monthlyData.map((d,i)=>({label:MONTHS[i],value:d.income}))} height={160}/>
              </div>
              <div style={S.card}>
                <div style={S.cardT}><span>🎯</span> MARGEN BRUTO % POR MES</div>
                <LineChart data={monthlyData.map((d,i)=>({label:MONTHS[i],value:d.margenBruto}))} height={160}/>
              </div>
            </div>

            {/* P&L Summary */}
            <div style={S.card}>
              <div style={{...S.cardT,marginBottom:12}}><span>📋</span> ESTADO DE RESULTADOS — {periodLabel}
                <button className="hov" style={{...S.btnSm,marginLeft:"auto"}} onClick={()=>exportPnLCSV(kpis)}>⬇ Excel</button>
                <button className="hov" style={S.btnSm} onClick={()=>window.print()}>🖨 PDF</button>
                <button className="hov" style={S.btn} onClick={runCFODiagnosis}>🧠 Diagnóstico CFO</button>
              </div>
              {[
                {l:"(+) INGRESOS",v:kpis.income,pct:100,bold:false,indent:false,color:"#e2e8f0"},
                {l:"(-) Costo de ventas",v:-kpis.cost,pct:kpis.income>0?-(kpis.cost/kpis.income)*100:0,bold:false,indent:true,color:"#ff4757"},
                {l:"= UTILIDAD BRUTA",v:kpis.grossProfit,pct:kpis.margenBruto,bold:true,color:kpis.margenBruto>30?"#00e5a0":"#f5a623"},
                {l:"(-) Gastos operativos",v:-kpis.expense,pct:kpis.income>0?-(kpis.expense/kpis.income)*100:0,bold:false,indent:true,color:"#f5a623"},
                {l:"= EBITDA",v:kpis.ebitda,pct:kpis.margenEbitda,bold:true,color:kpis.ebitda>0?"#00e5a0":"#ff4757"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${r.bold?"10px":"7px"} ${r.indent?"24px":"0px"}`,borderBottom:"1px solid #0d1117",background:r.bold?"rgba(255,255,255,.02)":"transparent",borderRadius:r.bold?6:0}}>
                  <span style={{fontSize:r.bold?13:12,fontWeight:r.bold?800:500,color:r.color||"#c8d4e0"}}>{r.l}</span>
                  <div style={{display:"flex",gap:24,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#4a5568"}}>{r.pct.toFixed(1)}%</span>
                    <span style={{fontSize:r.bold?15:13,fontWeight:r.bold?800:600,color:r.color||"#e2e8f0",fontFamily:"'DM Mono',monospace",width:100,textAlign:"right"}}>{fmt(r.v)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ FORECAST ══════════ */}
        {tab==="forecast"&&(
          <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>

            {/* Datos históricos */}
            <div style={S.card}>
              <div style={S.cardT}><span>🗂</span> DATOS AÑO ANTERIOR</div>
              <p style={{color:"#5a6480",fontSize:12,marginBottom:12,lineHeight:1.5}}>Ingresa datos del año pasado para generar el comparativo y la proyección.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div><label style={S.label}>AÑO</label><input type="number" style={S.inp} value={histForm.year} onChange={e=>setHistForm(p=>({...p,year:e.target.value}))}/></div>
                <div><label style={S.label}>MES</label>
                  <select style={S.sel} value={histForm.month} onChange={e=>setHistForm(p=>({...p,month:e.target.value}))}>
                    {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
                  </select>
                </div>
              </div>
              <label style={S.label}>INGRESOS (S/)</label>
              <input type="number" style={{...S.inp,marginBottom:8}} placeholder="0" value={histForm.income} onChange={e=>setHistForm(p=>({...p,income:e.target.value}))}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div><label style={S.label}>COSTOS (S/)</label><input type="number" style={S.inp} placeholder="0" value={histForm.cost} onChange={e=>setHistForm(p=>({...p,cost:e.target.value}))}/></div>
                <div><label style={S.label}>GASTOS (S/)</label><input type="number" style={S.inp} placeholder="0" value={histForm.expense} onChange={e=>setHistForm(p=>({...p,expense:e.target.value}))}/></div>
              </div>
              <button className="hov" style={{...S.btn,width:"100%"}} onClick={addHistorical}>Guardar mes histórico</button>
            </div>

            {/* Rolling Forecast */}
            <div style={S.card}>
              <div style={S.cardT}><span>🔄</span> ROLLING FORECAST</div>
              <div style={{marginBottom:16,padding:"12px 14px",background:"rgba(0,229,160,.05)",border:"1px solid rgba(0,229,160,.12)",borderRadius:8}}>
                <div style={{fontSize:10,color:"#4a5568",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>TASA DE CRECIMIENTO PROYECTADA</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="range" min={3} max={15} step={0.5} value={appData.settings.growthRate} style={{flex:1,accentColor:"#00e5a0",cursor:"pointer"}} onChange={e=>persist({...appData,settings:{...appData.settings,growthRate:+e.target.value}})}/>
                  <span style={{fontSize:22,fontWeight:800,color:"#00e5a0",fontFamily:"'DM Mono',monospace",minWidth:50}}>{appData.settings.growthRate}%</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#3a4460",marginTop:4}}><span>3%</span><span>15%</span></div>
              </div>
              <button className="hov" style={{...S.btn,width:"100%",marginBottom:10}} onClick={updateRollingForecast}>
                🔄 Ajustar forecast con datos actuales
              </button>
              {appData.settings.lastForecastQ&&<p style={{color:"#4a5568",fontSize:11,textAlign:"center"}}>Último ajuste: {appData.settings.lastForecastQ}</p>}
              <div style={{marginTop:10,fontSize:12,color:"#5a6480",lineHeight:1.6}}>
                El forecast se ajusta automáticamente cada trimestre comparando el desempeño real vs lo proyectado. Rango: 5% – 7% (base), expandible hasta 15%.
              </div>
            </div>

            {/* Tabla comparativa */}
            <div style={{...S.card,gridColumn:"1/-1"}}>
              <div style={{...S.cardT,marginBottom:12}}><span>📊</span> COMPARATIVO: ACTUAL vs AÑO ANTERIOR vs PROYECCIÓN
                <button className="hov" style={{...S.btnSm,marginLeft:"auto"}} onClick={()=>{
                  const rows=[["Mes","Año Ant. Ing.","Actual Ing.","Var%","Proyectado","Cumpl%"],...MONTHS.map((_,i)=>{
                    const h=appData.historical.find(x=>x.month===i&&x.year===viewYear-1);
                    const act=monthlyData[i].income;
                    const proj=forecast[i]?.projIncome||0;
                    const varPct=h?.income>0?((act-h.income)/h.income*100).toFixed(1):"—";
                    const cumpl=proj>0?(act/proj*100).toFixed(1):"—";
                    return [MONTHS[i],h?.income||0,act,varPct,proj,cumpl];
                  })];
                  const csv=rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
                  const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));
                  const a=document.createElement("a");a.href=url;a.download="forecast.csv";a.click();
                }}>⬇ Excel</button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr>{["MES","AÑO ANT.","ACTUAL","VARIACIÓN","PROYECTADO","CUMPL."].map(h=>(
                      <th key={h} style={{padding:"7px 10px",textAlign:"right",color:"#4a5568",fontSize:9,letterSpacing:1.5,fontWeight:700,borderBottom:"1px solid #161d2e"}}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {MONTHS.map((_,i)=>{
                      const h=appData.historical.find(x=>x.month===i&&x.year===viewYear-1);
                      const act=monthlyData[i].income;
                      const proj=forecast[i]?.projIncome||0;
                      const varPct=h?.income>0?((act-h.income)/h.income)*100:null;
                      const cumpl=proj>0?(act/proj)*100:null;
                      return(
                        <tr key={i} style={{background:i%2===0?"transparent":"rgba(255,255,255,.01)"}}>
                          <td style={{padding:"7px 10px",color:"#8892b0",fontWeight:600}}>{MONTHS[i]}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:"#5a6480",fontFamily:"'DM Mono',monospace"}}>{h?.income?fmt(h.income):"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:act>0?"#e2e8f0":"#3a4460",fontFamily:"'DM Mono',monospace"}}>{fmt(act)}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:varPct!=null?clr(varPct):"#3a4460",fontFamily:"'DM Mono',monospace"}}>{varPct!=null?pctStr(varPct):"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:"#f5a623",fontFamily:"'DM Mono',monospace"}}>{proj>0?fmt(proj):"—"}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:cumpl!=null?(cumpl>=100?"#00e5a0":cumpl>=80?"#f5a623":"#ff4757"):"#3a4460",fontFamily:"'DM Mono',monospace"}}>{cumpl!=null?`${cumpl.toFixed(0)}%`:"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Chart */}
              <div style={{marginTop:14}}>
                <div style={{fontSize:10,color:"#4a5568",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>TENDENCIA — ACTUAL (verde) vs PROYECTADO (naranja)</div>
                <LineChart
                  data={monthlyData.map((d,i)=>({label:MONTHS[i],value:d.income}))}
                  data2={forecast.map((f,i)=>({label:MONTHS[i],value:f.projIncome||0}))}
                  height={160}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SIMULADOR P&L ══════════ */}
        {tab==="simulador"&&(
          <div className="fu" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={S.card}>
              <div style={S.cardT}><span>🎛️</span> AJUSTES EN LÍNEAS DEL P&L</div>
              <p style={{color:"#5a6480",fontSize:12,marginBottom:14,lineHeight:1.5}}>Simula cambios porcentuales en cada línea del estado de resultados para proyectar el impacto en EBITDA, márgenes y cierre de ventas.</p>
              {[
                {key:"income",label:"INGRESOS / VENTAS",icon:"💰",min:-50,max:100,color:"#00e5a0"},
                {key:"cost",label:"COSTO DE VENTAS",icon:"🔧",min:-40,max:50,color:"#f5a623"},
                {key:"expense",label:"GASTOS OPERATIVOS",icon:"📋",min:-40,max:50,color:"#f5a623"},
              ].map(({key,label,icon,min,max,color})=>{
                const v=simLines[key];
                const c=key==="income"?(v>0?"#00e5a0":v<0?"#ff4757":"#8892b0"):(v<0?"#00e5a0":v>0?"#ff4757":"#8892b0");
                return(
                  <div key={key} style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:10,letterSpacing:2,color:"#4a5568",fontWeight:700}}>{icon} {label}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:800,color:c}}>{v>0?"+":""}{v}%</span>
                    </div>
                    <input type="range" min={min} max={max} value={v} style={{width:"100%",accentColor:color,cursor:"pointer"}} onChange={e=>setSimLines(p=>({...p,[key]:+e.target.value}))}/>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#3a4460"}}><span>{min}%</span><span>{max}%</span></div>
                  </div>
                );
              })}
              <button className="hov" style={{...S.btnSm,width:"100%",marginTop:4}} onClick={()=>setSimLines({income:0,cost:0,expense:0})}>Resetear</button>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={S.card}>
                <div style={S.cardT}><span>📊</span> RESULTADO PROYECTADO</div>
                {[
                  {l:"INGRESOS",base:kpis.income,proj:simResult.income},
                  {l:"(-) Costo de ventas",base:-kpis.cost,proj:-simResult.cost},
                  {l:"= UTILIDAD BRUTA",base:kpis.grossProfit,proj:simResult.grossProfit,bold:true},
                  {l:"(-) Gastos operativos",base:-kpis.expense,proj:-simResult.expense},
                  {l:"= EBITDA",base:kpis.ebitda,proj:simResult.ebitda,bold:true},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #0d1117"}}>
                    <span style={{fontSize:r.bold?12:11,fontWeight:r.bold?800:500,color:"#8892b0"}}>{r.l}</span>
                    <div style={{display:"flex",gap:14,alignItems:"center"}}>
                      <span style={{fontSize:11,color:"#3a4460",fontFamily:"'DM Mono',monospace"}}>{fmt(r.base)}</span>
                      <span style={{fontSize:11,color:"#4a5568"}}>→</span>
                      <span style={{fontSize:r.bold?14:12,fontWeight:r.bold?800:600,color:r.bold?clr(r.proj):"#c8d4e0",fontFamily:"'DM Mono',monospace"}}>{fmt(r.proj)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={S.cardT}><span>🎯</span> IMPACTO EN EBITDA</div>
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:32,fontWeight:800,color:clr(simResult.deltaEbitda),fontFamily:"'DM Mono',monospace"}}>{simResult.deltaEbitda>=0?"+":""}{fmt(simResult.deltaEbitda)}</div>
                  <div style={{fontSize:12,color:"#5a6480",marginTop:6}}>vs EBITDA actual de {fmt(kpis.ebitda)}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[{l:"MARGEN BRUTO",v:`${simResult.margenBruto.toFixed(1)}%`,base:kpis.margenBruto},{l:"MARGEN EBITDA",v:`${simResult.margenEbitda.toFixed(1)}%`,base:kpis.margenEbitda}].map((k,i)=>(
                    <div key={i} style={{padding:"10px 12px",background:"#10151f",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#4a5568",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{k.l}</div>
                      <div style={{fontSize:16,fontWeight:800,fontFamily:"'DM Mono',monospace",color:clr(simResult.margenEbitda-kpis.margenEbitda)}}>{k.v}</div>
                      <div style={{fontSize:10,color:"#4a5568"}}>antes: {k.base.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
                <button className="hov" style={{...S.btn,width:"100%",marginTop:12}} onClick={()=>{ setChatInput(`Evalúa este escenario: Ventas ${simLines.income>0?"+":""}${simLines.income}% | Costos ${simLines.cost>0?"+":""}${simLines.cost}% | Gastos ${simLines.expense>0?"+":""}${simLines.expense}%. EBITDA pasa de ${fmt(kpis.ebitda)} a ${fmt(simResult.ebitda)}. ¿Es inteligente? ¿Riesgos?`); setTab("cfo"); }}>
                  🧠 Evaluar con CFO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CFO CHAT ══════════ */}
        {tab==="cfo"&&(
          <div className="fu" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 200px)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
              <div>
                <h2 style={{margin:0,fontWeight:800,fontSize:16}}><span style={{color:"#00e5a0"}}>Franco García</span> · Conversemos</h2>
                <p style={{margin:"3px 0 0",color:"#4a5568",fontSize:11}}>💬 Conversemos — Cuéntame cómo va tu negocio.</p>
              </div>
              <div style={S.kpiCard("#00e5a0")}><div style={S.kpiL}>HEALTH SCORE</div><div style={{...S.kpiV("#00e5a0"),fontSize:20}}>{kpis.score}</div></div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
              {["¿Estoy ganando dinero de verdad?","¿Cuál es mi mayor riesgo?","¿Puedo contratar más gente?","¿Qué hago este mes?","¿Cómo mejoro mi margen?","Analiza mi tendencia","¿Cuándo alcanzo el punto de equilibrio?"].map((q,i)=>(
                <button key={i} onClick={()=>setChatInput(q)} style={{padding:"5px 11px",background:"#0d1117",border:"1px solid #161d2e",borderRadius:20,color:"#5a6480",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                  {q}
                </button>
              ))}
            </div>
            <div ref={chatRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:8}}>
              {messages.length===0&&(
                <div style={{textAlign:"center",padding:"40px 20px",color:"#3a4460"}}>
                  <div style={{fontSize:32,marginBottom:12}}>🧠</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#5a6480"}}>¡Hola! Soy Franco García, tu consultor financiero</div>
                  <div style={{fontSize:12,marginTop:6}}>Cuéntame cómo va tu negocio y lo analizamos juntos</div>
                </div>
              )}
              {messages.map((m,i)=>(
                <div key={i} className="fu" style={m.role==="user"?S.msgU:S.msgB}>
                  {m.role==="assistant"&&<div style={{fontSize:9,fontWeight:700,color:"#00e5a0",letterSpacing:2.5,marginBottom:6}}>📊 Franco García · Consultor Financiero</div>}
                  {m.content}
                </div>
              ))}
              {chatLoading&&(
                <div style={S.msgB}>
                  <div style={{fontSize:9,fontWeight:700,color:"#00e5a0",letterSpacing:2.5,marginBottom:6}}>📊 Franco García · Consultor Financiero</div>
                  <span className="pulse" style={{color:"#00e5a0",fontSize:12}}>Analizando tu negocio...</span>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input style={{...S.inp,flex:1}} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder="Cuéntame qué necesitas resolver hoy..."/>
              <button className="hov" onClick={sendChat} disabled={chatLoading} style={{...S.btn,padding:"9px 16px",fontSize:15,flexShrink:0}}>{chatLoading?"⏳":"➤"}</button>
            </div>
            {trialUsed&&(
              <div style={{marginTop:10,padding:"10px 14px",background:"rgba(0,112,255,.06)",border:"1px solid rgba(0,112,255,.15)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:12,color:"#5a6480"}}>Prueba gratuita usada · Activa tu plan para acceso ilimitado</span>
                <a href="mailto:contacto@vcfo.ai?subject=Activar vCFO" style={{padding:"7px 16px",background:"linear-gradient(135deg,#00e5a0,#0070ff)",borderRadius:7,color:"#000",fontWeight:700,fontSize:12,textDecoration:"none"}}>Activar →</a>
              </div>
            )}
          </div>
        )}

        {/* ══════════ REPORTES ══════════ */}
        {tab==="reportes"&&(
          <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
            {[
              {icon:"📊",title:"P&L Completo",desc:"Estado de resultados del período seleccionado",action:()=>exportPnLCSV(kpis),label:"⬇ Descargar Excel"},
              {icon:"📋",title:"Transacciones",desc:"Registro completo de todos los movimientos",action:()=>exportCSV(appData.transactions),label:"⬇ Descargar Excel"},
              {icon:"📈",title:"Forecast vs Real",desc:"Comparativo mensual proyectado vs real",action:()=>{
                const rows=[["Mes","Proyectado","Real","Cumplimiento"],...MONTHS.map((_,i)=>{
                  const proj=forecast[i]?.projIncome||0;
                  const act=monthlyData[i].income;
                  return[MONTHS[i],proj,act,proj>0?`${((act/proj)*100).toFixed(1)}%`:"—"];
                })];
                const csv=rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
                const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));
                const a=document.createElement("a");a.href=url;a.download="forecast_vs_real.csv";a.click();
              },label:"⬇ Descargar Excel"},
              {icon:"🖨",title:"Informe PDF",desc:"Imprime o guarda como PDF el dashboard completo",action:()=>window.print(),label:"🖨 Imprimir / PDF"},
            ].map((r,i)=>(
              <div key={i} style={{...S.card,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontSize:28}}>{r.icon}</div>
                <div style={{fontWeight:700,color:"#e2e8f0",fontSize:14}}>{r.title}</div>
                <div style={{color:"#5a6480",fontSize:12,lineHeight:1.5,flex:1}}>{r.desc}</div>
                <button className="hov" style={{...S.btn,width:"100%"}} onClick={r.action}>{r.label}</button>
              </div>
            ))}

            <div style={{...S.card,gridColumn:"1/-1"}}>
              <div style={S.cardT}><span>📊</span> RESUMEN ACUMULADO</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
                {[{l:"AÑO COMPLETO",txns:filterTxns(appData.transactions,{year:viewYear})},{l:"MES ACTUAL",txns:filteredTxns}].map(({l,txns},i)=>{
                  const d=calcFromTxns(txns);
                  return(
                    <div key={i} style={{background:"#10151f",borderRadius:10,padding:14}}>
                      <div style={{fontSize:10,color:"#4a5568",fontWeight:700,letterSpacing:2,marginBottom:10}}>{l}</div>
                      {[["Ingresos",d.income,"#e2e8f0"],["EBITDA",d.ebitda,d.ebitda>0?"#00e5a0":"#ff4757"],["Margen",`${d.margenEbitda.toFixed(1)}%`,d.ebitda>0?"#00e5a0":"#ff4757"],["Transac.",fmtN(d.countIncome),"#8892b0"]].map(([n,v,c])=>(
                        <div key={n} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1a2236"}}>
                          <span style={{fontSize:11,color:"#5a6480"}}>{n}</span>
                          <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"'DM Mono',monospace"}}>{typeof v==="number"?fmt(v):v}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
