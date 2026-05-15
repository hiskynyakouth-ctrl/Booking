import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUnreadCount } from "../services/notificationService";

const NAV = [
  { section:"OVERVIEW", items:[
    { label:"Dashboard",     to:"/dashboard"     },
    { label:"Analytics",     to:"/analytics"     },
    { label:"eCommerce",     to:"/ecommerce"     },
    { label:"CRM",           to:"/crm"           },
    { label:"SaaS",          to:"/saas"          },
    { label:"Charts",        to:"/charts"        },
  ]},
  { section:"E-COMMERCE", items:[
    { label:"Orders",        to:"/orders",        badge:86 },
    { label:"Products",      to:"/products"      },
    { label:"Customers",     to:"/customers"     },
    { label:"Invoices",      to:"/invoices"      },
  ]},
  { section:"APPS", items:[
    { label:"Mail",          to:"/mail"          },
    { label:"Chat",          to:"/chat"          },
    { label:"Calendar",      to:"/calendar"      },
    { label:"Bookings",      to:"/bookings"      },
  ]},
  { section:"SYSTEM", items:[
    { label:"Users",         to:"/users"         },
    { label:"Notifications", to:"/notifications", badge:3 },
    { label:"Payments",      to:"/payments"      },
    { label:"Availability",  to:"/availability"  },
    { label:"Settings",      to:"/settings"      },
  ]},
];

export default function DashboardLayout({ children, title, subtitle, actions }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { theme, toggle } = useTheme();
  const { user, logout }  = useAuth();
  const dark = theme === "dark";
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifBadge, setNotifBadge] = useState(getUnreadCount("admin"));

  useEffect(() => {
    const update = () => setNotifBadge(getUnreadCount("admin"));
    window.addEventListener("notifications-changed", update);
    return () => window.removeEventListener("notifications-changed", update);
  }, []);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const bg   = dark ? "#0a0c0f" : "#f4f5f7";
  const side = dark ? "#0d1117" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const me = user || {};
  const initials = me.name ? me.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "TH";

  return (
    <div style={{ display:"flex", height:"100vh", background:bg, color:txt, fontFamily:"Inter,system-ui,sans-serif", overflow:"hidden", transition:"background 0.2s,color 0.2s" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:199 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width:210, background:side, borderRight:`1px solid ${bdr}`,
        display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0,
        transition:"transform 0.25s, background 0.2s",
        WebkitFontSmoothing:"antialiased",
        MozOsxFontSmoothing:"grayscale",
        ...(typeof window!=="undefined" && window.innerWidth<768 ? {
          position:"fixed", top:0, bottom:0, left:0, zIndex:200,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        } : {}),
      }}>
        {/* Logo */}
        <div style={{ padding:"1.1rem 1rem", borderBottom:`1px solid ${bdr}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30,height:30,background:"#22c55e",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.82rem",color:"#000",flexShrink:0 }}>T</div>
          <div>
            <div style={{ fontWeight:700,fontSize:"0.88rem" }}>Thiyang</div>
            <div style={{ fontSize:"0.62rem",color:muted }}>4 workspaces</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1,overflowY:"auto",padding:"0.6rem 0.4rem" }}>
          {NAV.map(section => (
            <div key={section.section} style={{ marginBottom:"0.4rem" }}>
              <div style={{ fontSize:"0.62rem",fontWeight:700,color:muted,letterSpacing:"0.12em",padding:"0.4rem 0.65rem 0.2rem",textTransform:"uppercase" }}>{section.section}</div>
              {section.items.map(item => {
                const active = location.pathname === item.to;
                const badge = item.label === "Notifications" ? notifBadge : item.badge;
                return (
                  <Link key={item.label} to={item.to} onClick={()=>setSidebarOpen(false)} style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"0.45rem 0.65rem",borderRadius:8,fontSize:"0.82rem",
                    color:active?"#22c55e":muted,
                    background:active?"rgba(34,197,94,0.1)":"transparent",
                    textDecoration:"none",transition:"all 0.15s",
                    fontWeight:active?600:400,
                  }}>
                    {item.label}
                    {badge > 0 && <span style={{ background:"#22c55e",color:"#000",fontSize:"0.58rem",fontWeight:700,padding:"1px 5px",borderRadius:999 }}>{badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ padding:"0.75rem 1rem",borderTop:`1px solid ${bdr}`,display:"flex",alignItems:"center",gap:8,cursor:"pointer" }}
          onClick={()=>navigate("/profile")}>
          <div style={{ width:28,height:28,borderRadius:"50%",background:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:700,color:"#000",flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:"0.75rem",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{me.name||"Business Owner"}</div>
            <div style={{ fontSize:"0.62rem",color:muted }}>Admin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0 }}>

        {/* Topbar */}
        <div style={{ display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.75rem 1.25rem",borderBottom:`1px solid ${bdr}`,background:side,flexShrink:0,transition:"background 0.2s" }}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",display:"flex",alignItems:"center" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>

          <div style={{ flex:1,minWidth:0 }}>
            {title && <h1 style={{ fontSize:"1.1rem",fontWeight:700,margin:0 }}>{title}</h1>}
            {subtitle && <p style={{ fontSize:"0.72rem",color:muted,margin:0 }}>{subtitle}</p>}
          </div>

          {/* Back to home */}
          <Link to="/" style={{ display:"flex",alignItems:"center",gap:5,background:sub,border:`1px solid ${bdr}`,color:muted,fontSize:"0.72rem",padding:"0.35rem 0.75rem",borderRadius:8,textDecoration:"none",transition:"color 0.15s" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10"/></svg>
            Home
          </Link>

          {/* Custom actions */}
          {actions}

          {/* Theme */}
          <button onClick={toggle} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1rem",width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
            {dark?"☀️":"🌙"}
          </button>

          {/* Avatar dropdown */}
          <div style={{ position:"relative" }} ref={dropRef}>
            <button onClick={()=>setShowDropdown(s=>!s)}
              style={{ width:32,height:32,borderRadius:"50%",background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.75rem",cursor:"pointer" }}>
              {initials}
            </button>
            {showDropdown && (
              <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:14,padding:"0.75rem",width:220,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
                <div style={{ padding:"0.4rem 0.5rem 0.75rem",borderBottom:`1px solid ${bdr}`,marginBottom:"0.5rem" }}>
                  <div style={{ fontWeight:700,fontSize:"0.88rem" }}>Thiyang</div>
                  <div style={{ fontSize:"0.72rem",color:muted }}>{me.email||"admin@thiyang.com"}</div>
                </div>
                {[
                  { label:"Profile",       action:()=>{ navigate("/profile");       setShowDropdown(false); } },
                  { label:"Settings",      action:()=>{ navigate("/settings");      setShowDropdown(false); } },
                  { label:"Notifications", action:()=>{ navigate("/notifications"); setShowDropdown(false); }, badge:notifBadge },
                  { label:"Log out", action:()=>{ logout(); navigate("/login"); } },
                ].map(item=>(
                  <button key={item.label} onClick={item.action}
                    style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"0.55rem 0.5rem",background:"none",border:"none",color:txt,fontSize:"0.82rem",cursor:"pointer",borderRadius:8,textAlign:"left" }}>
                    {item.label}
                    {item.badge && <span style={{ background:"#22c55e",color:"#000",fontSize:"0.62rem",fontWeight:700,padding:"1px 7px",borderRadius:999 }}>{item.badge}</span>}
                  </button>
                ))}
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
