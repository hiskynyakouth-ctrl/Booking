import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getAllBookings } from "../services/bookingService";
import { getAllUsers } from "../services/userService";
import { getOrders } from "../services/orderService";
import DashboardLayout from "../layouts/DashboardLayout";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Analytics() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);

  useEffect(() => {
    setBookings((getAllBookings() || []).filter(Boolean));
    setUsers((getAllUsers() || []).filter(Boolean));
    setOrders((getOrders() || []).filter(Boolean));
  }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  // Build monthly data from real bookings
  const monthlyData = MONTHS.map((m, i) => {
    const monthBookings = bookings.filter(b => new Date(b.createdAt||Date.now()).getMonth()===i);
    const monthUsers    = users.filter(u => new Date(u.createdAt||Date.now()).getMonth()===i);
    const monthOrders   = orders.filter(o => new Date(o.createdAt||Date.now()).getMonth()===i);
    return { m, bookings:monthBookings.length, users:monthUsers.length, orders:monthOrders.length };
  });

  const hasData = bookings.length > 0 || users.length > 0 || orders.length > 0;

  const STATS = [
    { label:"Total Bookings",  value:bookings.length,                                              color:"#22c55e" },
    { label:"Total Users",     value:users.length,                                                  color:"#3b82f6" },
    { label:"Total Orders",    value:orders.length,                                                  color:"#f59e0b" },
    { label:"Completed",       value:bookings.filter(b=>b.status==="completed").length,              color:"#8b5cf6" },
  ];

  const topPages = [
    { page:"/booking",  views:bookings.length,  bounce:"—" },
    { page:"/shop",     views:orders.length,     bounce:"—" },
    { page:"/explore",  views:users.length,      bounce:"—" },
  ].filter(p => p.views > 0);

  return (
    <DashboardLayout title="Analytics" subtitle="Track your business performance and key metrics.">
      <div style={{ padding:"1.25rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"1.25rem" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.1rem" }}>
              <div style={{ fontSize:"0.72rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.6rem", fontWeight:800, color:s.color }}>{s.value}</div>
              {s.value === 0 && <div style={{ fontSize:"0.68rem", color:muted, marginTop:2 }}>No data yet</div>}
            </div>
          ))}
        </div>

        {!hasData ? (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📊</div>
            <h3 style={{ color:txt, marginBottom:"0.5rem" }}>No analytics data yet</h3>
            <p style={{ color:muted, fontSize:"0.85rem" }}>Analytics will populate as users sign up, make bookings, and place orders.</p>
          </div>
        ) : (
          <>
            {/* Activity chart */}
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem", marginBottom:"1.25rem" }}>
              <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"0.25rem" }}>Monthly Activity</div>
              <div style={{ fontSize:"0.72rem", color:muted, marginBottom:"1rem" }}>Bookings, users and orders over time</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
                  <XAxis dataKey="m" tick={{ fontSize:10, fill:muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background:dark?"#111318":"#fff", border:`1px solid ${bdr}`, borderRadius:8, fontSize:11 }} />
                  <Area type="monotone" dataKey="bookings" stroke="#22c55e" fill="url(#aGrad)" strokeWidth={2} dot={false} name="Bookings" />
                  <Area type="monotone" dataKey="users"    stroke="#3b82f6" fill="none"          strokeWidth={2} dot={false} name="Users" />
                  <Area type="monotone" dataKey="orders"   stroke="#f59e0b" fill="none"          strokeWidth={2} dot={false} name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top pages */}
            {topPages.length > 0 && (
              <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Top Pages</div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem" }}>
                  <thead><tr style={{ color:muted, borderBottom:`1px solid ${bdr}` }}>
                    {["Page","Activity"].map(h=><th key={h} style={{ textAlign:"left", padding:"0.4rem 0.5rem", fontWeight:500 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {topPages.map((p,i)=>(
                      <tr key={i} style={{ borderBottom:`1px solid ${bdr}` }}>
                        <td style={{ padding:"0.55rem 0.5rem", color:"#22c55e", fontFamily:"monospace", fontSize:"0.78rem" }}>{p.page}</td>
                        <td style={{ padding:"0.55rem 0.5rem", fontWeight:600 }}>{p.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
