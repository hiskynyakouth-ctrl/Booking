import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


const NAV = [
  { label:"Dashboard",    icon:"🏠", to:"/dashboard" },
  { label:"Calendar",     icon:"📅", to:"/calendar"  },
  { label:"Messages",     icon:"💬", to:"/messages"  },
  { label:"Products",     icon:"🏷️", to:"/shop"      },
  { label:"Invoices",     icon:"🧾", to:"/invoices"  },
  { label:"Clients",      icon:"👥", to:"/clients"   },
  { label:"Availability", icon:"🔄", to:"/availability" },
  { label:"Booking Alert",icon:"🔔", to:"/bookings"  },
  { label:"Settings",     icon:"⚙️", to:"/settings"  },
];

const CLIENTS = [
  { id:1, name:"Hanna Tesfaye",    email:"hanna.tesfaye@gmail.com",    phone:"+251 91 234 5678", bookings:5, spent:"Br 320", avatar:"👩", status:"Active"   },
  { id:2, name:"Bekele Solomon",   email:"bekele.solomon@gmail.com",   phone:"+251 94 786 3441", bookings:3, spent:"Br 180", avatar:"👨", status:"Active"   },
  { id:3, name:"Marta Abebe",      email:"marta.abebe@gmail.com",      phone:"+251 96 555 1122", bookings:8, spent:"Br 540", avatar:"👩", status:"Active"   },
  { id:4, name:"Lulit Ayele",      email:"lulit.ayele@gmail.com",      phone:"+251 98 322 9988", bookings:1, spent:"Br 60",  avatar:"👩", status:"Inactive" },
  { id:5, name:"Samuel Alem",      email:"samuel.alem@gmail.com",      phone:"+251 92 613 7700", bookings:6, spent:"Br 410", avatar:"👨", status:"Active"   },
];

export default function Clients() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const filtered = CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search));

  const S = {
    root:    { display:"flex", height:"100vh", background:"#0f1117", color:"#fff", fontFamily:"Inter,system-ui,sans-serif", overflow:"hidden" },
    sidebar: { width:190, background:"#141720", display:"flex", flexDirection:"column", padding:"1.25rem 0.75rem", gap:2, flexShrink:0, borderRight:"1px solid #1e2130" },
    navItem: { display:"flex", alignItems:"center", gap:10, padding:"0.55rem 0.75rem", borderRadius:8, fontSize:"0.8rem", color:"#6b7280", cursor:"pointer", textDecoration:"none" },
    navActive:{ background:"#1e2130", color:"#fff", fontWeight:600 },
  };

  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 0.5rem", marginBottom:"1.5rem" }}>
          <div style={{ width:28, height:28, background:"linear-gradient(135deg,#6366f1,#3b82f6)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>📌</div>
          <span style={{ fontWeight:700, fontSize:"0.95rem" }}>Appoint_X</span>
        </div>
        {NAV.map(item => (
          <Link key={item.label} to={item.to} style={{ ...S.navItem, ...(location.pathname===item.to ? S.navActive : {}) }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </aside>

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid #1e2130", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h1 style={{ fontSize:"1.1rem", fontWeight:700 }}>Clients</h1>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
            style={{ background:"#1e2130", border:"none", borderRadius:10, padding:"0.5rem 1rem", color:"#fff", fontSize:"0.82rem", outline:"none", width:220 }} />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"1.25rem 1.5rem" }}>
          <div className="table-scroll">
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.82rem", minWidth:600 }}>
            <thead>
              <tr style={{ color:"#6b7280", borderBottom:"1px solid #1e2130" }}>
                {["Client","Email","Phone","Bookings","Spent","Status"].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"0.5rem 0.75rem", fontWeight:500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom:"1px solid #1a1f2e" }}>
                  <td style={{ padding:"0.75rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:"#2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>{c.avatar}</div>
                      <span style={{ fontWeight:600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"0.75rem", color:"#6b7280" }}>{c.email}</td>
                  <td style={{ padding:"0.75rem", color:"#6b7280" }}>{c.phone}</td>
                  <td style={{ padding:"0.75rem" }}>{c.bookings}</td>
                  <td style={{ padding:"0.75rem", color:"#22c55e", fontWeight:600 }}>{c.spent}</td>
                  <td style={{ padding:"0.75rem" }}>
                    <span style={{ fontSize:"0.72rem", fontWeight:600, color: c.status==="Active" ? "#22c55e" : "#6b7280", background: c.status==="Active" ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)", padding:"3px 10px", borderRadius:999 }}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
