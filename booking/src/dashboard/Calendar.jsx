import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function Calendar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === "dark";
  const today = new Date();

  const [current, setCurrent] = useState({ year:today.getFullYear(), month:today.getMonth() });
  const [selected, setSelected] = useState(today.getDate());
  const [events, setEvents] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title:"", time:"", color:"#22c55e" });

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";
  const side = dark ? "#0d1117" : "#fff";

  const firstDay    = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month+1, 0).getDate();
  const prevDays    = new Date(current.year, current.month, 0).getDate();

  const pad = n => String(n).padStart(2,"0");
  const key = d => `${current.year}-${pad(current.month+1)}-${pad(d)}`;
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  const selectedKey = key(selected);

  const prev = () => setCurrent(c => c.month===0 ? {year:c.year-1,month:11} : {...c,month:c.month-1});
  const next = () => setCurrent(c => c.month===11 ? {year:c.year+1,month:0} : {...c,month:c.month+1});
  const goToday = () => { setCurrent({year:today.getFullYear(),month:today.getMonth()}); setSelected(today.getDate()); };

  const addEvent = () => {
    if (!newEvent.title) return;
    setEvents(e => ({ ...e, [selectedKey]: [...(e[selectedKey]||[]), { ...newEvent, id:Date.now() }] }));
    setNewEvent({ title:"", time:"", color:"#22c55e" });
    setShowAdd(false);
  };

  const removeEvent = (dayKey, id) => setEvents(e => ({ ...e, [dayKey]: e[dayKey].filter(ev=>ev.id!==id) }));

  const upcomingEvents = Object.entries(events).flatMap(([k,evs]) => evs.map(ev=>({...ev,date:k}))).filter(ev=>ev.date>=todayKey).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);

  const selectedDayName = new Date(current.year, current.month, selected).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

  const calendarActions = (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button onClick={prev} style={{ background:sub, border:"none", color:txt, width:30, height:30, borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={next} style={{ background:sub, border:"none", color:txt, width:30, height:30, borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <span style={{ fontSize:"0.9rem", fontWeight:700 }}>{MONTHS[current.month]} {current.year}</span>
      <button onClick={goToday} style={{ background:sub, border:`1px solid ${bdr}`, color:txt, fontSize:"0.78rem", padding:"0.35rem 0.9rem", borderRadius:8, cursor:"pointer", fontWeight:600 }}>Today</button>
      <button onClick={()=>navigate("/booking")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.78rem", padding:"0.4rem 1rem", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
        Add Event
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Calendar" subtitle="Manage your schedule and events." actions={calendarActions}>
      <div style={{ display:"flex", flex:1, overflow:"hidden", height:"100%" }}>
        {/* Main calendar */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          {/* Calendar grid */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {/* Day headers */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:`1px solid ${bdr}` }}>
              {DAYS.map(d=>(
                <div key={d} style={{ textAlign:"center", padding:"0.6rem 0", fontSize:"0.75rem", color:muted, fontWeight:500, borderRight:`1px solid ${bdr}` }}>{d}</div>
              ))}
            </div>
            {/* Days */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
              {/* Prev month days */}
              {Array(firstDay).fill(null).map((_,i)=>(
                <div key={"p"+i} style={{ minHeight:90, padding:"0.5rem", borderRight:`1px solid ${bdr}`, borderBottom:`1px solid ${bdr}`, opacity:0.3 }}>
                  <span style={{ fontSize:"0.78rem", color:muted }}>{prevDays-firstDay+i+1}</span>
                </div>
              ))}
              {/* Current month */}
              {Array(daysInMonth).fill(null).map((_,i)=>{
                const d = i+1;
                const k = key(d);
                const isToday = k===todayKey;
                const isSel   = d===selected;
                const dayEvts = events[k]||[];
                return (
                  <div key={d} onClick={()=>setSelected(d)}
                    style={{ minHeight:90, padding:"0.5rem", borderRight:`1px solid ${bdr}`, borderBottom:`1px solid ${bdr}`, cursor:"pointer", background:isSel?(dark?"rgba(34,197,94,0.08)":"rgba(34,197,94,0.05)"):"transparent", transition:"background 0.15s" }}>
                    <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:"0.3rem" }}>
                      <span style={{ fontSize:"0.78rem", fontWeight:isToday?700:400, color:isToday?"#000":txt, background:isToday?"#22c55e":"transparent", width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{d}</span>
                    </div>
                    {dayEvts.slice(0,2).map(ev=>(
                      <div key={ev.id} style={{ fontSize:"0.62rem", background:ev.color+"22", color:ev.color, borderRadius:4, padding:"1px 5px", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.time&&`${ev.time} `}{ev.title}</div>
                    ))}
                    {dayEvts.length>2 && <div style={{ fontSize:"0.6rem", color:muted }}>+{dayEvts.length-2} more</div>}
                  </div>
                );
              })}
              {/* Next month fill */}
              {Array(Math.max(0,42-firstDay-daysInMonth)).fill(null).map((_,i)=>(
                <div key={"n"+i} style={{ minHeight:90, padding:"0.5rem", borderRight:`1px solid ${bdr}`, borderBottom:`1px solid ${bdr}`, opacity:0.3 }}>
                  <span style={{ fontSize:"0.78rem", color:muted }}>{i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width:260, background:side, borderLeft:`1px solid ${bdr}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
          <div style={{ padding:"1rem", borderBottom:`1px solid ${bdr}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.25rem" }}>
              <div style={{ fontSize:"0.82rem", fontWeight:600 }}>{selectedDayName}</div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>setShowAdd(s=>!s)} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.72rem", width:24, height:24, borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                {showAdd && <button onClick={()=>setShowAdd(false)} style={{ background:sub, border:"none", color:muted, fontSize:"0.72rem", width:24, height:24, borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>}
              </div>
            </div>
            <div style={{ fontSize:"0.72rem", color:muted }}>{(events[selectedKey]||[]).length===0?"No events scheduled":""}</div>
          </div>

          {showAdd && (
            <div style={{ padding:"0.75rem", borderBottom:`1px solid ${bdr}`, display:"flex", flexDirection:"column", gap:6 }}>
              <input value={newEvent.title} onChange={e=>setNewEvent(n=>({...n,title:e.target.value}))} placeholder="Event title"
                style={{ background:sub, border:`1px solid ${bdr}`, borderRadius:8, padding:"0.4rem 0.6rem", color:txt, fontSize:"0.78rem", outline:"none" }} />
              <input value={newEvent.time} onChange={e=>setNewEvent(n=>({...n,time:e.target.value}))} placeholder="Time (e.g. 9:00 AM)"
                style={{ background:sub, border:`1px solid ${bdr}`, borderRadius:8, padding:"0.4rem 0.6rem", color:txt, fontSize:"0.78rem", outline:"none" }} />
              <div style={{ display:"flex", gap:4 }}>
                {["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6"].map(c=>(
                  <button key={c} onClick={()=>setNewEvent(n=>({...n,color:c}))} style={{ width:20, height:20, borderRadius:"50%", background:c, border:newEvent.color===c?"2px solid #fff":"2px solid transparent", cursor:"pointer" }} />
                ))}
              </div>
              <button onClick={addEvent} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.75rem", padding:"0.4rem", borderRadius:8, cursor:"pointer" }}>Add Event</button>
            </div>
          )}

          <div style={{ flex:1, overflowY:"auto", padding:"0.75rem" }}>
            {(events[selectedKey]||[]).length===0 ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 0", gap:"0.5rem", color:muted }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <div style={{ fontSize:"0.78rem" }}>No events for this day</div>
                <button onClick={()=>setShowAdd(true)} style={{ background:"none", border:"none", color:"#22c55e", fontSize:"0.75rem", cursor:"pointer", fontWeight:600 }}>Create one</button>
              </div>
            ) : (events[selectedKey]||[]).map(ev=>(
              <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.5rem", borderRadius:8, background:sub, marginBottom:"0.5rem" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:ev.color, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.78rem", fontWeight:600 }}>{ev.title}</div>
                  {ev.time && <div style={{ fontSize:"0.68rem", color:muted }}>{ev.time}</div>}
                </div>
                <button onClick={()=>removeEvent(selectedKey,ev.id)} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:"0.8rem" }}>✕</button>
              </div>
            ))}

            {upcomingEvents.length>0 && (
              <div style={{ marginTop:"1rem" }}>
                <div style={{ fontSize:"0.72rem", fontWeight:700, color:muted, marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Upcoming Events</div>
                {upcomingEvents.map(ev=>(
                  <div key={ev.id+ev.date} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.4rem 0", borderBottom:`1px solid ${bdr}` }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:ev.color, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"0.75rem", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
                      <div style={{ fontSize:"0.65rem", color:muted }}>{ev.date}{ev.time&&` · ${ev.time}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {upcomingEvents.length===0 && (events[selectedKey]||[]).length===0 && (
              <div style={{ marginTop:"1rem" }}>
                <div style={{ fontSize:"0.72rem", fontWeight:700, color:muted, marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Upcoming Events</div>
                <div style={{ fontSize:"0.75rem", color:muted }}>No upcoming events.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
