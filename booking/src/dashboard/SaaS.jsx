import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "../services/userService";
import { getAllBookings } from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SaaS() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [users,    setUsers]    = useState([]);
  const [bookings, setBookings] = useState([]);
  const [metric,   setMetric]   = useState("bookings");

  useEffect(() => {
    setUsers((getAllUsers() || []).filter(u => u && u.role !== "admin"));
    setBookings((getAllBookings() || []).filter(Boolean));
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const totalRevenue = bookings.filter(b=>b.paymentStatus==="verified").reduce((s,b)=>s+Number(b.price||0),0);
  const activeUsers  = users.filter(u=>u.status==="Active"||!u.status).length;
  const churnRate    = users.length > 0 ? ((users.filter(u=>u.status==="Inactive").length/users.length)*100).toFixed(1) : 0;

  const mrrData = MONTHS.map((m,i) => ({
    m,
    bookings: bookings.filter(b=>new Date(b.createdAt||Date.now()).getMonth()===i).length,
    revenue:  bookings.filter(b=>new Date(b.createdAt||Date.now()).getMonth()===i&&b.paymentStatus==="verified").reduce((s,b)=>s+Number(b.price||0),0),
    users:    users.filter(u=>new Date(u.createdAt||Date.now()).getMonth()===i).length,
  }));

  const planData = [
    { name:"Customer", value:users.filter(u=>u.role==="customer").length,  color:"#22c55e" },
    { name:"Business", value:users.filter(u=>u.role==="business").length,  color:"#3b82f6" },
  ].filter(p=>p.value>0);

  const STATS = [
    { label:"Total Revenue",  value:`Br ${totalRevenue.toLocaleString()}`, color:"#22c55e" },
    { label:"Active Users",   value:activeUsers.toString(),                 color:"#3b82f6" },
    { label:"Churn Rate",     value:`${churnRate}%`,                        color:"#f59e0b" },
    { label:"Total Bookings", value:bookings.length.toString(),             color:"#8b5cf6" },
  ];

  const hasData = users.length > 0 || bookings.length > 0;

  return (
    <DashboardLayout title="SaaS" subtitle="Monitor subscription metrics and revenue growth.">
      <div style={{ padding:"1.25rem" }}>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"0.75rem", marginBottom:"1rem" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.4rem", fontWeight:800, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {!hasData ? (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>☁️</div>
            <h3 style={{ color:txt, marginBottom:"0.5rem" }}>No SaaS data yet</h3>
            <p style={{ color:muted, fontSize:"0.85rem" }}>Metrics will populate as users sign up and make bookings.</p>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:"0.75rem", marginBottom:"0.75rem" }}>
              <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                  <div><div style={{ fontWeight:700, fontSize:"0.88rem" }}>Growth Metrics</div></div>
                  <div style={{ display:"flex", gap:4 }}>
                    {["bookings","revenue","users"].map(m=>(
                      <button key={m} onClick={()=>setMetric(m)} style={{ padding:"0.25rem 0.6rem", borderRadius:6, border:"none", fontSize:"0.68rem", background:metric===m?"#22c55e":sub, color:metric===m?"#000":muted, cursor:"pointer", fontWeight:metric===m?700:400, textTransform:"capitalize" }}>{m}</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="saasG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
                    <XAxis dataKey="m" tick={{ fontSize:9, fill:muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:9, fill:muted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:dark?"#111318":"#fff", border:`1px solid ${bdr}`, borderRadius:8, fontSize:11 }} />
                    <Area type="monotone" dataKey={metric} stroke="#22c55e" fill="url(#saasG)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.25rem" }}>User Distribution</div>
                <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.75rem" }}>By role type</div>
                {planData.length > 0 ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:"0.75rem" }}>
                      <ResponsiveContainer width={100} height={100}>
                        <PieChart>
                          <Pie data={planData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" strokeWidth={0}>
                            {planData.map((p,i)=><Cell key={i} fill={p.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {planData.map(p=>(
                      <div key={p.name} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", marginBottom:"0.3rem" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:7, height:7, borderRadius:"50%", background:p.color, display:"inline-block" }} />{p.name}
                        </span>
                        <span style={{ fontWeight:600 }}>{p.value}</span>
                      </div>
                    ))}
                  </>
                ) : <p style={{ color:muted, fontSize:"0.78rem" }}>No users yet</p>}
              </div>
            </div>

            {/* Subscriptions */}
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem" }}>Active Users</div>
                <button onClick={()=>navigate("/customers")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.3rem 0.75rem", borderRadius:8, cursor:"pointer" }}>View All</button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:400 }}>
                  <thead><tr style={{ color:muted, borderBottom:`1px solid ${bdr}` }}>
                    {["User","Role","Joined","Bookings"].map(h=><th key={h} style={{ textAlign:"left", padding:"0.4rem 0.5rem", fontWeight:500, fontSize:"0.72rem" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {users.slice(0,5).map(u=>(
                      <tr key={u.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                        <td style={{ padding:"0.55rem 0.5rem" }}>
                          <div style={{ fontWeight:600, fontSize:"0.82rem" }}>{u.name}</div>
                          <div style={{ color:muted, fontSize:"0.68rem" }}>{u.email}</div>
                        </td>
                        <td style={{ padding:"0.55rem 0.5rem", color:muted, textTransform:"capitalize" }}>{u.role||"customer"}</td>
                        <td style={{ padding:"0.55rem 0.5rem", color:muted, fontSize:"0.75rem" }}>{u.joined||"—"}</td>
                        <td style={{ padding:"0.55rem 0.5rem" }}>{bookings.filter(b=>String(b.userId)===String(u.id)).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
