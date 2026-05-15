import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { languageNames } from "../i18n";
import UserLayout from "../layouts/UserLayout";

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ width:40, height:22, borderRadius:999, background:on?"#22c55e":"#2a2f45", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?21:3, transition:"left 0.2s" }} />
    </div>
  );
}

export default function UserSettings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useLanguage();
  const dark = theme === "dark";

  const key = `user_settings_${user?.id}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");

  const [tab,           setTab]           = useState("Profile");
  const [currentPw,     setCurrentPw]     = useState("");
  const [newPw,         setNewPw]         = useState("");
  const [confirmPw,     setConfirmPw]     = useState("");
  const [pwError,       setPwError]       = useState("");
  const [pwSuccess,     setPwSuccess]     = useState(false);
  const [emailNotif,    setEmailNotif]    = useState(stored.emailNotif    ?? true);
  const [pushNotif,     setPushNotif]     = useState(stored.pushNotif     ?? true);
  const [bookingAlerts, setBookingAlerts] = useState(stored.bookingAlerts ?? true);
  const [promoEmails,   setPromoEmails]   = useState(stored.promoEmails   ?? false);
  const [profilePublic, setProfilePublic] = useState(stored.profilePublic ?? false);
  const [showActivity,  setShowActivity]  = useState(stored.showActivity  ?? true);
  const [saved,         setSaved]         = useState(false);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const inp  = { width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 1rem", color:txt, fontSize:"0.88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const TABS = ["Profile","Preferences","Appearance"];

  const saveSettings = () => {
    localStorage.setItem(key, JSON.stringify({ emailNotif, pushNotif, bookingAlerts, promoEmails, profilePublic, showActivity }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = (e) => {
    e.preventDefault();
    setPwError("");
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const me = users.find(u => u.id === user?.id);
    if (!me || me.password !== currentPw) { setPwError("Current password is incorrect."); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    const updated = users.map(u => u.id === user?.id ? { ...u, password: newPw } : u);
    localStorage.setItem("mock_users", JSON.stringify(updated));
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const Row = ({ label, sub, children }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 0", borderBottom:`1px solid ${bdr}` }}>
      <div>
        <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{label}</div>
        {sub && <div style={{ fontSize:"0.72rem", color:muted, marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <UserLayout>
      <div style={{ maxWidth:680, margin:"0 auto", padding:"2rem 1.5rem" }}>
        <h1 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:"0.25rem" }}>Settings</h1>
        <p style={{ fontSize:"0.78rem", color:muted, marginBottom:"1.5rem" }}>Manage your account settings and preferences.</p>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:"1.5rem", borderBottom:`1px solid ${bdr}`, paddingBottom:"0.5rem" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"0.4rem 1rem", borderRadius:8, border:"none", fontSize:"0.82rem", background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent", color:tab===t?txt:muted, fontWeight:tab===t?700:400, cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        {/* Profile tab — password change */}
        {tab === "Profile" && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"0.25rem" }}>Change Password</h3>
            <p style={{ fontSize:"0.72rem", color:muted, marginBottom:"1.25rem" }}>Update your account password</p>
            <form onSubmit={changePassword} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {pwError && <p style={{ color:"#ef4444", fontSize:"0.78rem", background:"rgba(239,68,68,0.1)", padding:"0.5rem 0.75rem", borderRadius:8, margin:0 }}>{pwError}</p>}
              {pwSuccess && <p style={{ color:"#22c55e", fontSize:"0.78rem", background:"rgba(34,197,94,0.1)", padding:"0.5rem 0.75rem", borderRadius:8, margin:0 }}>✓ Password updated successfully</p>}
              {[["Current password", currentPw, setCurrentPw], ["New password", newPw, setNewPw], ["Confirm new password", confirmPw, setConfirmPw]].map(([label, val, setter]) => (
                <div key={label}>
                  <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>{label}</label>
                  <input type="password" value={val} onChange={e => setter(e.target.value)} required style={inp} placeholder="••••••••" />
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button type="submit" style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.6rem 1.5rem", borderRadius:10, cursor:"pointer" }}>Update Password</button>
              </div>
            </form>
          </div>
        )}

        {/* Preferences tab — notifications + privacy */}
        {tab === "Preferences" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Notifications</h3>
              <Row label="Email Notifications" sub="Receive booking confirmations by email"><Toggle on={emailNotif} onChange={() => setEmailNotif(s=>!s)} /></Row>
              <Row label="Push Notifications" sub="Alerts and reminders in the app"><Toggle on={pushNotif} onChange={() => setPushNotif(s=>!s)} /></Row>
              <Row label="Booking Alerts" sub="Notify me when a booking status changes"><Toggle on={bookingAlerts} onChange={() => setBookingAlerts(s=>!s)} /></Row>
              <Row label="Promotional Emails" sub="Offers, updates and news" style={{ borderBottom:"none" }}><Toggle on={promoEmails} onChange={() => setPromoEmails(s=>!s)} /></Row>
            </div>
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Privacy</h3>
              <Row label="Public Profile" sub="Allow others to see your profile"><Toggle on={profilePublic} onChange={() => setProfilePublic(s=>!s)} /></Row>
              <Row label="Show Activity" sub="Show when you were last active"><Toggle on={showActivity} onChange={() => setShowActivity(s=>!s)} /></Row>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem" }}>
              {saved && <span style={{ color:"#22c55e", fontSize:"0.82rem", alignSelf:"center" }}>✓ Saved</span>}
              <button onClick={saveSettings} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.6rem 1.5rem", borderRadius:10, cursor:"pointer" }}>Save Preferences</button>
            </div>
          </div>
        )}

        {/* Appearance tab — theme + language */}
        {tab === "Appearance" && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Appearance</h3>
            <Row label="Dark Mode" sub="Switch between light and dark theme">
              <Toggle on={dark} onChange={toggle} />
            </Row>
            <Row label="Language" sub="Choose your preferred language">
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ background:dark?"#1e2330":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:8, padding:"0.4rem 0.75rem", color:txt, fontSize:"0.78rem", outline:"none", cursor:"pointer" }}>
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code} style={{ background:dark?"#111318":"#fff" }}>{name}</option>
                ))}
              </select>
            </Row>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
