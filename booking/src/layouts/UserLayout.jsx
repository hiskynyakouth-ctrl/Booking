import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUnreadCount } from "../services/notificationService";

const NAV = [
  { label:"Overview",       to:"/user-dashboard",   icon:"🏠" },
  { label:"My Bookings",    to:"/my-bookings",       icon:"📅" },
  { label:"My Payments",    to:"/my-payments",       icon:"💳" },
  { label:"Notifications",  to:"/my-notifications",  icon:"🔔" },
  { label:"Shop",           to:"/shop",              icon:"🛍️" },
  { label:"Messages",       to:"/messages",          icon:"💬" },
  { label:"Profile",        to:"/profile",           icon:"👤" },
  { label:"Settings",       to:"/my-settings",       icon:"⚙️" },
];

export default function UserLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const [unread, setUnread] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setUnread(getUnreadCount(user.id));
    const update = () => setUnread(getUnreadCount(user.id));
    window.addEventListener("notifications-changed", update);
    return () => window.removeEventListener("notifications-changed", update);
  }, [user]);

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const GOLD = "#d4a017";
  const bg   = dark ? "#0a0c0f" : "#f0f2f5";
  const side = dark ? "#0d1117" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const initials = user?.name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "U";

  return (
    <div style={{ display:"flex", height:"100vh", background:bg, color:txt, fontFamily:"Inter,system-ui,sans-serif", overflow:"hidden" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:199 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width:210, background:side, borderRight:`1px solid ${bdr}`,
        display:"flex", flexDirection:"column", flexShrink:0,
        transition:"transform 0.25s, background 0.2s",
        ...(typeof window !== "undefined" && window.innerWidth < 768 ? {
          position:"fixed", top:0, bottom:0, left:0, zIndex:200,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        } : {}),
      }}>
        {/* Logo — gold accent to distinguish from admin green */}
        <div style={{ padding:"1.1rem 1rem", borderBottom:`1px solid ${bdr}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30,height:30,background:GOLD,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.82rem",color:"#000",flexShrink:0 }}>T</div>
          <div>
            <div style={{ fontWeight:700,fontSize:"0.88rem" }}>Thiyang</div>
            <div style={{ fontSize:"0.62rem",color:GOLD,fontWeight:600 }}>My Account</div>
          </div>
        </div>

        {/* User greeting */}
        <div style={{ padding:"0.85rem 1rem", borderBottom:`1px solid ${bdr}`, background:dark?"rgba(212,160,23,0.05)":"rgba(212,160,23,0.04)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:34,height:34,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700,color:"#000",flexShrink:0 }}>{initials}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:"0.78rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.name || "Customer"}</div>
              <div style={{ fontSize:"0.62rem",color:GOLD,fontWeight:600 }}>Customer</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1,overflowY:"auto",padding:"0.6rem 0.4rem" }}>
          {NAV.map(item => {
            const active = location.pathname === item.to;
            const badge = item.label === "Notifications" ? unread : 0;
            return (
              <Link key={item.to} to={item.to} onClick={()=>setSidebarOpen(false)} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"0.48rem 0.65rem", borderRadius:8, fontSize:"0.82rem",
                color: active ? GOLD : muted,
                background: active ? "rgba(212,160,23,0.12)" : "transparent",
                textDecoration:"none", marginBottom:2, transition:"all 0.15s",
                fontWeight: active ? 600 : 400,
                borderLeft: active ? `3px solid ${GOLD}` : "3px solid transparent",
              }}>
                <span style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:"0.85rem" }}>{item.icon}</span>
                  {item.label}
                </span>
                {badge > 0 && <span style={{ background:GOLD,color:"#000",fontSize:"0.58rem",fontWeight:700,padding:"1px 5px",borderRadius:999 }}>{badge}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding:"0.75rem 0.75rem",borderTop:`1px solid ${bdr}`,display:"flex",gap:6 }}>
          <button onClick={toggle} style={{ flex:1,background:sub,border:`1px solid ${bdr}`,color:muted,fontSize:"0.72rem",padding:"0.35rem",borderRadius:6,cursor:"pointer" }}>
            {dark?"☀️ Light":"🌙 Dark"}
          </button>
          <button onClick={()=>{logout();navigate("/login");}} style={{ flex:1,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"0.72rem",padding:"0.35rem",borderRadius:6,cursor:"pointer" }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0 }}>

        {/* Topbar */}
        <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.7rem 1.25rem",borderBottom:`1px solid ${bdr}`,background:side,flexShrink:0,transition:"background 0.2s" }}>
          {/* Hamburger */}
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",display:"flex",alignItems:"center" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>

          {/* Breadcrumb */}
          <div style={{ flex:1,minWidth:0 }}>
            <span style={{ fontSize:"0.72rem",color:muted }}>
              {NAV.find(n=>n.to===location.pathname)?.label || "My Account"}
            </span>
          </div>

          {/* Back to site */}
          <Link to="/" style={{ display:"flex",alignItems:"center",gap:5,background:sub,border:`1px solid ${bdr}`,color:muted,fontSize:"0.72rem",padding:"0.35rem 0.75rem",borderRadius:8,textDecoration:"none" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10"/></svg>
            Home
          </Link>

          {/* Notifications bell */}
          <button onClick={()=>navigate("/my-notifications")} style={{ position:"relative",background:"none",border:"none",color:muted,cursor:"pointer",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
            🔔
            {unread > 0 && <span style={{ position:"absolute",top:4,right:4,width:8,height:8,background:"#ef4444",borderRadius:"50%",border:`2px solid ${side}` }} />}
          </button>

          {/* Avatar dropdown */}
          <div style={{ position:"relative" }} ref={dropRef}>
            <button onClick={()=>setShowDrop(s=>!s)}
              style={{ width:32,height:32,borderRadius:"50%",background:GOLD,border:"none",color:"#000",fontWeight:700,fontSize:"0.75rem",cursor:"pointer" }}>
              {initials}
            </button>
            {showDrop && (
              <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:14,padding:"0.75rem",width:200,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
                <div style={{ padding:"0.4rem 0.5rem 0.75rem",borderBottom:`1px solid ${bdr}`,marginBottom:"0.5rem" }}>
                  <div style={{ fontWeight:700,fontSize:"0.85rem" }}>{user?.name}</div>
                  <div style={{ fontSize:"0.7rem",color:muted }}>{user?.email}</div>
                  <div style={{ fontSize:"0.65rem",color:GOLD,fontWeight:600,marginTop:2 }}>Customer Account</div>
                </div>
                {[
                  { label:"My Profile",    to:"/profile" },
                  { label:"My Bookings",   to:"/my-bookings" },
                  { label:"My Payments",   to:"/my-payments" },
                  { label:"Settings",      to:"/my-settings" },
                ].map(item=>(
                  <button key={item.label} onClick={()=>{navigate(item.to);setShowDrop(false);}}
                    style={{ display:"block",width:"100%",padding:"0.5rem 0.5rem",background:"none",border:"none",color:txt,fontSize:"0.8rem",cursor:"pointer",borderRadius:8,textAlign:"left" }}>
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop:`1px solid ${bdr}`,marginTop:"0.5rem",paddingTop:"0.5rem" }}>
                  <button onClick={()=>{logout();navigate("/login");}}
                    style={{ display:"block",width:"100%",padding:"0.5rem 0.5rem",background:"none",border:"none",color:"#ef4444",fontSize:"0.8rem",cursor:"pointer",borderRadius:8,textAlign:"left" }}>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1,overflowY:"auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
