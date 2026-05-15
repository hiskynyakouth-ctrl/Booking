import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis,
  ComposedChart, Bar, Area, Line, Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";

const radarData = [
  { subject:"Frontend", A:120, B:110 },
  { subject:"Backend",  A:98,  B:130 },
  { subject:"Design",   A:86,  B:130 },
  { subject:"DevOps",   A:99,  B:100 },
  { subject:"Testing",  A:85,  B:90  },
  { subject:"Strategy", A:65,  B:85  },
];

const donutData = [
  { name:"Mobile",  value:42, color:"#22c55e" },
  { name:"Desktop", value:35, color:"#3b82f6" },
  { name:"Tablet",  value:15, color:"#f59e0b" },
  { name:"Other",   value:8,  color:"#8b5cf6" },
];

const scatterData = Array.from({length:40},(_,i)=>({
  x: Math.random()*5,
  y: Math.random()*5000+500,
  z: Math.random()*200+50,
  type: i%2===0?"Pro":"Free",
}));

const budgetData = [
  { name:"Engineering", value:320, color:"#22c55e" },
  { name:"UI Building",  value:180, color:"#3b82f6" },
  { name:"2 Dev",        value:140, color:"#06b6d4" },
  { name:"Testing",      value:90,  color:"#8b5cf6" },
  { name:"Open Source",  value:70,  color:"#f59e0b" },
  { name:"Support",      value:60,  color:"#ec4899" },
  { name:"Lead",         value:50,  color:"#f97316" },
];

const composedData = [
  { m:"Jan", orders:1200, revenue:18000, growth:2.1 },
  { m:"Feb", orders:1500, revenue:22000, growth:2.8 },
  { m:"Mar", orders:1300, revenue:19000, growth:2.4 },
  { m:"Apr", orders:1800, revenue:28000, growth:3.2 },
  { m:"May", orders:1600, revenue:25000, growth:3.0 },
  { m:"Jun", orders:2100, revenue:35000, growth:3.8 },
  { m:"Jul", orders:1900, revenue:32000, growth:3.5 },
  { m:"Aug", orders:2400, revenue:40000, growth:4.1 },
  { m:"Sep", orders:2200, revenue:38000, growth:3.9 },
  { m:"Oct", orders:2700, revenue:45000, growth:4.5 },
  { m:"Nov", orders:2500, revenue:42000, growth:4.2 },
  { m:"Dec", orders:3000, revenue:52000, growth:5.0 },
];

export default function Charts() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  return (
    <DashboardLayout title="Charts" subtitle="Explore different chart types available in the dashboard.">
      <div style={{ padding:"1rem" }}>

        {/* Row 1: Radar + Donut */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem" }}>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"1rem" }}>
            <div style={{ fontWeight:700,fontSize:"0.88rem",marginBottom:"0.2rem" }}>Team Skills Assessment</div>
            <div style={{ fontSize:"0.68rem",color:muted,marginBottom:"0.5rem" }}>You can customize spider chart parameters</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={dark?"#1e2330":"#e5e7eb"} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize:10,fill:muted }} />
                <PolarRadiusAxis tick={{ fontSize:8,fill:muted }} />
                <Radar name="This year" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                <Radar name="Last year" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Tooltip contentStyle={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:8,fontSize:11 }} />
                <Legend wrapperStyle={{ fontSize:11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"1rem" }}>
            <div style={{ fontWeight:700,fontSize:"0.88rem",marginBottom:"0.2rem" }}>Device Usage</div>
            <div style={{ fontSize:"0.68rem",color:muted,marginBottom:"0.5rem" }}>A nested donut chart by device type</div>
            <div style={{ display:"flex",alignItems:"center",gap:"1.5rem" }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {donutData.map((d,i)=><Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:8,fontSize:11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.4rem" }}>
                {donutData.map(d=>(
                  <div key={d.name} style={{ display:"flex",alignItems:"center",gap:8,fontSize:"0.75rem" }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:d.color,flexShrink:0 }} />
                    <span style={{ color:muted }}>{d.name}</span>
                    <span style={{ fontWeight:600,marginLeft:"auto" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Scatter + Budget Treemap */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem" }}>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"1rem" }}>
            <div style={{ fontWeight:700,fontSize:"0.88rem",marginBottom:"0.2rem" }}>Marketing Campaign Performance</div>
            <div style={{ fontSize:"0.68rem",color:muted,marginBottom:"0.5rem" }}>Price compared to conversion rate (per plan tier)</div>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
                <XAxis dataKey="x" type="number" tick={{ fontSize:9,fill:muted }} axisLine={false} tickLine={false} name="Price" />
                <YAxis dataKey="y" type="number" tick={{ fontSize:9,fill:muted }} axisLine={false} tickLine={false} name="Revenue" />
                <ZAxis dataKey="z" range={[20,80]} />
                <Tooltip contentStyle={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:8,fontSize:11 }} cursor={{ strokeDasharray:"3 3" }} />
                <Scatter name="Pro plans"  data={scatterData.filter(d=>d.type==="Pro")}  fill="#22c55e" fillOpacity={0.7} />
                <Scatter name="Free plans" data={scatterData.filter(d=>d.type==="Free")} fill="#3b82f6" fillOpacity={0.7} />
                <Legend wrapperStyle={{ fontSize:11 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"1rem" }}>
            <div style={{ fontWeight:700,fontSize:"0.88rem",marginBottom:"0.2rem" }}>Budget Allocation</div>
            <div style={{ fontSize:"0.68rem",color:muted,marginBottom:"0.75rem" }}>Project cost spending plan by function</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4 }}>
              {budgetData.map((b,i)=>(
                <div key={b.name} style={{ background:b.color,borderRadius:8,padding:"0.6rem 0.5rem",display:"flex",flexDirection:"column",justifyContent:"flex-end",minHeight: i===0?80:i<3?60:50 }}>
                  <div style={{ fontSize:"0.68rem",fontWeight:700,color:"rgba(0,0,0,0.8)" }}>{b.name}</div>
                  <div style={{ fontSize:"0.6rem",color:"rgba(0,0,0,0.6)" }}>Br {b.value}k</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Composed chart */}
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"1rem" }}>
          <div style={{ fontWeight:700,fontSize:"0.88rem",marginBottom:"0.2rem" }}>Revenue & Volume Trend</div>
          <div style={{ fontSize:"0.68rem",color:muted,marginBottom:"0.75rem" }}>Combined bar, area and line chart for revenue and order volume</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={composedData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
              <XAxis dataKey="m" tick={{ fontSize:9,fill:muted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize:9,fill:muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize:9,fill:muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:8,fontSize:11 }} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" fillOpacity={0.7} radius={[3,3,0,0]} name="Revenue" barSize={16} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} dot={false} name="Revenue trend" />
              <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} dot={false} name="Growth %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
