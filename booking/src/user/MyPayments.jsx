import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserPayments, downloadInvoice } from "../services/paymentService";
import UserLayout from "../layouts/UserLayout";

const statusColor = { paid:"#22c55e", refunded:"#f59e0b", failed:"#ef4444", pending:"#3b82f6" };
const statusBg    = { paid:"rgba(34,197,94,0.12)", refunded:"rgba(245,158,11,0.12)", failed:"rgba(239,68,68,0.12)", pending:"rgba(59,130,246,0.12)" };

export default function MyPayments() {
  const { user }  = useAuth();
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const dark = theme === "dark";

  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  useEffect(() => {
    getUserPayments(user?.id).then(p => { setPayments(p); setLoading(false); });
  }, [user]);

  const total = payments.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);

  return (
    <UserLayout>
      <div style={{ padding:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:8 }}>
          <div>
            <h1 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:"0.2rem" }}>Payment History</h1>
            <p style={{ fontSize:"0.78rem", color:muted }}>Your transactions and invoices</p>
          </div>
          <button onClick={() => navigate("/booking")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.2rem", borderRadius:8, cursor:"pointer" }}>
            + New Booking
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
          {[
            { label:"Total Paid",    value:`Br ${total.toFixed(2)}`,                          color:"#22c55e" },
            { label:"Transactions",  value:payments.length,                                  color:"#3b82f6" },
            { label:"Refunds",       value:payments.filter(p=>p.status==="refunded").length, color:"#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Transactions list */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"3rem", color:muted }}>Loading...</div>
        ) : payments.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:muted }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>💳</div>
            <p style={{ marginBottom:"1rem" }}>No payments yet</p>
            <button onClick={() => navigate("/booking")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.2rem", borderRadius:8, cursor:"pointer" }}>Book a Service</button>
          </div>
        ) : (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:500 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${bdr}`, background:dark?"#0d1117":"#f9fafb" }}>
                    {["ID","Description","Method","Amount","Status","Date",""].map(h=>(
                      <th key={h} style={{ textAlign:"left", padding:"0.55rem 0.75rem", fontWeight:500, color:muted, fontSize:"0.72rem" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                      <td style={{ padding:"0.65rem 0.75rem", fontFamily:"monospace", fontSize:"0.72rem", color:muted }}>{p.id}</td>
                      <td style={{ padding:"0.65rem 0.75rem", fontWeight:500 }}>{p.description}</td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, textTransform:"capitalize" }}>
                        {p.method.replace("_"," ")}
                        {p.bankName ? ` • ${p.bankName}` : ""}
                        {p.bankRef ? ` / ${p.bankRef}` : ""}
                        {p.cardLast4 ? ` ••${p.cardLast4}` : ""}
                      </td>
                      <td style={{ padding:"0.65rem 0.75rem", fontWeight:700, color:"#22c55e" }}>{`Br ${p.amount.toFixed(2)}`}</td>
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[p.status], background:statusBg[p.status], padding:"3px 10px", borderRadius:999, textTransform:"capitalize" }}>{p.status}</span>
                      </td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.72rem", whiteSpace:"nowrap" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <button onClick={() => downloadInvoice(p)} title="Download invoice" style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:"0.9rem" }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
