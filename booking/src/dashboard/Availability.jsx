import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";

const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SLOTS = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

export default function Availability() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [schedule, setSchedule] = useState({
    Monday:    { open:true,  from:"9:00 AM",  to:"5:00 PM" },
    Tuesday:   { open:true,  from:"9:00 AM",  to:"5:00 PM" },
    Wednesday: { open:true,  from:"9:00 AM",  to:"5:00 PM" },
    Thursday:  { open:true,  from:"9:00 AM",  to:"5:00 PM" },
    Friday:    { open:true,  from:"9:00 AM",  to:"4:00 PM" },
    Saturday:  { open:false, from:"10:00 AM", to:"2:00 PM" },
    Sunday:    { open:false, from:"",         to:""        },
  });
  const [saved, setSaved] = useState(false);

  const card = dark ? "#141720" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sel  = { background:dark?"#1e2330":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:8, padding:"0.35rem 0.6rem", color:txt, fontSize:"0.78rem", outline:"none", cursor:"pointer" };

  const toggleDay = (day) => setSchedule(s => ({ ...s, [day]: { ...s[day], open: !s[day].open } }));
  const update    = (day, field, val) => setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: val } }));

  const saveSchedule = () => {
    localStorage.setItem("availability_schedule", JSON.stringify(schedule));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const saveActions = (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      {saved && <span style={{ color:"#22c55e", fontSize:"0.82rem" }}>✓ Saved</span>}
      <button onClick={saveSchedule} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.45rem 1.2rem", borderRadius:8, cursor:"pointer" }}>
        Save Changes
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Availability" subtitle="Set your working hours and availability." actions={saveActions}>
      <div style={{ padding:"1.5rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", maxWidth:640 }}>
          {DAYS.map(day => {
            const d = schedule[day];
            return (
              <div key={day} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
                <div style={{ width:110, fontWeight:600, fontSize:"0.85rem", color:txt }}>{day}</div>

                {/* Toggle */}
                <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => toggleDay(day)}>
                  <div style={{ width:36, height:20, borderRadius:999, background:d.open?"#22c55e":"#2a2f45", position:"relative", transition:"background 0.2s" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:d.open?19:3, transition:"left 0.2s" }} />
                  </div>
                  <span style={{ fontSize:"0.78rem", color:d.open?"#22c55e":muted }}>{d.open?"Open":"Closed"}</span>
                </div>

                {/* Time selectors */}
                {d.open && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto", flexWrap:"wrap" }}>
                    <select value={d.from} onChange={e=>update(day,"from",e.target.value)} style={sel}>
                      {SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <span style={{ color:muted, fontSize:"0.78rem" }}>to</span>
                    <select value={d.to} onChange={e=>update(day,"to",e.target.value)} style={sel}>
                      {SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
