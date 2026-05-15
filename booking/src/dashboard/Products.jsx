import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";

const PRODUCTS_KEY = "admin_products";
const getStoredProducts = () => JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
const saveProducts = (p) => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));

const TABS = ["All","Active","Draft","Archived"];
const CATS = ["All Categories","Templates","Plans","Licenses","Modules"];
const PER_PAGE = 10;

const statusColor = { Active:"#22c55e", Draft:"#f59e0b", Archived:"#6b7280" };
const statusBg    = { Active:"rgba(34,197,94,0.15)", Draft:"rgba(245,158,11,0.15)", Archived:"rgba(107,114,128,0.15)" };

export default function Products() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [tab,         setTab]         = useState("All");
  const [cat,         setCat]         = useState("All Categories");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [selected,    setSelected]    = useState([]);
  const [showCols,    setShowCols]    = useState(false);
  const [visibleCols, setVisibleCols] = useState({ Product:true, Category:true, Status:true, Stock:true, Price:true, Created:true });
  const colRef = useRef(null);

  useEffect(() => {
    const h = e => { if (colRef.current && !colRef.current.contains(e.target)) setShowCols(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";

  const [allProducts, setAllProducts] = useState(getStoredProducts);

  const filtered = allProducts.filter(p => {
    const matchTab = tab === "All" || p.status === tab;
    const matchCat = cat === "All Categories" || p.category === cat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const toggleAll    = () => setSelected(s => s.length===paginated.length ? [] : paginated.map(p=>p.id));

  const exportCSV = () => {
    const rows = [["Name","Category","Status","Price","Created"],...filtered.map(p=>[p.name,p.category,p.status,p.price,p.created])];
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(rows.map(r=>r.join(",")).join("\n")); a.download="products.csv"; a.click();
  };

  const addProductAction = (
    <button onClick={()=>navigate("/shop")} style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.45rem 1rem",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
      Add Product
    </button>
  );

  return (
    <DashboardLayout title="Products" subtitle="Browse and manage your product catalog." actions={addProductAction}>
      <div style={{ padding:"1.25rem" }}>
        {/* Tabs */}
        <div style={{ display:"flex",gap:4,marginBottom:"1rem",flexWrap:"wrap" }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>{setTab(t);setPage(1);}} style={{ padding:"0.35rem 0.9rem",borderRadius:8,border:"none",fontSize:"0.78rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        {/* Search + Category + Actions */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"1rem",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:card,border:`1px solid ${bdr}`,borderRadius:10,padding:"0.45rem 0.9rem",flex:1,maxWidth:280 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search products..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
          </div>
          <select value={cat} onChange={e=>{setCat(e.target.value);setPage(1);}} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:10,padding:"0.45rem 0.9rem",color:txt,fontSize:"0.78rem",outline:"none",cursor:"pointer" }}>
            {CATS.map(c=><option key={c} value={c} style={{ background:dark?"#111318":"#fff" }}>{c}</option>)}
          </select>
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

        {/* Table */}
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.78rem",minWidth:600 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`,background:dark?"#0d1117":"#f9fafb" }}>
                  <th style={{ padding:"0.6rem 0.75rem",width:36 }}>
                    <input type="checkbox" checked={selected.length===paginated.length&&paginated.length>0} onChange={toggleAll} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                  </th>
                  {visibleCols.Product  && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Product ↕</th>}
                  {visibleCols.Category && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Category ↕</th>}
                  {visibleCols.Status   && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Status</th>}
                  {visibleCols.Stock    && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Stock</th>}
                  {visibleCols.Price    && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Price ↕</th>}
                  {visibleCols.Created  && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Created ↕</th>}
                  <th style={{ width:36 }} />
                </tr>
              </thead>
              <tbody>
                {paginated.length===0 ? (
                  <tr><td colSpan={9} style={{ textAlign:"center",padding:"3rem",color:muted }}>No products found</td></tr>
                ) : paginated.map(p=>(
                  <tr key={p.id} style={{ borderBottom:`1px solid ${bdr}`,background:selected.includes(p.id)?(dark?"rgba(34,197,94,0.05)":"rgba(34,197,94,0.03)"):"transparent" }}>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                    </td>
                    {visibleCols.Product && (
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:32,height:32,borderRadius:8,background:p.color+"22",border:`1px solid ${p.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0 }}>
                            {p.category==="Templates"?"🎨":p.category==="Plans"?"📋":p.category==="Licenses"?"🔑":"🧩"}
                          </div>
                          <div>
                            <div style={{ fontWeight:600,fontSize:"0.82rem" }}>{p.name}</div>
                            <div style={{ color:muted,fontSize:"0.68rem",maxWidth:320,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.desc}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleCols.Category && <td style={{ padding:"0.65rem 0.75rem",color:muted,fontSize:"0.78rem" }}>{p.category}</td>}
                    {visibleCols.Status   && (
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <span style={{ fontSize:"0.7rem",fontWeight:600,color:statusColor[p.status],background:statusBg[p.status],padding:"3px 10px",borderRadius:999 }}>{p.status}</span>
                      </td>
                    )}
                    {visibleCols.Stock   && <td style={{ padding:"0.65rem 0.75rem",color:muted }}>{p.stock}</td>}
                    {visibleCols.Price   && <td style={{ padding:"0.65rem 0.75rem",fontWeight:700 }}>{p.price}</td>}
                    {visibleCols.Created && <td style={{ padding:"0.65rem 0.75rem",color:muted,whiteSpace:"nowrap",fontSize:"0.75rem" }}>{p.created}</td>}
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <button style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1rem" }}>⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",borderTop:`1px solid ${bdr}`,fontSize:"0.75rem",color:muted,flexWrap:"wrap",gap:8 }}>
            <span>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} results</span>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ marginRight:4 }}>Rows: {PER_PAGE}</span>
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
