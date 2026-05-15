import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { sendEmail } from "../services/mailService";
import DashboardLayout from "../layouts/DashboardLayout";

const LABELS = [
  { name:"Personal",  color:"#22c55e" },
  { name:"Work",      color:"#3b82f6" },
  { name:"Important", color:"#f59e0b" },
  { name:"Updates",   color:"#8b5cf6" },
];

export default function Mail() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const [folder, setFolder] = useState("Inbox");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compose, setCompose] = useState({ to:"", subject:"", body:"" });
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [emails, setEmails] = useState([]);

  const bg   = dark ? "#0a0c0f" : "#f4f5f7";
  const side = dark ? "#0d1117" : "#fff";
  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";
  const hover= dark ? "#1a1f2e" : "#f9fafb";

  const folderCounts = emails.reduce((acc, email) => {
    acc.Inbox += email.status === "inbox" ? 1 : 0;
    acc.Starred += email.starred ? 1 : 0;
    acc.Sent += email.status === "sent" ? 1 : 0;
    acc.Drafts += email.status === "draft" ? 1 : 0;
    acc.Trash += email.status === "trash" ? 1 : 0;
    return acc;
  }, { Inbox:0, Starred:0, Sent:0, Drafts:0, Trash:0 });

  const searchTerm = search.trim().toLowerCase();
  const selectedEmail = emails.find(email => email.id === selected);

  const filtered = emails.filter(email => {
    const inFolder =
      folder === "Starred" ? email.starred
      : folder === "Sent" ? email.status === "sent"
      : folder === "Drafts" ? email.status === "draft"
      : folder === "Trash" ? email.status === "trash"
      : email.status === "inbox";

    if (!inFolder) return false;
    if (!searchTerm) return true;

    const text = [email.from, email.subject, email.preview].join(" ").toLowerCase();
    return text.includes(searchTerm);
  });

  const toggleStar = (id, ev) => {
    ev.stopPropagation();
    setEmails(prev => prev.map(email => email.id === id ? { ...email, starred: !email.starred } : email));
  };

  const deleteEmail = (id) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, status: "trash" } : email));
    if (selected === id) setSelected(null);
  };

  const deleteForever = (id) => {
    setEmails(prev => prev.filter(email => email.id !== id));
    if (selected === id) setSelected(null);
  };

  const restoreEmail = (id) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, status: "inbox" } : email));
    if (selected === id) setSelected(null);
  };

  const openEmail = (id) => {
    setSelected(id === selected ? null : id);
    setEmails(prev => prev.map(email => email.id === id ? { ...email, unread: false } : email));
  };

  const sendEmailHandler = async () => {
    if (!compose.to || !compose.subject || !compose.body) return;
    const payload = {
      to: compose.to,
      subject: compose.subject,
      body: compose.body,
    };

    if (attachment) {
      payload.attachment = {
        filename: attachment.name,
        content: attachment.data,
        contentType: attachment.type,
        encoding: "base64",
      };
    }

    try {
      await sendEmail(payload);
      setEmails(prev => [{ id: Date.now(), from: "You", subject: compose.subject, preview: compose.body.slice(0, 80), date: "Now", starred:false, unread:false, status:"sent", dot:null }, ...prev]);
      setCompose({ to:"", subject:"", body:"" });
      setAttachment(null);
      setAttachmentPreview("");
      setModalOpen(false);
      setFolder("Sent");
    } catch (error) {
      console.error("Unable to send email", error);
      alert("Email send failed. Check backend logs and Gmail configuration.");
    }
  };

  return (
    <div className="mail-layout" style={{ display:"flex", height:"100vh", background:bg, color:txt, fontFamily:"Inter,system-ui,sans-serif", overflow:"hidden" }}>
      {/* Left sidebar */}
      <aside className="mail-sidebar" style={{ width:200, background:side, borderRight:`1px solid ${bdr}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"1.1rem 1rem", borderBottom:`1px solid ${bdr}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30,height:30,background:"#22c55e",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.82rem",color:"#000" }}>T</div>
          <div><div style={{ fontWeight:700,fontSize:"0.88rem" }}>Thiyang</div><div style={{ fontSize:"0.62rem",color:muted }}>Mail</div></div>
        </div>
        <div style={{ padding:"0.75rem" }}>
          <button onClick={()=>setModalOpen(true)} style={{ width:"100%",background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.82rem",padding:"0.6rem",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            Compose
          </button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"0 0.5rem" }}>
          {['Inbox','Starred','Sent','Drafts','Trash'].map(f => {
            const count = folderCounts[f];
            return (
              <button key={f} onClick={()=>setFolder(f)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.5rem 0.6rem",borderRadius:8,border:"none",background:folder===f?"rgba(34,197,94,0.1)":"transparent",color:folder===f?"#22c55e":muted,fontSize:"0.82rem",fontWeight:folder===f?700:400,cursor:"pointer",textAlign:"left" }}>
                <span style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:"0.85rem" }}>{f==="Inbox"?"📥":f==="Starred"?"⭐":f==="Sent"?"📤":f==="Drafts"?"📝":"🗑"}</span>
                  {f}
                </span>
                {count > 0 && <span style={{ background:"#22c55e",color:"#000",fontSize:"0.6rem",fontWeight:700,padding:"1px 6px",borderRadius:999 }}>{count}</span>}
              </button>
            );
          })}
          <div style={{ fontSize:"0.6rem",fontWeight:700,color:muted,letterSpacing:"0.1em",padding:"0.75rem 0.6rem 0.3rem",textTransform:"uppercase" }}>LABELS</div>
          {LABELS.map(l=>(
            <button key={l.name} style={{ width:"100%",display:"flex",alignItems:"center",gap:8,padding:"0.45rem 0.6rem",borderRadius:8,border:"none",background:"transparent",color:muted,fontSize:"0.8rem",cursor:"pointer",textAlign:"left" }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:l.color,display:"inline-block",flexShrink:0 }} />
              {l.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Email list */}
      <div className="mail-content" style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0 }}>
        <div style={{ padding:"0.75rem 1.25rem",borderBottom:`1px solid ${bdr}`,background:side,flexShrink:0 }}>
          <h1 style={{ fontSize:"1.1rem",fontWeight:700,marginBottom:"0.1rem" }}>Mail</h1>
          <p style={{ fontSize:"0.72rem",color:muted,margin:0 }}>Mail inbox and messages.</p>
        </div>
        <div style={{ padding:"0.75rem 1rem",borderBottom:`1px solid ${bdr}`,background:side }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:sub,borderRadius:10,padding:"0.45rem 0.9rem" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search emails..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.82rem",width:"100%" }} />
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"3rem 1.25rem", color:muted, textAlign:"center" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>📭</div>
              <div style={{ fontWeight:600, marginBottom:"0.25rem" }}>
                {folder === "Inbox" ? "No emails yet" : `${folder} is empty`}
              </div>
              <div style={{ fontSize:"0.78rem" }}>
                {folder === "Inbox" ? "Emails you receive will appear here." : "Nothing here yet."}
              </div>
            </div>
          ) : filtered.map(email=>(
            <div key={email.id} onClick={()=>openEmail(email.id)}
              style={{ display:"flex",alignItems:"center",gap:12,padding:"0.85rem 1.25rem",borderBottom:`1px solid ${bdr}`,cursor:"pointer",background:selected===email.id?(dark?"rgba(34,197,94,0.05)":"rgba(34,197,94,0.03)"):email.unread?(dark?"#111318":"#fff"):"transparent",transition:"background 0.15s" }}>
              <button onClick={e=>toggleStar(email.id,e)} style={{ background:"none",border:"none",cursor:"pointer",color:email.starred?"#f59e0b":muted,fontSize:"0.9rem",flexShrink:0,padding:0 }}>
                {email.starred?"★":"☆"}
              </button>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"0.2rem" }}>
                  <span style={{ fontWeight:email.unread?700:500,fontSize:"0.85rem" }}>{email.from}</span>
                  {email.dot && <span style={{ width:7,height:7,borderRadius:"50%",background:email.dot,display:"inline-block",flexShrink:0 }} />}
                </div>
                <div style={{ fontSize:"0.8rem",color:email.unread?txt:muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                  <span style={{ fontWeight:email.unread?600:400 }}>{email.subject}</span>
                  <span style={{ color:muted }}> — {email.preview}</span>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
                <span style={{ fontSize:"0.72rem",color:muted }}>{email.date}</span>
                <div style={{ display:"flex",gap:6 }}>
                  {folder === "Trash" ? (
                    <>
                      <button onClick={e=>{ e.stopPropagation(); restoreEmail(email.id); }} style={{ background:"none",border:"1px solid rgba(255,255,255,0.12)",color:muted,fontSize:"0.68rem",padding:"0.25rem 0.45rem",borderRadius:6,cursor:"pointer" }}>Restore</button>
                      <button onClick={e=>{ e.stopPropagation(); deleteForever(email.id); }} style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"0.68rem",padding:"0.25rem 0.45rem",borderRadius:6,cursor:"pointer" }}>Delete</button>
                    </>
                  ) : (
                    <button onClick={e=>{ e.stopPropagation(); deleteEmail(email.id); }} style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"0.68rem",padding:"0.25rem 0.45rem",borderRadius:6,cursor:"pointer" }}>Trash</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"1rem 1.25rem",borderTop:`1px solid ${bdr}`,background:side, minHeight:120 }}>
          {selectedEmail ? (
            <div style={{ display:"grid",gap:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontSize:"0.92rem",color:muted,marginBottom:"0.15rem" }}>From</div>
                  <div style={{ fontWeight:700,fontSize:"0.95rem" }}>{selectedEmail.from}</div>
                </div>
                <div style={{ textAlign:"right",color:muted,fontSize:"0.82rem" }}>{selectedEmail.date}</div>
              </div>
              <div>
                <h2 style={{ margin:0,fontSize:"1rem",fontWeight:700 }}>{selectedEmail.subject}</h2>
                <p style={{ margin:"0.75rem 0 0",color:muted,lineHeight:1.6 }}>{selectedEmail.preview}</p>
              </div>
              <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                {folder === "Trash" ? (
                  <>
                    <button onClick={()=>restoreEmail(selectedEmail.id)} style={{ background:"none",border:`1px solid ${bdr}`,color:txt,fontSize:"0.88rem",padding:"0.75rem 1rem",borderRadius:10,cursor:"pointer" }}>Restore</button>
                    <button onClick={()=>deleteForever(selectedEmail.id)} style={{ background:"#ef4444",border:"none",color:"#fff",fontSize:"0.88rem",padding:"0.75rem 1rem",borderRadius:10,cursor:"pointer" }}>Delete Forever</button>
                  </>
                ) : (
                  <button onClick={()=>deleteEmail(selectedEmail.id)} style={{ background:"#ef4444",border:"none",color:"#fff",fontSize:"0.88rem",padding:"0.75rem 1rem",borderRadius:10,cursor:"pointer" }}>Move to Trash</button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color:muted,fontSize:"0.92rem" }}>
              Select an email to preview its details, or compose a new message using the button above.
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300 }}>
          <div style={{ width:"100%",maxWidth:560,background:side,border:`1px solid ${bdr}`,borderRadius:18,padding:"1.25rem",boxShadow:"0 18px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
              <h2 style={{ margin:0,fontSize:"1rem",fontWeight:700 }}>Compose Email</h2>
              <button onClick={()=>setModalOpen(false)} style={{ background:"none",border:"none",color:muted,fontSize:"1.2rem",cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"grid",gap:"0.85rem" }}>
              <input value={compose.to} onChange={e=>setCompose(c=>({...c,to:e.target.value}))} placeholder="To" style={{ width:"100%",padding:"0.85rem 1rem",borderRadius:12,border:`1px solid ${bdr}`,background:sub,color:txt,fontSize:"0.95rem" }} />
              <input value={compose.subject} onChange={e=>setCompose(c=>({...c,subject:e.target.value}))} placeholder="Subject" style={{ width:"100%",padding:"0.85rem 1rem",borderRadius:12,border:`1px solid ${bdr}`,background:sub,color:txt,fontSize:"0.95rem" }} />
              <textarea value={compose.body} onChange={e=>setCompose(c=>({...c,body:e.target.value}))} placeholder="Message" rows={8} style={{ width:"100%",padding:"0.85rem 1rem",borderRadius:12,border:`1px solid ${bdr}`,background:sub,color:txt,fontSize:"0.95rem",resize:"vertical" }} />
              <div style={{ display:"grid",gap:10 }}>
                <label style={{ fontSize:"0.82rem", color:muted }}>
                  Attachment
                  <input type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = reader.result?.toString().split(",")[1] || "";
                      setAttachment({ name: file.name, type: file.type, data: base64 });
                      setAttachmentPreview(reader.result?.toString() || "");
                    };
                    reader.readAsDataURL(file);
                  }} style={{ display:"block", marginTop:8, color:txt }} />
                </label>
                {attachmentPreview && (
                  <div style={{ border:`1px solid ${bdr}`, borderRadius:12, overflow:"hidden", maxWidth:240 }}>
                    <img src={attachmentPreview} alt="Attachment preview" style={{ width:"100%", display:"block" }} />
                  </div>
                )}
              </div>
              <div style={{ display:"flex",justifyContent:"flex-end",gap:10 }}>
                <button onClick={()=>setModalOpen(false)} style={{ background:sub,border:`1px solid ${bdr}`,color:txt,padding:"0.7rem 1.1rem",borderRadius:12,cursor:"pointer" }}>Cancel</button>
                <button onClick={sendEmailHandler} style={{ background:"#22c55e",border:"none",color:"#000",padding:"0.7rem 1.2rem",borderRadius:12,fontWeight:700,cursor:"pointer" }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
