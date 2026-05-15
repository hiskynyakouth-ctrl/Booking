import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import UserLayout from "../layouts/UserLayout";

export default function UserProfile() {
  const { user, login: updateUser } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const fileRef = useRef(null);

  const saved = JSON.parse(localStorage.getItem(`profile_${user?.id}`) || "{}");

  const [avatar,   setAvatar]   = useState(saved.avatar   || null);
  const [name,     setName]     = useState(saved.name     || user?.name     || "");
  const [email,    setEmail]    = useState(saved.email    || user?.email    || "");
  const [phone,    setPhone]    = useState(saved.phone    || "");
  const [address,  setAddress]  = useState(saved.address  || "");
  const [bio,      setBio]      = useState(saved.bio      || "");
  const [saved2,   setSaved2]   = useState(false);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const inp  = { width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 1rem", color:txt, fontSize:"0.88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = { avatar, name, email, phone, address, bio };
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(data));
    // Update AuthContext so navbar/sidebar reflects new name
    updateUser({ ...user, name, email });
    setSaved2(true);
    setTimeout(() => setSaved2(false), 2500);
  };

  return (
    <UserLayout>
      <div style={{ maxWidth:680, margin:"0 auto", padding:"2rem 1.5rem" }}>
        <h1 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:"0.25rem" }}>My Profile</h1>
        <p style={{ fontSize:"0.78rem", color:muted, marginBottom:"1.75rem" }}>Update your personal information</p>

        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

          {/* Avatar */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem", display:"flex", alignItems:"center", gap:"1.5rem", flexWrap:"wrap" }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div onClick={() => fileRef.current.click()} style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", cursor:"pointer", overflow:"hidden", border:`3px solid ${bdr}` }}>
                {avatar ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
              </div>
              <div onClick={() => fileRef.current.click()} style={{ position:"absolute", bottom:0, right:0, width:24, height:24, background:"#22c55e", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", cursor:"pointer", border:`2px solid ${card}` }}>✏️</div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display:"none" }} />
            </div>
            <div>
              <button type="button" onClick={() => fileRef.current.click()} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.2rem", borderRadius:8, cursor:"pointer", marginBottom:"0.4rem", display:"block" }}>
                Change avatar
              </button>
              <p style={{ fontSize:"0.72rem", color:muted, margin:0 }}>JPG, PNG or GIF. Max 2MB</p>
            </div>
          </div>

          {/* Name + Email */}
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div>
                <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>First name</label>
                <input value={name.split(" ")[0] || ""} onChange={e => setName(e.target.value + " " + (name.split(" ")[1] || ""))} style={inp} placeholder="First name" />
              </div>
              <div>
                <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Last name</label>
                <input value={name.split(" ").slice(1).join(" ") || ""} onChange={e => setName((name.split(" ")[0] || "") + " " + e.target.value)} style={inp} placeholder="Last name" />
              </div>
            </div>
            <div>
              <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="you@gmail.com" />
            </div>
            <div>
              <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Phone number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inp} placeholder="+251 94 741 4318" />
            </div>
            <div>
              <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Address <span style={{ color:muted, fontWeight:400 }}>(optional)</span></label>
              <input value={address} onChange={e => setAddress(e.target.value)} style={inp} placeholder="123 Main St, City, Country" />
            </div>
            <div>
              <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Bio <span style={{ color:muted, fontWeight:400 }}>(optional)</span></label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...inp, resize:"vertical" }} placeholder="Tell us a little about yourself..." />
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem" }}>
            {saved2 && <span style={{ color:"#22c55e", fontSize:"0.82rem", alignSelf:"center" }}>✓ Saved</span>}
            <button type="submit" style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.88rem", padding:"0.65rem 1.75rem", borderRadius:10, cursor:"pointer" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}
