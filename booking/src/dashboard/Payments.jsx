import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAllPayments, refundPayment, downloadInvoice } from "../services/paymentService";
import DashboardLayout from "../layouts/DashboardLayout";

const statusColor = { paid:"#22c55e", refunded:"#f59e0b", failed:"#ef4444", pending:"#3b82f6" };
const statusBg    = { paid:"rgba(34,197,94,0.12)", refunded:"rgba(245,158,11,0.12)", failed:"rgba(239,68,68,0.12)", pending:"rgba(59,130,246,0.12)" };

export default function Payments() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [payments, setPayments] = useState([]);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");
  const [methodFilter,setMethodFilter]= useState("All");
  const [loading,     setLoading]     = useState(true);
  const [refundingId, setRefundingId] = useState(null);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  useEffect(() => {
    getAllPayments().then(p => { setPayments((p || []).filter(Boolean)); setLoading(false); }).catch(() => { setPayments([]); setLoading(false); });
  }, []);

  const handleRefund = async (id) => {
    const reason = window.prompt("Refund reason (optional):", "");
    if (reason === null) return;
    if (!window.confirm("Issue refund for this payment?")) return;
    setRefundingId(id);
    try {
      const updated = await refundPayment(id, reason.trim());
      setPayments(prev => prev.map(p => p.id === id ? updated : p));
    } finally {
      setRefundingId(null);
    }
  };

  const filtered = payments.filter(p => {
    const matchFilter = filter === "All" || p.status === filter.toLowerCase();
    const matchMethod = methodFilter === "All" || p.method === methodFilter;
    const matchSearch = !search || [p.userName, p.id, p.description, p.method, p.bankName, p.bankRef].some(value =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    );
    return matchFilter && matchMethod && matchSearch;
  });

  const totalRevenue = payments.filter(p=>p.status==="paid").reduce((s,p)=>s+Number(p.amount || 0),0);
  const totalRefunds = payments.filter(p=>p.status==="refunded").reduce((s,p)=>s+Number(p.amount || 0),0);

  const STATS = [
    { label:"Total Revenue",  value:`Br ${totalRevenue.toFixed(2)}`,                          color:"#22c55e" },
    { label:"Transactions",   value:payments.length,                                          color:"#3b82f6" },
    { label:"Refunds Issued", value:`Br ${totalRefunds.toFixed(2)}`,                           color:"#f59e0b" },
    { label:"Failed",         value:payments.filter(p=>p.status==="failed").length,           color:"#ef4444" },
  ];

  return (
    <DashboardLayout title="Payments" subtitle="Track all transactions, refunds and payment history.">
      <div style={{ padding:"1.25rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.75rem", marginBottom:"1.25rem" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1rem", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:card, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.45rem 0.9rem", flex:1, maxWidth:300 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by user, ID, bank or method..." style={{ background:"transparent", border:"none", outline:"none", color:txt, fontSize:"0.82rem", width:"100%" }} />
          </div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {["All","Paid","Pending","Refunded","Failed"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:"0.35rem 0.85rem", borderRadius:8, border:"none", fontSize:"0.75rem", background:filter===f?(dark?"#1e2330":"#e5e7eb"):"transparent", color:filter===f?txt:muted, fontWeight:filter===f?700:400, cursor:"pointer" }}>{f}</button>
            ))}
          </div>
          <div style={{ minWidth:160 }}>
            <select value={methodFilter} onChange={e=>setMethodFilter(e.target.value)} style={{ width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 0.9rem", color:txt, fontSize:"0.82rem", outline:"none", cursor:"pointer" }}>
              {['All','card','bank_transfer','mobile'].map(value => (
                <option key={value} value={value}>{value === 'All' ? 'All methods' : value.replace('_',' ')}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Table */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:650 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${bdr}`, background:dark?"#0d1117":"#f9fafb" }}>
                  {["ID","Customer","Description","Method","Amount","Status","Date","Actions"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"0.55rem 0.75rem", fontWeight:500, color:muted, fontSize:"0.72rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign:"center", padding:"3rem", color:muted }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign:"center", padding:"3rem", color:muted }}>No transactions found</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                    <td style={{ padding:"0.65rem 0.75rem", fontFamily:"monospace", fontSize:"0.72rem", color:muted }}>{p.id}</td>
                    <td style={{ padding:"0.65rem 0.75rem", fontWeight:600 }}>{p.userName || "—"}</td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted }}>{p.description}</td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted, textTransform:"capitalize" }}>
                      {p.method.replace("_"," ")}{p.cardLast4?` ••${p.cardLast4}`:""}
                      {p.bankName ? <div style={{ fontSize:"0.72rem", color:muted, marginTop:2 }}>{p.bankName}</div> : null}
                      {p.bankRef ? <div style={{ fontSize:"0.72rem", color:muted }}>{p.bankRef}</div> : null}
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem", fontWeight:700, color:p.status === 'refunded' ? '#f59e0b' : '#22c55e' }}>Br {Number(p.amount || 0).toFixed(2)}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[p.status], background:statusBg[p.status], padding:"3px 10px", borderRadius:999, textTransform:"capitalize" }}>{p.status}</span>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.72rem", whiteSpace:"nowrap" }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <button onClick={() => downloadInvoice(p)} title="Download" style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:"0.9rem" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        </button>
                        {p.status === "paid" && (
                          <button onClick={() => handleRefund(p.id)} title="Refund" disabled={refundingId === p.id} style={{ background:"none", border:"none", color:refundingId===p.id?"#9ca3af":"#f59e0b", cursor:refundingId===p.id?"not-allowed":"pointer", fontSize:"0.75rem", fontWeight:600 }}>
                            {refundingId === p.id ? "Refunding..." : "Refund"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

<style>{`
  @media (max-width: 768px) {
    table { font-size: 0.7rem; }
    th, td { padding: 0.4rem 0.5rem; }
  }
`}</style>
