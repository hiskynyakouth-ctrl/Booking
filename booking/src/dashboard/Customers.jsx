import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAllUsers } from "../services/authService";

const TABS = ["All","Active","Inactive"];
const PER_PAGE = 10;

export default function Customers() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [customers, setCustomers] = useState([]);
  const [tab,         setTab]         = useState("All");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [selected,    setSelected]    = useState([]);
  const [showCols,    setShowCols]    = useState(false);
  const [visibleCols, setVisibleCols] = useState({ Customer:true, Status:true, Joined:true, Orders:true, "Total Spent":true });
  const colRef = useRef(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllUsers();
        setCustomers((data || []).filter(Boolean).map((user, index) => {
          const name = user.name || user.email || `User ${index + 1}`;
          const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return {
            id: user.id || user._id || index + 1,
            name,
            email: user.email || "",
            initials,
            color: ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"][(index % 4)],
            status: "Active",
            joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-ET", { day: "numeric", month: "short", year: "numeric" }) : "N/A",
            orders: 0,
            spent: "Br 0.00",
          };
        }));
      } catch (error) {
        console.error("Failed to load customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const h = e => { if (colRef.current && !colRef.current.contains(e.target)) setShowCols(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";

  const filtered = customers.filter(c => {
    const matchTab = tab==="All" || c.status===tab;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search);
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const toggleAll    = () => setSelected(s => s.length===paginated.length ? [] : paginated.map(c=>c.id));

  const exportCSV = () => {
    const rows = [["Name","Email","Status","Joined","Orders","Total Spent"],...filtered.map(c=>[c.name,c.email,c.status,c.joined,c.orders,c.spent])];
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(rows.map(r=>r.join(",")).join("\n")); a.download="customers.csv"; a.click();
  };

  return (
    <DashboardLayout title="Customers" subtitle="View and manage your customer base.">
      <div style={{ padding:"1.25rem" }}>
        <div style={{ display:"flex",gap:4,marginBottom:"1rem",flexWrap:"wrap" }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>{setTab(t);setPage(1);}} style={{ padding:"0.35rem 0.9rem",borderRadius:8,border:"none",fontSize:"0.78rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"1rem",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:card,border:`1px solid ${bdr}`,borderRadius:10,padding:"0.45rem 0.9rem",flex:1,maxWidth:280 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search customers..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
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
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.78rem",minWidth:500 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`,background:dark?"#0d1117":"#f9fafb" }}>
                  <th style={{ padding:"0.6rem 0.75rem",width:36 }}>
                    <input type="checkbox" checked={selected.length===paginated.length&&paginated.length>0} onChange={toggleAll} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                  </th>
                  {visibleCols.Customer      && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Customer</th>}
                  {visibleCols.Status        && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Status</th>}
                  {visibleCols.Joined        && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Joined</th>}
                  {visibleCols.Orders        && <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Orders</th>}
                  {visibleCols["Total Spent"]&& <th style={{ textAlign:"left",padding:"0.6rem 0.75rem",fontWeight:600,color:muted,fontSize:"0.72rem" }}>Total Spent</th>}
                  <th style={{ width:36 }} />
                </tr>
              </thead>
              <tbody>
                {paginated.length===0 ? (
                  <tr><td colSpan={7} style={{ textAlign:"center",padding:"3rem",color:muted }}>No customers found</td></tr>
                ) : paginated.map(c=>(
                  <tr key={c.id} style={{ borderBottom:`1px solid ${bdr}`,background:selected.includes(c.id)?(dark?"rgba(34,197,94,0.05)":"rgba(34,197,94,0.03)"):"transparent" }}>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={()=>toggleSelect(c.id)} style={{ accentColor:"#22c55e",cursor:"pointer" }} />
                    </td>
                    {visibleCols.Customer && (
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:30,height:30,borderRadius:"50%",background:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:700,color:"#000",flexShrink:0 }}>{c.initials}</div>
                          <div>
                            <div style={{ fontWeight:600,fontSize:"0.82rem" }}>{c.name}</div>
                            <div style={{ color:muted,fontSize:"0.68rem" }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleCols.Status && (
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        {c.status==="Active"
                          ? <span style={{ fontSize:"0.7rem",fontWeight:600,color:"#22c55e",background:"rgba(34,197,94,0.12)",padding:"3px 10px",borderRadius:999 }}>Active</span>
                          : <span style={{ fontSize:"0.7rem",color:muted }}>Inactive</span>}
                      </td>
                    )}
                    {visibleCols.Joined        && <td style={{ padding:"0.65rem 0.75rem",color:muted,whiteSpace:"nowrap",fontSize:"0.75rem" }}>{c.joined}</td>}
                    {visibleCols.Orders        && <td style={{ padding:"0.65rem 0.75rem",color:muted }}>{c.orders}</td>}
                    {visibleCols["Total Spent"]&& <td style={{ padding:"0.65rem 0.75rem",fontWeight:700 }}>{c.spent}</td>}
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <button style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1rem" }}>⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
