import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getAllBookings } from "../services/bookingService";
import { getUserPayments } from "../services/paymentService";
import { getUnreadCount } from "../services/notificationService";
import UserLayout from "../layouts/UserLayout";

const GOLD = "#d4a017";

const QUICK = [
  { label:"Book a Service",  to:"/booking",          icon:"📅", color:GOLD },
  { label:"My Bookings",     to:"/my-bookings",       icon:"📋", color:"#3b82f6" },
  { label:"Shop",            to:"/shop",              icon:"🛍️", color:"#8b5cf6" },
  { label:"Messages",        to:"/messages",          icon:"💬", color:"#22c55e" },
  { label:"My Payments",     to:"/my-payments",       icon:"💳", color:"#ec4899" },
  { label:"Explore",         to:"/",                  icon:"🔍", color:"#06b6d4" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [unread,   setUnread]   = useState(0);

  useEffect(() => {
    if (!user) return;
    const all = (getAllBookings() || []).filter(Boolean);
    setBookings(all.filter(b => String(b.userId) === String(user.id)));
    getUserPayments(user.id).then(p => setPayments((p||[]).filter(Boolean)));
    setUnread(getUnreadCount(user.id));
    const update = () => setUnread(getUnreadCount(user.id));
    window.addEventListener("notifications-changed", update);
    return () => window.removeEventListener("notifications-changed", update);
  }, [user]);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const pendingBookings  = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const totalSpent = payments.filter(p => p.status === "paid").reduce((s,p) => s+Number(p.amount||0), 0);

  const STATS = [
    { label:"My Bookings",   value:bookings.length,    color:GOLD,      icon:"📅" },
    { label:"Pending",       value:pendingBookings.length, color:"#f59e0b", icon:"⏳" },
    { label:"Confirmed",     value:confirmedBookings.length, color:"#22c55e", icon:"✅" },
    { label:"Total Spent",   value:`ETB ${totalSpent.toLocaleString()}`, color:"#3b82f6", icon:"💳" },
  ];

  const recentBookings = bookings.slice(0, 3);

  return (
    <UserLayout>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"1.5rem 1.25rem" }}>

        {/* Welcome banner */}
        <div style={{ background:`linear-gradient(135deg, ${dark?"#1a1200":"#fffbeb"}, ${dark?"#0d1117":"#fff"})`, border:`1px solid ${dark?"#3a2800":"#fde68a"}`, borderRadius:16, padding:"1.25rem 1.5rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:"1.3rem", fontWeight:800, marginBottom:"0.2rem" }}>
              Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
            </div>
            <div style={{ fontSize:"0.8rem", color:muted }}>Here's a summary of your account activity.</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {unread > 0 && (
              <button onClick={()=>navigate("/my-notifications")} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"0.78rem", fontWeight:600, padding:"0.4rem 0.9rem", borderRadius:8, cursor:"pointer" }}>
                🔔 {unread} new notification{unread>1?"s":""}
              </button>
            )}
            <button onClick={()=>navigate("/booking")} style={{ background:GOLD, border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.45rem 1.1rem", borderRadius:8, cursor:"pointer" }}>
              + Book Now
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1rem 1.1rem", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38,height:38,borderRadius:10,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:"1.3rem", fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"0.68rem", color:muted }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ marginBottom:"1.5rem" }}>
          <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.75rem", color:txt }}>Quick Actions</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:"0.65rem" }}>
            {QUICK.map(link => (
              <button key={link.to} onClick={()=>navigate(link.to)}
                style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem 0.9rem", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"0.6rem", cursor:"pointer", textAlign:"left", transition:"border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.boxShadow = `0 0 16px ${link.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = bdr; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width:36,height:36,background:link.color+"18",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem" }}>{link.icon}</div>
                <span style={{ fontWeight:600, fontSize:"0.82rem", color:txt }}>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.1rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.85rem" }}>
            <div style={{ fontWeight:700, fontSize:"0.88rem" }}>Recent Bookings</div>
            <button onClick={()=>navigate("/my-bookings")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.25rem 0.65rem", borderRadius:6, cursor:"pointer" }}>View All</button>
          </div>
          {recentBookings.length === 0 ? (
            <div style={{ textAlign:"center", padding:"1.5rem", color:muted }}>
              <div style={{ fontSize:"1.8rem", marginBottom:"0.5rem" }}>📅</div>
              <div style={{ fontSize:"0.8rem", marginBottom:"0.75rem" }}>No bookings yet</div>
              <button onClick={()=>navigate("/booking")} style={{ background:GOLD, border:"none", color:"#000", fontWeight:700, fontSize:"0.78rem", padding:"0.4rem 1rem", borderRadius:8, cursor:"pointer" }}>
                Book a Service
              </button>
            </div>
          ) : recentBookings.map(b => (
            <div key={b.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"0.6rem 0", borderBottom:`1px solid ${bdr}` }}>
              <div style={{ width:34,height:34,borderRadius:9,overflow:"hidden",background:sub,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0 }}>
                {b.serviceIcon && (b.serviceIcon.startsWith("http") || b.serviceIcon.startsWith("/")) ? (
                  <img src={b.serviceIcon} alt={b.service} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{e.target.style.display="none";e.target.parentNode.textContent="📅";}} />
                ) : (
                  <span>{b.serviceIcon || "📅"}</span>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:"0.82rem" }}>{b.service || "Service"}</div>
                <div style={{ fontSize:"0.68rem", color:muted }}>{b.date} {b.time ? `• ${b.time}` : ""}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontWeight:700, fontSize:"0.82rem", color:GOLD }}>ETB {Number(b.price||0).toLocaleString()}</div>
                <div style={{ fontSize:"0.65rem", fontWeight:600, color:b.status==="confirmed"?"#22c55e":b.status==="pending"?"#f59e0b":"#6b7280", textTransform:"capitalize" }}>{b.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.1rem" }}>
          <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.85rem" }}>Account Info</div>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {[["Name", user?.name],["Email", user?.email],["Role", "Customer"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"0.5rem 0", borderBottom:`1px solid ${bdr}`, fontSize:"0.82rem" }}>
                <span style={{ color:muted }}>{k}</span>
                <span style={{ fontWeight:600, textTransform:"capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>navigate("/profile")} style={{ marginTop:"0.85rem", background:GOLD, border:"none", color:"#000", fontWeight:700, fontSize:"0.8rem", padding:"0.45rem 1.1rem", borderRadius:8, cursor:"pointer" }}>
            Edit Profile
          </button>
        </div>

      </div>
    </UserLayout>
  );
}
