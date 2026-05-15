import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getAllBookings } from "../services/bookingService";
import UserLayout from "../layouts/UserLayout";

const statusColor = { confirmed:"#22c55e", pending:"#f59e0b", completed:"#3b82f6", cancelled:"#ef4444", rejected:"#ef4444" };
const statusBg    = { confirmed:"rgba(34,197,94,0.12)", pending:"rgba(245,158,11,0.12)", completed:"rgba(59,130,246,0.12)", cancelled:"rgba(239,68,68,0.12)", rejected:"rgba(239,68,68,0.12)" };
const payColor    = { verified:"#22c55e", unpaid:"#f59e0b", paid:"#3b82f6" };

const ETB = (n) => `ETB ${Number(n||0).toLocaleString()}`;

const TABS = ["All","pending","confirmed","completed","cancelled"];

export default function MyBookings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user }  = useAuth();
  const dark = theme === "dark";

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    const all = (getAllBookings() || []).filter(Boolean);
    // Show only this user's bookings
    const mine = all.filter(b => String(b.userId) === String(user.id));
    setBookings(mine);
  }, [user]);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const stats = [
    { label:"Total",     value:bookings.length,                                              color:"#3b82f6" },
    { label:"Pending",   value:bookings.filter(b=>b.status==="pending").length,              color:"#f59e0b" },
    { label:"Confirmed", value:bookings.filter(b=>b.status==="confirmed").length,            color:"#22c55e" },
    { label:"Completed", value:bookings.filter(b=>b.status==="completed").length,            color:"#8b5cf6" },
  ];

  return (
    <UserLayout>
      <div style={{ padding:"1rem 1.25rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem", flexWrap:"wrap", gap:8 }}>
          <div>
            <h1 style={{ fontSize:"1.2rem", fontWeight:700, marginBottom:"0.2rem", color:txt }}>My Bookings</h1>
            <p style={{ fontSize:"0.78rem", color:muted }}>View and manage your appointments</p>
          </div>
          <button onClick={()=>navigate("/booking")} style={{ background:"#d4a017", border:"none", color:"#000", fontWeight:700, fontSize:"0.8rem", padding:"0.5rem 1.1rem", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            New Booking
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))", gap:"0.6rem", marginBottom:"1.25rem" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"0.85rem", textAlign:"center" }}>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:"0.68rem", color:muted, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:"1rem", flexWrap:"wrap" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding:"0.3rem 0.8rem", borderRadius:8, border:"none", fontSize:"0.75rem", background:filter===t?(dark?"#1e2330":"#e5e7eb"):"transparent", color:filter===t?txt:muted, fontWeight:filter===t?700:400, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"3rem", color:muted }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>📅</div>
            <p style={{ marginBottom:"0.5rem", fontWeight:600 }}>No bookings yet</p>
            <p style={{ fontSize:"0.78rem", marginBottom:"1.25rem" }}>Book a service to get started</p>
            <button onClick={()=>navigate("/booking")} style={{ background:"#d4a017", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.2rem", borderRadius:8, cursor:"pointer" }}>
              Book a Service
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
            {filtered.map(b => {
              const isUrl = b.serviceIcon && (b.serviceIcon.startsWith("http") || b.serviceIcon.startsWith("/"));
              return (
              <div key={b.id} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1rem 1.1rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", flexWrap:"wrap" }}>
                  {/* Service icon — image or emoji */}
                  <div style={{ width:48, height:48, borderRadius:10, overflow:"hidden", background:sub, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {isUrl ? (
                      <img src={b.serviceIcon} alt={b.service} style={{ width:"100%", height:"100%", objectFit:"cover" }}
                        onError={e => { e.target.style.display="none"; e.target.parentNode.innerHTML = "📅"; }} />
                    ) : (
                      <span style={{ fontSize:"1.4rem" }}>{b.serviceIcon || "📅"}</span>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:"0.88rem", color:txt, marginBottom:"0.2rem" }}>{b.service || b.serviceTitle || "Service"}</div>
                    <div style={{ fontSize:"0.73rem", color:muted, display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      <span>📅 {b.date}</span>
                      {b.time && <span>🕐 {b.time}</span>}
                      {b.duration && <span>⏱ {b.duration}</span>}
                    </div>
                    <div style={{ fontSize:"0.68rem", color:muted, marginTop:"0.2rem" }}>Ref: {b.id}</div>
                    {b.paymentStatus && (
                      <div style={{ marginTop:"0.35rem", fontSize:"0.7rem", color:payColor[b.paymentStatus]||muted, fontWeight:600 }}>
                        Payment: {b.paymentStatus === "verified" ? "✅ Verified" : b.paymentStatus === "paid" ? "💳 Paid" : "⏳ Awaiting payment"}
                      </div>
                    )}
                    {b.adminNote && (
                      <div style={{ marginTop:"0.35rem", fontSize:"0.72rem", color:"#f59e0b", background:"rgba(245,158,11,0.08)", padding:"0.3rem 0.6rem", borderRadius:6 }}>
                        💬 {b.adminNote}
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"0.4rem", flexShrink:0 }}>
                    <span style={{ fontWeight:700, color:"#d4a017", fontSize:"0.88rem" }}>
                      {ETB(b.price || b.amount || 0)}
                    </span>
                    <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[b.status]||muted, background:statusBg[b.status]||"transparent", padding:"3px 10px", borderRadius:999, textTransform:"capitalize" }}>
                      {b.status}
                    </span>
                    {b.status === "confirmed" && b.paymentStatus === "unpaid" && (
                      <button onClick={()=>navigate("/checkout", { state:{ booking:b } })} style={{ background:"#22c55e", border:"none", color:"#000", fontSize:"0.7rem", fontWeight:700, padding:"0.3rem 0.75rem", borderRadius:6, cursor:"pointer" }}>
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
