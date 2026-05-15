import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAllUsers } from "../services/authService";
import { getOrders } from "../services/orderService";
import { getAllPayments } from "../services/paymentService";
import { getAllBookings } from "../services/bookingService";
import { clearAllData } from "../utils/clearData";

const trafficSources = [
  { name:"Direct",   value:38, color:"#22c55e" },
  { name:"Organic",  value:27, color:"#3b82f6" },
  { name:"Referral", value:22, color:"#f59e0b" },
  { name:"Social",   value:13, color:"#8b5cf6" },
];

const statusColor = { Completed:"#22c55e", Processing:"#3b82f6", Pending:"#f59e0b", Cancelled:"#ef4444" };
const statusBg    = { Completed:"rgba(34,197,94,0.12)", Processing:"rgba(59,130,246,0.12)", Pending:"rgba(245,158,11,0.12)", Cancelled:"rgba(239,68,68,0.12)" };

const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(0)}k` : `${n}`;
const formatBirr = (amount) => `Br ${Number(amount || 0).toLocaleString("en-ET", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [search,      setSearch]      = useState("");
  const [overviewTab, setOverviewTab] = useState("revenue");
  const [notifications]               = useState(4);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allUsers    = (getAllUsers()    || []).filter(Boolean);
    const allOrders   = (getOrders()      || []).filter(Boolean);
    const allBookings = (getAllBookings() || []).filter(Boolean);
    setUsers(allUsers);
    setOrders(allOrders);
    setBookings(allBookings);

    getAllPayments()
      .then(p => setPayments(p || []))
      .catch(() => setPayments([]));
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const totalRevenue    = [
    ...payments.filter(p => p.status === "paid"),
    ...bookings.filter(b => b.paymentStatus === "verified"),
  ].reduce((sum, p) => sum + Number(p.amount || p.price || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalPayments = payments.length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;

  const overviewData = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month, index) => {
    // Combine payments + bookings for revenue data
    const allRevenue = [
      ...payments.filter(p => p.status === "paid"),
      ...bookings.filter(b => b.paymentStatus === "verified"),
    ];
    const monthItems = allRevenue.filter(p => {
      const date = new Date(p.createdAt || Date.now());
      return date.getMonth() === index;
    });
    const monthOrders = orders.filter(o => {
      const date = new Date(o.createdAt || o.date || Date.now());
      return date.getMonth() === index;
    });
    return {
      m: month,
      revenue: monthItems.reduce((sum, p) => sum + Number(p.amount || p.price || 0), 0),
      orders:  monthOrders.length,
      month:   monthOrders.length,
    };
  });

  const STATS = [
    { label:"Total Revenue",  value: totalRevenue > 0 ? formatBirr(totalRevenue) : "Br 0.00",  change: totalRevenue > 0 ? "↑ from payments" : "No payments yet",  up:totalRevenue>0,  color:"#22c55e" },
    { label:"Active Users",   value: totalUsers > 0 ? totalUsers.toString() : "0",              change: totalUsers > 0 ? `${totalUsers} registered` : "No users yet",  up:totalUsers>0,    color:"#3b82f6" },
    { label:"Total Bookings", value: bookings.length > 0 ? bookings.length.toString() : "0",   change: bookings.length > 0 ? `${bookings.filter(b=>b.status==="confirmed").length} confirmed` : "No bookings yet", up:bookings.length>0, color:"#f59e0b" },
    { label:"Transactions",   value: totalPayments > 0 ? totalPayments.toString() : "0",        change: totalPayments > 0 ? `${payments.filter(p=>p.status==="paid").length} paid` : "No transactions yet", up:totalPayments>0, color:"#8b5cf6" },
  ];

  const goals = [
    { label:"Monthly Revenue", current: totalRevenue, target:80000, color:"#22c55e" },
    { label:"New Customers",   current: totalUsers,   target:100,  color:"#3b82f6" },
    { label:"Pending Orders", current: orders.filter(o => o.status === "Pending").length, target:20, color:"#8b5cf6", pct:false },
  ];

  const dashboardActions = (
    <>
      <div style={{ display:"flex",alignItems:"center",gap:8,background:sub,borderRadius:10,padding:"0.45rem 0.9rem",maxWidth:280 }}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything..."
          style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
        <span style={{ fontSize:"0.65rem",color:muted,background:sub,padding:"1px 6px",borderRadius:4,border:`1px solid ${bdr}` }}>⌘K</span>
      </div>
      <button onClick={() => navigate("/booking")} style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.45rem 1rem",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap" }}>
        + New Order
      </button>
      <button onClick={async () => { if(window.confirm("Delete ALL payments, bookings, orders and notifications? This cannot be undone.")) { await clearAllData(); window.location.reload(); } }} style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"0.72rem",padding:"0.35rem 0.75rem",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap" }} title="Reset all data">
        Reset Data
      </button>
      <button onClick={() => navigate("/messages")} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1.1rem",width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
        🔔
        {notifications > 0 && <span style={{ position:"absolute",top:4,right:4,width:8,height:8,background:"#ef4444",borderRadius:"50%",border:`2px solid ${card}` }} />}
      </button>
    </>
  );

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Thiyang. Here's what's happening with your business today." actions={dashboardActions}>
      <div style={{ padding:"1.5rem" }}>

        {/* Stat cards */}
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.1rem", overflow:"hidden", transition:"background 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem" }}>
                <div style={{ fontSize:"0.72rem", color:muted }}>{s.label}</div>
                <div style={{ width:28, height:28, background:s.color+"18", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem" }}>💰</div>
              </div>
              <div style={{ fontSize:"1.6rem", fontWeight:800, marginBottom:"0.25rem" }}>{s.value}</div>
              <div style={{ fontSize:"0.72rem", color: s.up ? "#22c55e" : "#ef4444", marginBottom:"0.5rem" }}>
                {s.up ? "↑" : "↓"} {s.change} vs last month
              </div>
              <div style={{ height:40, marginLeft:-8, marginRight:-8 }}>
                <ResponsiveContainer width="100%" height={40}>
                  <AreaChart data={s.data}>
                    <defs>
                      <linearGradient id={`g${s.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={s.color} fill={`url(#g${s.label})`} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Overview + Traffic */}
        <div className="mid-row" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem", marginBottom:"1.5rem" }}>
          {/* Overview chart */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", transition:"background 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.25rem" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.95rem" }}>Overview</div>
                <div style={{ fontSize:"0.72rem", color:muted }}>Weekly performance for the current year</div>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {["revenue","orders","month"].map(tab => (
                  <button key={tab} onClick={() => setOverviewTab(tab)}
                    style={{ padding:"0.3rem 0.75rem", borderRadius:8, border:"none", fontSize:"0.72rem", cursor:"pointer", fontWeight: overviewTab===tab ? 700 : 400, background: overviewTab===tab ? "#22c55e" : sub, color: overviewTab===tab ? "#000" : muted, transition:"all 0.15s", textTransform:"capitalize" }}>
                    {tab === "revenue" ? "Revenue" : tab === "orders" ? "Orders" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={overviewData}>
                <defs>
                  <linearGradient id="ovGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fontSize:10, fill:muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:muted }} axisLine={false} tickLine={false} tickFormatter={v => overviewTab==="revenue" ? fmt(v) : v} />
                <Tooltip contentStyle={{ background:dark?"#111318":"#fff", border:`1px solid ${bdr}`, borderRadius:8, fontSize:11 }} />
                <Area type="monotone" dataKey={overviewTab} stroke="#22c55e" fill="url(#ovGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", transition:"background 0.2s" }}>
            <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:"0.25rem" }}>Traffic Sources</div>
            <div style={{ fontSize:"0.72rem", color:muted, marginBottom:"1rem" }}>Where your visitors come from</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem" }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {trafficSources.map((s,i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:dark?"#111318":"#fff", border:`1px solid ${bdr}`, borderRadius:8, fontSize:11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {trafficSources.map(s => (
              <div key={s.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem", fontSize:"0.78rem" }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:s.color, display:"inline-block" }} />
                  {s.name}
                </span>
                <span style={{ fontWeight:600 }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Goals */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", marginBottom:"1.5rem", transition:"background 0.2s" }}>
          <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:"0.25rem" }}>Monthly Goals</div>
          <div style={{ fontSize:"0.72rem", color:muted, marginBottom:"1rem" }}>Track progress toward targets</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {goals.map(g => {
              const pct = Math.min((g.current / g.target) * 100, 100);
              return (
                <div key={g.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", marginBottom:"0.3rem" }}>
                    <span style={{ fontWeight:600 }}>{g.label}</span>
                    <span style={{ color:muted }}>{g.pct ? `${g.current}%` : g.current.toLocaleString()} <span style={{ color:muted }}>/ Target: {g.pct ? `${g.target}%` : g.target.toLocaleString()}</span></span>
                  </div>
                  <div style={{ height:6, background:sub, borderRadius:999, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:g.color, borderRadius:999, transition:"width 0.5s" }} />
                  </div>
                  <div style={{ fontSize:"0.65rem", color:muted, marginTop:"0.2rem", textAlign:"right" }}>{pct.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", marginBottom:"1.5rem", transition:"background 0.2s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:"0.95rem" }}>Recent Users</div>
              <div style={{ fontSize:"0.72rem", color:muted }}>New clients and users with recent activity</div>
            </div>
            <button onClick={() => navigate("/users")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.3rem 0.75rem", borderRadius:8, cursor:"pointer" }}>View All</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {users.length > 0 ? users.filter(Boolean).map((user) => (
              <div key={user.id} style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"#3b82f622", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", flexShrink:0 }}>
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:"0.78rem" }}>{user.name || "Unknown"}</div>
                  <div style={{ fontSize:"0.68rem", color:muted }}>{user.email || "No email"}</div>
                </div>
                <div style={{ fontSize:"0.7rem", fontWeight:600, color:user.role === "admin" ? "#ef4444" : "#22c55e", background:user.role === "admin" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", padding:"2px 8px", borderRadius:999 }}>
                  {user.role || "user"}
                </div>
              </div>
            )) : (
              <div style={{ fontSize:"0.78rem", color:muted, textAlign:"center", padding:"1rem" }}>No recent users</div>
            )}
          </div>
        </div>

        {/* Recent Orders + Activity */}
        <div className="mid-row" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem" }}>
          {/* Recent Orders */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", transition:"background 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.95rem" }}>Recent Orders</div>
                <div style={{ fontSize:"0.72rem", color:muted }}>Latest transactions from your store</div>
              </div>
              <button onClick={() => navigate("/bookings")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.3rem 0.75rem", borderRadius:8, cursor:"pointer" }}>View All</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:500 }}>
                <thead>
                  <tr style={{ color:muted, borderBottom:`1px solid ${bdr}` }}>
                    {["Customer","Order ID","Product","Status","Amount"].map(h => (
                      <th key={h} style={{ textAlign:"left", padding:"0.4rem 0.5rem", fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign:"center", padding:"2rem", color:muted }}>No orders yet. New orders will appear here.</td></tr>
                  ) : orders.filter(o => !search || o.customer?.toLowerCase().includes(search.toLowerCase())).map(o => (
                    <tr key={o.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                      <td style={{ padding:"0.6rem 0.5rem" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:"#22c55e22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", flexShrink:0 }}>
                            {o.customer?.[0] || "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:"0.78rem" }}>{o.customer || "Unknown"}</div>
                            <div style={{ color:muted, fontSize:"0.65rem" }}>{o.email || "No email"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"0.6rem 0.5rem", color:muted }}>{o.id}</td>
                      <td style={{ padding:"0.6rem 0.5rem" }}>{o.product || "Service"}</td>
                      <td style={{ padding:"0.6rem 0.5rem" }}>
                        <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[o.status], background:statusBg[o.status], padding:"2px 8px", borderRadius:999 }}>{o.status || "Pending"}</span>
                      </td>
                      <td style={{ padding:"0.6rem 0.5rem", fontWeight:700, color:"#22c55e" }}>{formatBirr(o.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", transition:"background 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.95rem" }}>Recent Activity</div>
                <div style={{ fontSize:"0.72rem", color:muted }}>Latest events from your store</div>
              </div>
              <button onClick={() => navigate("/messages")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.3rem 0.75rem", borderRadius:8, cursor:"pointer" }}>View All</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {payments.length === 0 && orders.length === 0 ? (
                <div style={{ textAlign:"center", color:muted, padding:"2rem 0" }}>No recent activity yet. New orders or payments will appear here.</div>
              ) : (
                [
                  ...payments.slice(0, 3).map((p) => ({ icon:"💳", text:`Payment ${p.status}`, sub:`${p.userName || 'Customer'} paid ${formatBirr(p.amount)}`, time: new Date(p.createdAt || Date.now()).toLocaleDateString() })),
                  ...orders.slice(0, 3).map((o) => ({ icon:"🛒", text:`Order ${o.status || 'Pending'}`, sub:`${o.customer || 'Customer'} booked ${o.product || 'service'}`, time: o.date || '' })),
                ]
                  .slice(0, 4)
                  .map((a,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:sub, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{a.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:"0.78rem" }}>{a.text}</div>
                        <div style={{ fontSize:"0.68rem", color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.sub}</div>
                        <div style={{ fontSize:"0.65rem", color:muted, marginTop:2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
