import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const NAV_ICONS = [
  { icon: "🏠", to: "/" },
  { icon: "📅", to: "/bookings" },
  { icon: "🛍️", to: "/shop" },
  { icon: "👤", to: "/profile" },
  { icon: "⚙️", to: "/settings" },
];

const INITIAL_SERVICES = [
  { id:1, name:"Hair Salon",          sub:"Beauty",  icon:"💇", status:"Running",   color:"#22c55e", to:"/booking" },
  { id:2, name:"Personal Trainer",    sub:"Fitness", icon:"🏋️", status:"Running",   color:"#22c55e", to:"/booking" },
  { id:3, name:"Doctor Consultation", sub:"Health",  icon:"🩺", status:"Scheduled", color:"#f59e0b", to:"/booking" },
  { id:4, name:"Nail Studio",         sub:"Beauty",  icon:"💅", status:"Running",   color:"#22c55e", to:"/booking" },
];

const STATS_KEYS = ["total_bookings","completed","upcoming","cancelled"];
const STATS_VALS = ["12","8","3","1"];

// persist helpers
const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export default function Profile() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { t }     = useLanguage();
  const fileRef   = useRef(null);

  const [avatar,   setAvatar]   = useState(() => load("profile_avatar", null));
  const [editing,  setEditing]  = useState(false);
  const [name,     setName]     = useState(() => load("profile_name",  "Alex Johnson"));
  const [email,    setEmail]    = useState(() => load("profile_email", "alex@gmail.com"));
  const [phone,    setPhone]    = useState(() => load("profile_phone", "+251 94 741 4318"));
  const [services, setServices] = useState(INITIAL_SERVICES);

  // avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
      save("profile_avatar", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // remove a service card
  const removeService = (id) =>
    setServices(prev => prev.filter(s => s.id !== id));

  const glass = {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)", fontFamily:"Inter,system-ui,sans-serif", color:"#fff", position:"relative", overflow:"hidden" }}>

      {/* Blobs */}
      {[["20%","10%","#6366f1"],["70%","60%","#8b5cf6"],["10%","70%","#3b82f6"]].map(([top,left,c],i) => (
        <div key={i} style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:c, opacity:0.12, filter:"blur(80px)", top, left, pointerEvents:"none" }} />
      ))}

      {/* Sidebar */}
      <aside style={{ width:56, display:"flex", flexDirection:"column", alignItems:"center", padding:"1.25rem 0", gap:"1.5rem", background:"rgba(0,0,0,0.25)", backdropFilter:"blur(12px)", borderRight:"1px solid rgba(255,255,255,0.06)", zIndex:10, flexShrink:0 }}>
        <div style={{ width:32, height:32, background:"linear-gradient(135deg,#22c55e,#16a34a)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", marginBottom:"0.5rem" }}>✦</div>
        {NAV_ICONS.map(n => (
          <Link key={n.to} to={n.to} style={{ fontSize:"1.1rem", opacity: location.pathname===n.to ? 1 : 0.35, textDecoration:"none", transition:"opacity 0.15s", filter: location.pathname===n.to ? "none" : "grayscale(1)" }}>
            {n.icon}
          </Link>
        ))}
        <div style={{ marginTop:"auto", fontSize:"1rem", opacity:0.3 }}>···</div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", zIndex:1, overflowY:"auto" }}>

        {/* Header */}
        <div style={{ padding:"1.5rem 2rem 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"0.7rem", letterSpacing:"0.2em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase" }}>{t("profile")}</span>
          <button onClick={() => navigate("/bookings")} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", fontSize:"0.75rem", padding:"0.4rem 1rem", borderRadius:999, cursor:"pointer" }}>
            {t("bookings")}
          </button>
        </div>

        <div style={{ padding:"1.5rem 2rem 3rem", display:"flex", flexDirection:"column", gap:"1.5rem" }}>

          {/* Profile card + stats */}
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>

            {/* Profile card */}
            <div style={{ ...glass, padding:"1.75rem", display:"flex", gap:"1.5rem", alignItems:"flex-start", flex:"1 1 360px" }}>

              {/* Avatar */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", cursor:"pointer", overflow:"hidden", border:"2px solid rgba(255,255,255,0.15)" }}
                >
                  {avatar
                    ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : "👤"}
                </div>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ position:"absolute", bottom:0, right:0, width:22, height:22, background:"#22c55e", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", cursor:"pointer", border:"2px solid #1a1a2e" }}
                >✏️</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:"none" }} />
              </div>

              {/* Fields */}
              <div style={{ flex:1 }}>
                {editing ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[[t("full_name"), name, setName], [t("email"), email, setEmail], ["Phone", phone, setPhone]].map(([label, val, setter]) => (
                      <div key={label}>
                        <label style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:2 }}>{label}</label>
                        <input value={val} onChange={e => setter(e.target.value)}
                          style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"0.4rem 0.75rem", color:"#fff", fontSize:"0.82rem", outline:"none", width:"100%" }} />
                      </div>
                    ))}
                    <button onClick={() => {
                        save("profile_name",  name);
                        save("profile_email", email);
                        save("profile_phone", phone);
                        setEditing(false);
                      }}
                      style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.78rem", padding:"0.45rem 1.2rem", borderRadius:999, cursor:"pointer", alignSelf:"flex-start", marginTop:4 }}>
                      {t("save")}
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize:"1.2rem", fontWeight:700, marginBottom:"0.25rem" }}>{name}</h2>
                    <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", marginBottom:"0.2rem" }}>{email}</p>
                    <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", marginBottom:"1rem" }}>{phone}</p>
                    <button onClick={() => setEditing(true)}
                      style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontSize:"0.72rem", padding:"0.35rem 1rem", borderRadius:999, cursor:"pointer" }}>
                      {t("edit_profile")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", flex:"1 1 240px" }}>
              {STATS_KEYS.map((key, i) => (
                <div key={key} style={{ ...glass, padding:"1.1rem", display:"flex", flexDirection:"column", gap:4 }}>
                  <span style={{ fontSize:"1.6rem", fontWeight:800 }}>{STATS_VALS[i]}</span>
                  <span style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)" }}>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services grid */}
          <div>
            <p style={{ fontSize:"0.7rem", letterSpacing:"0.2em", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", marginBottom:"1rem" }}>{t("my_services")}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem" }}>

              {services.map(s => (
                <div key={s.id} style={{ ...glass, padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem", position:"relative" }}>
                  {/* Remove button */}
                  <button
                    onClick={() => removeService(s.id)}
                    style={{ position:"absolute", top:10, right:10, width:22, height:22, borderRadius:"50%", background:"rgba(239,68,68,0.15)", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"0.7rem", display:"flex", alignItems:"center", justifyContent:"center" }}
                    title="Remove"
                  >✕</button>

                  <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem" }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", marginBottom:"0.2rem" }}>{s.sub}</p>
                    <h3 style={{ fontSize:"1rem", fontWeight:700, lineHeight:1.3 }}>{s.name}</h3>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.72rem" }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:s.color, display:"inline-block" }} />
                    <span style={{ color:s.color, fontWeight:600 }}>{s.status}</span>
                  </div>
                  <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.3)" }}>Hosted on Thiyang</p>
                  <button
                    onClick={() => navigate(s.to)}
                    style={{ alignSelf:"flex-end", background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.72rem", padding:"0.4rem 1rem", borderRadius:999, cursor:"pointer", marginTop:"auto" }}>
                    OPEN
                  </button>
                </div>
              ))}

              {/* Discover / Add new card */}
              <div
                onClick={() => navigate("/")}
                style={{ background:"transparent", border:"2px dashed rgba(255,255,255,0.15)", borderRadius:20, padding:"1.25rem", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:180, cursor:"pointer", gap:"0.75rem", transition:"border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(34,197,94,0.5)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}
              >
                <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem" }}>+</div>
                <p style={{ fontSize:"0.9rem", fontWeight:300, color:"rgba(255,255,255,0.6)", lineHeight:1.5, textAlign:"center" }}>
                  Find something<br />new in the<br />
                  <span style={{ color:"#22c55e", fontWeight:600 }}>Explore ✦</span>
                </p>
                <span style={{ fontSize:"0.75rem", color:"#22c55e" }}>Browse services →</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
