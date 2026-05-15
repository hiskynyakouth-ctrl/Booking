import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getOrders } from "../services/orderService";
import DashboardLayout from "../layouts/DashboardLayout";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const statusColor = { Completed:"#22c55e", Processing:"#3b82f6", Refunded:"#f59e0b", Cancelled:"#ef4444", Pending:"#f59e0b" };
const statusBg    = { Completed:"rgba(34,197,94,0.15)", Processing:"rgba(59,130,246,0.15)", Refunded:"rgba(245,158,11,0.15)", Cancelled:"rgba(239,68,68,0.15)", Pending:"rgba(245,158,11,0.15)" };

export default function Ecommerce() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [orders, setOrders] = useState([]);

  useEffect(() => { setOrders((getOrders() || []).filter(Boolean)); }, []);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const totalRevenue = orders.filter(o=>o.status==="Completed").reduce((s,o)=>s+Number(o.amount||0),0);
  const totalOrders  = orders.length;
  const avgOrder     = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesData = MONTHS.map((m,i) => ({
    m,
    v: orders.filter(o=>new Date(o.createdAt||Date.now()).getMonth()===i).reduce((s,o)=>s+Number(o.amount||0),0),
  }));

  const statusCounts = ["Completed","Processing","Pending","Cancelled"].map(s=>({
    name:s, value:orders.filter(o=>o.status===s).length, color:statusColor[s],
  })).filter(s=>s.value>0);

  const STATS = [
    { label:"Total Revenue",   value:`Br ${totalRevenue.toLocaleString()}` },
    { label:"Total Orders",    value:totalOrders.toString()                 },
    { label:"Avg Order Value", value:`Br ${avgOrder.toFixed(0)}`            },
    { label:"Completed",       value:orders.filter(o=>o.status==="Completed").length.toString() },
  ];

  return (
    <DashboardLayout title="eCommerce" subtitle="Monitor your store performance and key metrics.">
      <div style={{ padding:"1.25rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.75rem", marginBottom:"1rem" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ fontSize:"1.4rem", fontWeight:800 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🛍️</div>
            <h3 style={{ color:txt, marginBottom:"0.5rem" }}>No orders yet</h3>
            <p style={{ color:muted, fontSize:"0.85rem", marginBottom:"1.5rem" }}>Orders will appear here as customers make purchases.</p>
            <button onClick={()=>navigate("/orders")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.6rem 1.5rem", borderRadius:10, cursor:"pointer" }}>
              View Orders
            </button>
          </div>
        ) : (
          <>
            {/* Sales chart + Status */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:"0.75rem", marginBottom:"0.75rem" }}>
              <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.25rem" }}>Sales Over Time</div>
                <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.75rem" }}>Based on completed transactions</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="ecGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
                    <XAxis dataKey="m" tick={{ fontSize:9, fill:muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:9, fill:muted }} axisLine={false} tickLine={false} tickFormatter={v=>`Br ${v/1000}k`} />
                    <Tooltip contentStyle={{ background:dark?"#111318":"#fff", border:`1px solid ${bdr}`, borderRadius:8, fontSize:11 }} formatter={v=>[`Br ${v.toLocaleString()}`]} />
                    <Area type="monotone" dataKey="v" stroke="#22c55e" fill="url(#ecGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.25rem" }}>Order Status</div>
                <div style={{ fontSize:"0.68rem", color:muted, marginBottom:"0.75rem" }}>Distribution of order statuses</div>
                {statusCounts.length > 0 ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:"0.75rem" }}>
                      <ResponsiveContainer width={100} height={100}>
                        <PieChart>
                          <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" strokeWidth={0}>
                            {statusCounts.map((s,i)=><Cell key={i} fill={s.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {statusCounts.map(s=>(
                      <div key={s.name} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", marginBottom:"0.3rem" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:7, height:7, borderRadius:"50%", background:s.color, display:"inline-block" }} />{s.name}
                        </span>
                        <span style={{ fontWeight:600 }}>{Math.round(s.value/totalOrders*100)}%</span>
                      </div>
                    ))}
                  </>
                ) : <p style={{ color:muted, fontSize:"0.78rem" }}>No status data</p>}
              </div>
            </div>

            {/* Recent orders */}
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                <div><div style={{ fontWeight:700, fontSize:"0.88rem" }}>Recent Transactions</div></div>
                <button onClick={()=>navigate("/orders")} style={{ background:"none", border:`1px solid ${bdr}`, color:muted, fontSize:"0.72rem", padding:"0.3rem 0.75rem", borderRadius:8, cursor:"pointer" }}>View All</button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:500 }}>
                  <thead><tr style={{ color:muted, borderBottom:`1px solid ${bdr}` }}>
                    {["Order","Customer","Amount","Status","Date"].map(h=><th key={h} style={{ textAlign:"left", padding:"0.35rem 0.5rem", fontWeight:500, fontSize:"0.72rem" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {orders.slice(0,6).map(o=>(
                      <tr key={o.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                        <td style={{ padding:"0.55rem 0.5rem", color:muted, fontFamily:"monospace", fontSize:"0.72rem" }}>{o.id}</td>
                        <td style={{ padding:"0.55rem 0.5rem", fontWeight:500 }}>{o.customer||"—"}</td>
                        <td style={{ padding:"0.55rem 0.5rem", fontWeight:700, color:"#22c55e" }}>Br {Number(o.amount||0).toLocaleString()}</td>
                        <td style={{ padding:"0.55rem 0.5rem" }}>
                          <span style={{ fontSize:"0.7rem", fontWeight:600, color:statusColor[o.status]||muted, background:statusBg[o.status]||"transparent", padding:"2px 8px", borderRadius:999 }}>{o.status||"—"}</span>
                        </td>
                        <td style={{ padding:"0.55rem 0.5rem", color:muted, fontSize:"0.72rem" }}>{o.date||"—"}</td>
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
