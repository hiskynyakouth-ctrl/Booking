import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markRead, markAllRead, removeNotification } from "../services/notificationService";
import UserLayout from "../layouts/UserLayout";

const typeIcon  = { info:"ℹ️", success:"✅", warning:"⚠️", error:"❌", booking:"📅", payment:"💳" };
const typeColor = { info:"#3b82f6", success:"#22c55e", warning:"#f59e0b", error:"#ef4444", booking:"#8b5cf6", payment:"#22c55e" };

export default function MyNotifications() {
  const { user }  = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [notifs,  setNotifs]  = useState([]);
  const [tab,     setTab]     = useState("All");

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";

  const load = () => {
    const all = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
    setNotifs(all.filter(n => String(n.userId) === String(user?.id) || n.userId === "all"));
  };
  useEffect(() => {
    if (!user) return;
    load();
    const update = () => load();
    window.addEventListener("notifications-changed", update);
    return () => window.removeEventListener("notifications-changed", update);
  }, [user]);

  const handleMarkRead = (id) => {
    const all = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
    localStorage.setItem("mock_notifications", JSON.stringify(all.map(n => n.id===id ? {...n,read:true} : n)));
    load();
  };
  const handleMarkAll = () => {
    const all = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
    localStorage.setItem("mock_notifications", JSON.stringify(all.map(n => (String(n.userId)===String(user?.id)||n.userId==="all") ? {...n,read:true} : n)));
    load();
  };
  const handleRemove   = async (id) => { await removeNotification(id); load(); };

  const filtered = notifs.filter(n => {
    if (tab === "Unread") return !n.read;
    if (tab === "Read")   return n.read;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <UserLayout>
      <div style={{ padding:"1.5rem" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:8 }}>
          <div>
            <h1 style={{ fontSize:"1.3rem",fontWeight:700,marginBottom:"0.2rem" }}>Notifications</h1>
            <p style={{ fontSize:"0.78rem",color:muted }}>Stay up to date with your latest alerts</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAll} style={{ display:"flex",alignItems:"center",gap:6,background:dark?"#1e2330":"#f3f4f6",border:`1px solid ${bdr}`,color:muted,fontSize:"0.78rem",padding:"0.4rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        <div style={{ display:"flex",gap:4,marginBottom:"1rem" }}>
          {["All","Unread","Read"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"0.35rem 0.9rem",borderRadius:8,border:"none",fontSize:"0.78rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>
              {t} {t==="Unread"&&unreadCount>0?`(${unreadCount})`:""}
            </button>
          ))}
        </div>

        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          {filtered.length===0 ? (
            <div style={{ textAlign:"center",padding:"3rem",color:muted }}>
              <div style={{ fontSize:"2.5rem",marginBottom:"0.75rem" }}>🔔</div>
              <p>No notifications</p>
            </div>
          ) : filtered.map(n=>(
            <div key={n.id} onClick={()=>!n.read&&handleMarkRead(n.id)}
              style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"1rem 1.25rem",borderBottom:`1px solid ${bdr}`,cursor:n.read?"default":"pointer",background:n.read?"transparent":(dark?"rgba(34,197,94,0.03)":"rgba(34,197,94,0.02)"),transition:"background 0.15s" }}>
              <div style={{ width:38,height:38,borderRadius:10,background:(typeColor[n.type]||"#6b7280")+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0 }}>
                {typeIcon[n.type]||"🔔"}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:"0.2rem" }}>
                  <span style={{ fontWeight:n.read?500:700,fontSize:"0.85rem" }}>{n.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleRemove(n.id); }} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:"0.8rem", padding:"0.2rem 0.4rem", borderRadius:6 }}>Delete</button>
                </div>
                <p style={{ fontSize:"0.78rem",color:muted,margin:0,lineHeight:1.5 }}>{n.body}</p>
                <p style={{ fontSize:"0.68rem",color:muted,margin:"0.25rem 0 0",opacity:0.7 }}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
