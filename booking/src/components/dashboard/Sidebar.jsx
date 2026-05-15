import { Link, useLocation } from "react-router-dom";

const NAV = [
  { label:"Dashboard",    icon:"🏠", to:"/dashboard"    },
  { label:"Calendar",     icon:"📅", to:"/calendar"     },
  { label:"Messages",     icon:"💬", to:"/messages"     },
  { label:"Shop",         icon:"🏷️", to:"/shop"         },
  { label:"Invoices",     icon:"🧾", to:"/invoices"     },
  { label:"Clients",      icon:"👥", to:"/clients"      },
  { label:"Availability", icon:"🔄", to:"/availability" },
  { label:"Bookings",     icon:"🔔", to:"/bookings"     },
  { label:"Settings",     icon:"⚙️", to:"/settings"     },
];

export default function Sidebar({ collapsed = false }) {
  const location = useLocation();
  return (
    <aside style={{
      width: collapsed ? 56 : 190,
      background: "#141720",
      display: "flex",
      flexDirection: "column",
      padding: collapsed ? "1.25rem 0.5rem" : "1.25rem 0.75rem",
      gap: 2,
      flexShrink: 0,
      borderRight: "1px solid #1e2130",
      transition: "width 0.2s",
      overflow: "hidden",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 0.5rem", marginBottom:"1.5rem" }}>
        <div style={{ width:28, height:28, background:"linear-gradient(135deg,#6366f1,#3b82f6)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>📌</div>
        {!collapsed && <span style={{ fontWeight:700, fontSize:"0.95rem", color:"#fff", whiteSpace:"nowrap" }}>Appoint_X</span>}
      </div>
      {NAV.map(item => {
        const active = location.pathname === item.to;
        return (
          <Link key={item.label} to={item.to} style={{
            display:"flex", alignItems:"center", gap:10,
            padding: collapsed ? "0.55rem" : "0.55rem 0.75rem",
            borderRadius:8, fontSize:"0.8rem",
            color: active ? "#fff" : "#6b7280",
            background: active ? "#1e2130" : "transparent",
            fontWeight: active ? 600 : 400,
            textDecoration:"none", transition:"all 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <span style={{ fontSize:"0.9rem", flexShrink:0 }}>{item.icon}</span>
            {!collapsed && item.label}
          </Link>
        );
      })}
    </aside>
  );
}
