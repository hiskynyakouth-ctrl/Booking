import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getOrders, deleteOrder } from "../services/orderService";

const Sparkline = ({ data = [], color = "#22c55e" }) => {
  const pts = (data.length ? data : [0, 0, 0, 0, 0]).map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={pts}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const TABS = ["All","Completed","Processing","Pending","Cancelled","New"];
const PER_PAGE = 10;
const statusColor = { Completed:"#22c55e", Processing:"#3b82f6", Pending:"#f59e0b", Cancelled:"#ef4444" };
const statusBg    = { Completed:"rgba(34,197,94,0.12)", Processing:"rgba(59,130,246,0.12)", Pending:"rgba(245,158,11,0.12)", Cancelled:"rgba(239,68,68,0.12)" };

export default function Orders() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [orders, setOrders] = useState([]);
  const [tab, setTab]             = useState("All");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState([]);
  const [showCols, setShowCols]   = useState(false);
  const [visibleCols, setVisibleCols] = useState({ Order:true, Customer:true, Product:true, Date:true, Trend:true, Amount:true, Status:true });
  const [showActions, setShowActions] = useState(null);
  const colRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const h = e => { 
      if (colRef.current && !colRef.current.contains(e.target)) setShowCols(false);
      if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActions(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const filtered = orders.filter(o => {
    const matchTab = tab === "All" || (tab === "New" ? isNewOrder(o) : o.status === tab);
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const isNewOrder = (order) => {
    // Consider orders from today or yesterday as new
    const orderDate = new Date(order.date);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const toggleAll    = () => setSelected(s => s.length===paginated.length ? [] : paginated.map(o=>o.id));
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    }
  };
  const exportCSV    = () => {
    const rows = [["Order","Customer","Email","Product","Date","Amount","Status"],...filtered.map(o=>[o.id,o.customer,o.email,o.product,o.date,o.amount,o.status])];
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(rows.map(r=>r.join(",")).join("\n")); a.download="orders.csv"; a.click();
  };

  const actions = (
    <button onClick={() => navigate("/booking")} style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.45rem 1rem",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
      New Order
    </button>
  );

  return (
    <DashboardLayout title="Orders" subtitle="Manage and track all customer orders." actions={actions}>
      <div style={{ padding:"1.25rem" }}>
        <div style={{ display:"flex",gap:4,marginBottom:"1rem",flexWrap:"wrap" }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>{setTab(t);setPage(1);setSelected([]);}} style={{ padding:"0.35rem 0.9rem",borderRadius:8,border:"none",fontSize:"0.78rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"1rem",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:card,border:`1px solid ${bdr}`,borderRadius:10,padding:"0.45rem 0.9rem",flex:1,maxWidth:320 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search orders..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
          </div>
          <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
            <div style={{ position:"relative" }} ref={colRef}>
              <button onClick={()=>setShowCols(s=>!s)} style={{ display:"flex",alignItems:"center",gap:6,background:card,border:`1px solid ${bdr}`,color:muted,fontSize:"0.78rem",padding:"0.45rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
                Columns
              </button>
              {showCols && (
                <div style={{ position:"absolute",right:0,top:"calc(100% + 6px)",background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:12,padding:"0.75rem",zIndex:100,minWidth:160,boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                  {Object.keys(visibleCols).map(col=>(
                    <label key={col} style={{ display:"flex",alignItems:"center",gap:8,padding:"0.35rem 0.25rem",fontSize:"0.8rem",cursor:"pointer",color:txt }}>
                      <input type="checkbox" checked={visibleCols[col]} onChange={()=>setVisibleCols(v=>({...v,[col]:!v[col]}))} style={{ accentColor:"#22c55e" }} />
                      {col}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button onClick={exportCSV} style={{ display:"flex",alignItems:"center",gap:6,background:card,border:`1px solid ${bdr}`,color:muted,fontSize:"0.78rem",padding:"0.45rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export
            </button>
          </div>
        </div>

        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.78rem",minWidth:600 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`,background:dark?"#0d1117":"#f9fafb" }}>
                  <th style={{ padding:"0.6rem 0.75rem",width:36 }}>
                    <input type="checkbox" checked={selected.length===paginated.length&&paginated.length>0} onChange={toggleAll} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                  </th>
                  {visibleCols.Order    && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Order ↕</th>}
                  {visibleCols.Customer && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Customer ↕</th>}
                  {visibleCols.Product  && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Product ↕</th>}
                  {visibleCols.Date     && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Date ↕</th>}
                  {visibleCols.Trend    && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Trend</th>}
                  {visibleCols.Amount   && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Amount ↕</th>}
                  {visibleCols.Status   && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Status</th>}
                  <th style={{ width:36 }} />
                </tr>
              </thead>
              <tbody>
                {paginated.length===0 ? (
                  <tr><td colSpan={9} style={{ textAlign:"center",padding:"3rem",color:muted }}>No orders found</td></tr>
                ) : paginated.map(o=>(
                  <tr key={o.id} style={{ borderBottom:`1px solid ${bdr}`,background:selected.includes(o.id)?(dark?"rgba(34,197,94,0.05)":"rgba(34,197,94,0.03)"):"transparent" }}>
                    <td style={{ padding:"0.65rem 0.75rem" }}><input type="checkbox" checked={selected.includes(o.id)} onChange={()=>toggleSelect(o.id)} style={{ accentColor:"#22c55e",cursor:"pointer" }} /></td>
                    {visibleCols.Order    && <td style={{ padding:"0.65rem 0.75rem",color:muted,fontFamily:"monospace",fontSize:"0.75rem" }}>{o.id}</td>}
                    {visibleCols.Customer && (
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:30,height:30,borderRadius:"50%",background:o.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:700,color:"#000",flexShrink:0,position:"relative" }}>
                            {o.initials}
                            {isNewOrder(o) && <span style={{ position:"absolute",top:-2,right:-2,width:8,height:8,borderRadius:"50%",background:"#ef4444" }}></span>}
                          </div>
                          <div>
                            <div style={{ fontWeight:600,fontSize:"0.78rem",display:"flex",alignItems:"center",gap:6 }}>
                              {o.customer}
                              {isNewOrder(o) && <span style={{ fontSize:"0.6rem",fontWeight:700,color:"#ef4444",background:"rgba(239,68,68,0.1)",padding:"2px 6px",borderRadius:4 }}>New</span>}
                            </div>
                            <div style={{ color:muted,fontSize:"0.65rem" }}>{o.email}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleCols.Product  && <td style={{ padding:"0.65rem 0.75rem",fontSize:"0.78rem" }}>{o.product}</td>}
                    {visibleCols.Date     && <td style={{ padding:"0.65rem 0.75rem",color:muted,whiteSpace:"nowrap",fontSize:"0.75rem" }}>{o.date}</td>}
                    {visibleCols.Trend    && <td style={{ padding:"0.65rem 0.75rem" }}><Sparkline data={o.trend} color={o.status==="Cancelled"?"#ef4444":"#22c55e"} /></td>}
                    {visibleCols.Amount   && <td style={{ padding:"0.65rem 0.75rem",fontWeight:700,fontSize:"0.82rem" }}>{o.amount}</td>}
                    {visibleCols.Status   && <td style={{ padding:"0.65rem 0.75rem" }}><span style={{ fontSize:"0.7rem",fontWeight:600,color:statusColor[o.status],background:statusBg[o.status],padding:"3px 10px",borderRadius:999 }}>{o.status}</span></td>}
                    <td style={{ padding:"0.65rem 0.75rem",position:"relative" }}>
                      <button onClick={()=>setShowActions(showActions === o.id ? null : o.id)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1rem" }}>⋯</button>
                      {showActions === o.id && (
                        <div ref={actionsRef} style={{ position:"absolute",right:0,top:"calc(100% + 6px)",background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:8,padding:"0.5rem",zIndex:100,minWidth:120,boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                          <button onClick={()=>handleDelete(o.id)} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"0.75rem",padding:"0.25rem 0.5rem",width:"100%",textAlign:"left" }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",borderTop:`1px solid ${bdr}`,fontSize:"0.75rem",color:muted,flexWrap:"wrap",gap:8 }}>
            <span>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} results</span>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background:card,border:`1px solid ${bdr}`,color:page===1?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===1?"not-allowed":"pointer",fontSize:"0.78rem" }}>Previous</button>
              {Array.from({length:totalPages},(_,i)=>i+1).slice(Math.max(0,page-2),Math.min(totalPages,page+1)).map(p=>(
                <button key={p} onClick={()=>setPage(p)} style={{ width:30,height:30,borderRadius:8,border:page===p?"none":`1px solid ${bdr}`,cursor:"pointer",fontSize:"0.78rem",background:page===p?"#22c55e":card,color:page===p?"#000":txt,fontWeight:page===p?700:400 }}>{p}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ background:card,border:`1px solid ${bdr}`,color:page===totalPages?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===totalPages?"not-allowed":"pointer",fontSize:"0.78rem" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
