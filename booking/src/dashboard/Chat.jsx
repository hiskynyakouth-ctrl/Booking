import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getAdminConversations, getMessages, sendMessageToUser, markConversationRead, getChatData } from "../services/chatService";
import { addNotification } from "../services/notificationService";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Chat() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const dark = theme === "dark";
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  const reload = () => {
    const convs = getAdminConversations();
    setConversations(convs);
    if (activeId) {
      setMessages(getMessages(activeId));
    }
  };

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 2000);
    window.addEventListener("chat-updated", reload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("chat-updated", reload);
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = (conv) => {
    setActiveId(conv.id);
    setMessages(getMessages(conv.id));
    markConversationRead(conv.id);
    // Update local unread count
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
  };

  const send = () => {
    if (!input.trim() || !activeId) return;
    const text = input.trim();
    setInput("");
    sendMessageToUser(activeId, text);
    setMessages(getMessages(activeId));

    // Notify the customer
    const conv = conversations.find(c => c.id === activeId);
    if (conv?.userId) {
      addNotification({
        userId: conv.userId,
        title: "💬 New message from Admin",
        body: text,
        type: "info",
      });
    }
  };

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const activeConv = conversations.find(c => c.id === activeId);
  const filtered = conversations.filter(c =>
    !search || (c.userName || c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Chat" subtitle="Messages and conversations with customers.">
      <div style={{ display:"flex", height:"calc(100vh - 60px)", overflow:"hidden" }}>

        {/* Conversation list */}
        <div style={{ width:280, background:card, borderRight:`1px solid ${bdr}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"0.75rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:sub, borderRadius:10, padding:"0.45rem 0.9rem" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
                style={{ background:"transparent", border:"none", outline:"none", color:txt, fontSize:"0.78rem", width:"100%" }} />
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding:"2rem 1rem", textAlign:"center", color:muted }}>
                <div style={{ fontSize:"1.8rem", marginBottom:"0.5rem" }}>💬</div>
                <div style={{ fontSize:"0.78rem" }}>No conversations yet.</div>
                <div style={{ fontSize:"0.72rem", marginTop:"0.25rem" }}>Customers will appear here when they send a message.</div>
              </div>
            ) : filtered.map(c => (
              <div key={c.id} onClick={() => openConversation(c)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"0.85rem 1rem", cursor:"pointer", background: activeId === c.id ? (dark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.05)") : "transparent", borderBottom:`1px solid ${bdr}`, transition:"background 0.15s" }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background: c.color || "#3b82f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#000" }}>
                    {(c.userName || c.name || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:"#22c55e", border:`2px solid ${card}` }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:600, fontSize:"0.82rem" }}>{c.userName || c.name}</span>
                    <span style={{ fontSize:"0.65rem", color:muted }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize:"0.72rem", color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>
                    {c.lastMsg || c.last || "No messages yet"}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span style={{ background:"#22c55e", color:"#000", fontSize:"0.6rem", fontWeight:700, minWidth:18, height:18, borderRadius:999, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", flexShrink:0 }}>
                    {c.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {activeConv ? (
            <>
              {/* Header */}
              <div style={{ padding:"0.85rem 1.25rem", borderBottom:`1px solid ${bdr}`, background:card, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background: activeConv.color || "#3b82f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700, color:"#000" }}>
                  {(activeConv.userName || activeConv.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"0.9rem" }}>{activeConv.userName || activeConv.name}</div>
                  <div style={{ fontSize:"0.68rem", color:"#22c55e" }}>● Customer</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign:"center", color:muted, marginTop:"2rem" }}>
                    <div style={{ fontSize:"0.82rem" }}>No messages yet. Reply to start the conversation.</div>
                  </div>
                ) : messages.map((m, i) => {
                  const isAdmin = m.from === "admin";
                  return (
                    <div key={m.id || i} style={{ display:"flex", justifyContent: isAdmin ? "flex-end" : "flex-start", gap:8, alignItems:"flex-end" }}>
                      {!isAdmin && (
                        <div style={{ width:28, height:28, borderRadius:"50%", background: activeConv.color || "#3b82f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#000", flexShrink:0 }}>
                          {(activeConv.userName || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div style={{ maxWidth:"65%", background: isAdmin ? "#22c55e" : (dark ? "#1e2330" : "#f3f4f6"), borderRadius: isAdmin ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding:"0.65rem 0.9rem" }}>
                        <p style={{ margin:0, fontSize:"0.85rem", color: isAdmin ? "#000" : txt }}>{m.text}</p>
                        <p style={{ fontSize:"0.62rem", color: isAdmin ? "rgba(0,0,0,0.5)" : muted, marginTop:4, textAlign:"right" }}>{m.time}</p>
                      </div>
                      {isAdmin && (
                        <div style={{ width:28, height:28, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#000", flexShrink:0 }}>
                          A
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding:"0.85rem 1.25rem", borderTop:`1px solid ${bdr}`, background:card, display:"flex", gap:8, flexShrink:0 }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                  placeholder={`Reply to ${activeConv.userName || activeConv.name}...`}
                  style={{ flex:1, background:sub, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.65rem 1rem", color:txt, fontSize:"0.85rem", outline:"none" }} />
                <button onClick={send} disabled={!input.trim()}
                  style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, padding:"0.65rem 1.2rem", borderRadius:10, cursor:input.trim()?"pointer":"not-allowed", opacity:input.trim()?1:0.5, fontSize:"0.82rem" }}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.75rem", color:muted }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:sub, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>💬</div>
              <div style={{ fontWeight:600, fontSize:"0.95rem", color:txt }}>Select a conversation</div>
              <div style={{ fontSize:"0.78rem" }}>Customer messages will appear on the left.</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
