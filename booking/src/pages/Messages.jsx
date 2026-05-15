import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { userSendMessage, getMessages, markConversationRead, getChatData } from "../services/chatService";
import { addNotification } from "../services/notificationService";
import UserLayout from "../layouts/UserLayout";

export default function Messages() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [convId, setConvId] = useState(null);
  const bottomRef = useRef(null);

  // Find this user's conversation id
  const getMyConvId = () => {
    const d = getChatData();
    const conv = d.conversations.find(c => c.userId === String(user?.id));
    return conv?.id || null;
  };

  const reload = () => {
    const id = getMyConvId();
    setConvId(id);
    if (id) {
      setMessages(getMessages(id));
      markConversationRead(id);
    }
  };

  useEffect(() => {
    if (!user) return;
    reload();
    // Poll every 2 seconds for new admin replies
    const interval = setInterval(reload, 2000);
    window.addEventListener("chat-updated", reload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("chat-updated", reload);
    };
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !user) return;
    const text = input.trim();
    setInput("");
    const id = userSendMessage(user.id, user.name || user.email, text);
    setConvId(id);
    reload();
    // Notify admin
    addNotification({
      userId: "admin",
      title: `💬 New message from ${user.name || user.email}`,
      body: text,
      type: "info",
    });
  };

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  return (
    <UserLayout>
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 53px)" }}>
        {/* Header */}
        <div style={{ padding:"0.85rem 1.25rem", borderBottom:`1px solid ${bdr}`, background:card, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🛎️</div>
            <div>
              <div style={{ fontWeight:700, fontSize:"0.9rem" }}>Admin Support</div>
              <div style={{ fontSize:"0.68rem", color:"#22c55e" }}>● Online</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {messages.length === 0 ? (
            <div style={{ textAlign:"center", color:muted, marginTop:"3rem" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>💬</div>
              <div style={{ fontWeight:600, marginBottom:"0.25rem" }}>No messages yet</div>
              <div style={{ fontSize:"0.78rem" }}>Send a message to start chatting with admin support.</div>
            </div>
          ) : messages.map((m, i) => {
            const isMe = m.from === "user";
            return (
              <div key={m.id || i} style={{ display:"flex", justifyContent: isMe ? "flex-end" : "flex-start", gap:8, alignItems:"flex-end" }}>
                {!isMe && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", flexShrink:0 }}>🛎️</div>
                )}
                <div style={{ maxWidth:"65%", background: isMe ? "#d4a017" : (dark ? "#1e2330" : "#f3f4f6"), borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding:"0.65rem 0.9rem" }}>
                  <p style={{ margin:0, fontSize:"0.85rem", color: isMe ? "#000" : txt }}>{m.text}</p>
                  <p style={{ fontSize:"0.62rem", color: isMe ? "rgba(0,0,0,0.5)" : muted, marginTop:4, textAlign:"right" }}>{m.time}</p>
                </div>
                {isMe && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"#d4a017", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#000", flexShrink:0 }}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding:"0.85rem 1.25rem", borderTop:`1px solid ${bdr}`, background:card, display:"flex", gap:8, flexShrink:0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message to admin support..."
            style={{ flex:1, background:sub, border:`1px solid ${bdr}`, borderRadius:10, padding:"0.65rem 1rem", color:txt, fontSize:"0.85rem", outline:"none" }}
          />
          <button onClick={send} disabled={!input.trim()}
            style={{ background:"#d4a017", border:"none", color:"#000", fontWeight:700, padding:"0.65rem 1.2rem", borderRadius:10, cursor:input.trim()?"pointer":"not-allowed", opacity:input.trim()?1:0.5, fontSize:"0.85rem" }}>
            Send
          </button>
        </div>
      </div>
    </UserLayout>
  );
}
