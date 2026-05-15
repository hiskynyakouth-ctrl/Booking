import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "../services/userService";
import { getAllBookings } from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";

export default function CRM() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [users,    setUsers]    = useState([]);
  const [bookings, setBookings] = useState([]);
  const [view,     setView]     = useState("contacts");
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    setUsers((getAllUsers() || []).filter(u => u && u.role !== "admin"));
    setBookings((getAllBookings() || []).filter(Boolean));
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const filteredUsers = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.includes(search));

  const STATS = [
    { label:"Total Contacts", value:users.length,                                              color:"#22c55e" },
    { label:"Active",         value:users.filter(u=>u.status==="Active"||!u.status).length,    color:"#3b82f6" },
    { label:"Total Bookings", value:bookings.length,                                            color:"#f59e0b" },
    { label:"Pipeline Value", value:`Br ${bookings.reduce((s,b)=>s+Number(b.price||0),0).toLocaleString()}`, color:"#8b5cf6" },
  ];

  const viewActions = (
    <div style={{ display:"flex", gap:4, background:sub, borderRadius:8, padding:3 }}>
      {["contacts","bookings"].map(v=>(
        <button key={v} onClick={()=>setView(v)} style={{ padding:"0.3rem 0.75rem", borderRadius:6, border:"none", fontSize:"0.72rem", background:view===v?(dark?"#1e2330":"#fff"):"transparent", color:view===v?txt:muted, fontWeight:view===v?700:400, cursor:"pointer", textTransform:"capitalize" }}>{v}</button>
      ))}
    </div>
  );

  return (
    <DashboardLayout title="CRM" subtitle="Manage your sales pipeline and contacts." actions={viewActions}>
      <div style={{ padding:"1.25rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1.25rem" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {users.length === 0 && bookings.length === 0 ? (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>👥</div>
            <h3 style={{ color:txt, marginBottom:"0.5rem" }}>No contacts yet</h3>
            <p style={{ color:muted, fontSize:"0.85rem" }}>Contacts will appear here as users sign up and make bookings.</p>
          </div>
        ) : view === "contacts" ? (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ padding:"0.85rem 1rem", borderBottom:`1px solid ${bdr}`, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:sub, borderRadius:10, padding:"0.4rem 0.8rem", flex:1, maxWidth:280 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts..." style={{ background:"transparent", border:"none", outline:"none", color:txt, fontSize:"0.78rem", width:"100%" }} />
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:500 }}>
                <thead><tr style={{ color:muted, borderBottom:`1px solid ${bdr}`, background:dark?"#0d1117":"#f9fafb" }}>
                  {["Contact","Email","Role","Joined","Bookings"].map(h=><th key={h} style={{ textAlign:"left", padding:"0.55rem 0.75rem", fontWeight:500, fontSize:"0.72rem" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredUsers.length===0 ? (
                    <tr><td colSpan={5} style={{ textAlign:"center", padding:"2rem", color:muted }}>No contacts found</td></tr>
                  ) : filteredUsers.map(u=>(
                    <tr key={u.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:30, height:30, borderRadius:"50%", background:u.color||"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.68rem", fontWeight:700, color:"#000", flexShrink:0 }}>
                            {u.name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()||"U"}
                          </div>
                          <span style={{ fontWeight:600, fontSize:"0.82rem" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.75rem" }}>{u.email}</td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, textTransform:"capitalize" }}>{u.role||"customer"}</td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.75rem" }}>{u.joined||"—"}</td>
                      <td style={{ padding:"0.65rem 0.75rem" }}>{bookings.filter(b=>String(b.userId)===String(u.id)).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ padding:"0.85rem 1rem", borderBottom:`1px solid ${bdr}`, fontWeight:700, fontSize:"0.9rem" }}>All Bookings</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:500 }}>
                <thead><tr style={{ color:muted, borderBottom:`1px solid ${bdr}`, background:dark?"#0d1117":"#f9fafb" }}>
                  {["Customer","Service","Date","Price","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"0.55rem 0.75rem", fontWeight:500, fontSize:"0.72rem" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {bookings.length===0 ? (
                    <tr><td colSpan={5} style={{ textAlign:"center", padding:"2rem", color:muted }}>No bookings yet</td></tr>
                  ) : bookings.map(b=>(
                    <tr key={b.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                      <td style={{ padding:"0.65rem 0.75rem", fontWeight:600 }}>{b.userName||"—"}</td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted }}>{b.service||"—"}</td>
                      <td style={{ padding:"0.65rem 0.75rem", color:muted, fontSize:"0.75rem" }}>{b.date||"—"}</td>
                      <td style={{ padding:"0.65rem 0.75rem", fontWeight:700, color:"#22c55e" }}>Br {Number(b.price||0).toLocaleString()}</td>
                      <td style={{ padding:"0.65rem 0.75rem" }}>
                        <span style={{ fontSize:"0.7rem", fontWeight:600, color:b.status==="confirmed"?"#22c55e":b.status==="cancelled"?"#ef4444":"#f59e0b", background:b.status==="confirmed"?"rgba(34,197,94,0.12)":b.status==="cancelled"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)", padding:"3px 10px", borderRadius:999, textTransform:"capitalize" }}>{b.status||"pending"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
