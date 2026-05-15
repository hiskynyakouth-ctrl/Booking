import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAllUsers } from "../services/authService";
import { addNotification, getNotifications, markRead, markAllRead, removeNotification } from "../services/notificationService";

const TYPE_LABELS = {
  all: "All",
  order: "Orders",
  payment: "Payments",
  user: "Users",
  system: "System",
  review: "Reviews",
};

const typeIcon = {
  order: "🛒",
  payment: "💳",
  user: "👤",
  system: "⚙️",
  review: "⭐",
};

const typeColor = {
  order: "#22c55e",
  payment: "#3b82f6",
  user: "#22c55e",
  system: "#8b5cf6",
  review: "#f59e0b",
};

export default function Notifications() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [notifs, setNotifs] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState("all");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyBody, setNotifyBody] = useState("");
  const [notifyType, setNotifyType] = useState("info");
  const [tab, setTab] = useState("All");
  const [category, setCategory] = useState("all");
  const [sending, setSending] = useState(false);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const load = async () => {
    const data = await getNotifications("admin");
    setNotifs((data || []).filter(Boolean));
  };

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers((allUsers || []).filter(Boolean).filter(u => u.role !== "admin"));
  };

  useEffect(() => { load(); loadUsers(); }, []);

  // Re-load when notifications change (e.g. customer sends message)
  useEffect(() => {
    const update = () => load();
    window.addEventListener("notifications-changed", update);
    return () => window.removeEventListener("notifications-changed", update);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;
  const handleMarkAllRead = async () => { await markAllRead("admin"); load(); };
  const handleMarkRead    = async (id) => { await markRead(id); load(); };
  const handleRemove      = async (id) => { await removeNotification(id); load(); };

  const sendNotification = async () => {
    if (!notifyTitle.trim() || !notifyBody.trim()) return;
    setSending(true);
    try {
      if (recipient === "all") {
        // Send to every customer
        console.log(`📢 Sending to ${users.length} customers:`, users.map(u => ({ id: u.id, name: u.name })));
        for (const u of users) {
          await addNotification({
            userId: String(u.id),
            title: notifyTitle.trim(),
            body: notifyBody.trim(),
            type: notifyType,
          });
        }
        console.log("✅ Sent to all customers");
      } else {
        console.log(`📢 Sending to user ${recipient}`);
        await addNotification({
          userId: String(recipient),
          title: notifyTitle.trim(),
          body: notifyBody.trim(),
          type: notifyType,
        });
        console.log("✅ Notification sent");
      }
      setNotifyTitle("");
      setNotifyBody("");
      setRecipient("all");
      setNotifyType("info");
      await load();
    } finally {
      setSending(false);
    }
  };

  const filtered = notifs.filter(n => {
    const tabMatch = tab === "Unread" ? !n.read : tab === "Read" ? n.read : true;
    const catMatch = category === "all" ? true : n.type === category;
    return tabMatch && catMatch;
  });

  const markAllAction = unreadCount > 0 ? (
    <button onClick={handleMarkAllRead} style={{ display:"flex",alignItems:"center",gap:6,background:sub,border:`1px solid ${bdr}`,color:muted,fontSize:"0.78rem",padding:"0.4rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      Mark all as read
    </button>
  ) : null;

  return (
    <DashboardLayout title="Notifications" subtitle="Stay up to date with your latest alerts." actions={markAllAction}>
      <div style={{ padding:"1.25rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:"1rem" }}>
              <div>
                <div style={{ fontWeight:700,fontSize:"0.95rem" }}>Send notification</div>
                <div style={{ fontSize:"0.78rem", color:muted }}>Notify a user or all customers from the dashboard.</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.75rem", marginBottom:"0.85rem" }}>
              <div>
                <label style={{ display:"block", fontSize:"0.75rem", color:muted, marginBottom:"0.4rem" }}>Send to</label>
                <select value={recipient} onChange={e=>setRecipient(e.target.value)} style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.75rem 0.9rem", color:txt, fontSize:"0.85rem", outline:"none" }}>
                  <option value="all">All users</option>
                  <option value="admin">Admin only</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display:"block", fontSize:"0.75rem", color:muted, marginBottom:"0.4rem" }}>Type</label>
                <select value={notifyType} onChange={e=>setNotifyType(e.target.value)} style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.75rem 0.9rem", color:txt, fontSize:"0.85rem", outline:"none" }}>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="booking">Booking</option>
                  <option value="payment">Payment</option>
                  <option value="order">Order</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gap:"0.75rem", marginBottom:"0.85rem" }}>
              <div>
                <label style={{ display:"block", fontSize:"0.75rem", color:muted, marginBottom:"0.4rem" }}>Title</label>
                <input value={notifyTitle} onChange={e=>setNotifyTitle(e.target.value)} placeholder="Notification title" style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.85rem 0.95rem", color:txt, fontSize:"0.85rem", outline:"none" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:"0.75rem", color:muted, marginBottom:"0.4rem" }}>Message</label>
                <textarea value={notifyBody} onChange={e=>setNotifyBody(e.target.value)} rows={3} placeholder="Notification message" style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.85rem 0.95rem", color:txt, fontSize:"0.85rem", outline:"none", resize:"vertical", fontFamily:"inherit" }} />
              </div>
            </div>
            <button onClick={sendNotification} disabled={sending || !notifyTitle.trim() || !notifyBody.trim()} style={{ background: sending ? "#1a5c3a" : "#22c55e", color:"#000", fontWeight:700, padding:"0.85rem 1.5rem", borderRadius:10, border:"none", cursor: sending ? "not-allowed" : "pointer", opacity: (!notifyTitle.trim() || !notifyBody.trim()) ? 0.5 : 1, transition:"all 0.2s" }}>
              {sending ? "Sending..." : "Send notification"}
            </button>
          </div>
        </div>

        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.85rem 1rem",borderBottom:`1px solid ${bdr}`,flexWrap:"wrap",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
              <span style={{ fontWeight:700,fontSize:"0.9rem" }}>All Notifications</span>
              {unreadCount>0 && <span style={{ background:"#22c55e",color:"#000",fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:999 }}>{unreadCount} unread</span>}
            </div>
            <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
              {["All","Unread","Read"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{ padding:"0.3rem 0.75rem",borderRadius:8,border:"none",fontSize:"0.75rem",background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent",color:tab===t?txt:muted,fontWeight:tab===t?700:400,cursor:"pointer" }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display:"flex",gap:8,flexWrap:"wrap",padding:"0.85rem 1rem",borderBottom:`1px solid ${bdr}` }}>
            {Object.entries(TYPE_LABELS).map(([key,label]) => (
              <button key={key} onClick={() => setCategory(key)} style={{ padding:"0.35rem 0.85rem",borderRadius:999,border:"none",background:category===key?(dark?"#1e2330":"#e5e7eb"):"transparent",color:category===key?txt:muted,fontWeight:category===key?700:500,cursor:"pointer",fontSize:"0.75rem" }}>
                {label}
              </button>
            ))}
          </div>

          {filtered.length===0 ? (
            <div style={{ textAlign:"center",padding:"3rem",color:muted,fontSize:"0.85rem" }}>No notifications found for that view.</div>
          ) : filtered.map(n=>(
            <div key={n.id} onClick={()=>handleMarkRead(n.id)}
              style={{ display:"flex",alignItems:"flex-start",gap:14,padding:"1rem",borderBottom:`1px solid ${bdr}`,cursor:"pointer",background:!n.read?(dark?"rgba(34,197,94,0.04)":"rgba(34,197,94,0.02)"):"transparent",transition:"background 0.15s" }}>
              <div style={{ width:38,height:38,borderRadius:10,background:(typeColor[n.type]||"#6b7280") + "18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0 }}>{typeIcon[n.type]||"🔔"}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"0.2rem",flexWrap:"wrap" }}>
                  <span style={{ fontWeight:!n.read?700:600,fontSize:"0.85rem" }}>{n.title}</span>
                  <span style={{ fontSize:"0.68rem",color:muted,background:(dark?"#1e2330":"#f3f4f6"),padding:"0.15rem 0.45rem",borderRadius:999 }}>{TYPE_LABELS[n.type] || "Info"}</span>
                  {!n.read && <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",flexShrink:0 }} />}
                </div>
                <p style={{ fontSize:"0.78rem",color:muted,margin:0,lineHeight:1.5 }}>{n.body}</p>
                <p style={{ fontSize:"0.68rem",color:muted,margin:"0.25rem 0 0",opacity:0.85 }}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={e=>{e.stopPropagation();handleRemove(n.id);}} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"0.85rem",padding:"0.2rem",flexShrink:0,opacity:0.55 }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
