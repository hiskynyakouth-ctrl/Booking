import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { languageNames } from "../i18n";
import DashboardLayout from "../layouts/DashboardLayout";

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ width:40, height:22, borderRadius:999, background:on?"#22c55e":"#2a2f45", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?21:3, transition:"left 0.2s" }} />
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useLanguage();
  const { logout } = useAuth();
  const dark = theme === "dark";

  const key = "admin_settings";
  const stored = JSON.parse(localStorage.getItem(key) || "{}");

  const [tab,           setTab]           = useState("Profile");
  const [notifications, setNotifications] = useState(stored.notifications ?? true);
  const [emailAlerts,   setEmailAlerts]   = useState(stored.emailAlerts   ?? true);
  const [bookingAlerts, setBookingAlerts] = useState(stored.bookingAlerts ?? true);
  const [smsAlerts,     setSmsAlerts]     = useState(stored.smsAlerts     ?? false);
  const [saved,         setSaved]         = useState(false);

  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const saveSettings = () => {
    localStorage.setItem(key, JSON.stringify({ notifications, emailAlerts, bookingAlerts, smsAlerts }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Row = ({ label, sub: desc, children }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 0", borderBottom:`1px solid ${bdr}` }}>
      <div>
        <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{label}</div>
        {desc && <div style={{ fontSize:"0.72rem", color:muted, marginTop:2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const TABS = ["Profile","Notifications","Appearance","Security"];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account settings and preferences.">
      <div style={{ maxWidth:680, margin:"0 auto", padding:"1.5rem" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:"1.5rem", borderBottom:`1px solid ${bdr}`, paddingBottom:"0.5rem", flexWrap:"wrap" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"0.4rem 1rem", borderRadius:8, border:"none", fontSize:"0.82rem", background:tab===t?(dark?"#1e2330":"#e5e7eb"):"transparent", color:tab===t?txt:muted, fontWeight:tab===t?700:400, cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "Profile" && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Admin Profile</h3>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.1rem", color:"#000" }}>TK</div>
              <div>
                <div style={{ fontWeight:700 }}>Thiyang Admin</div>
                <div style={{ fontSize:"0.78rem", color:muted }}>admin@thiyang.com</div>
                <div style={{ fontSize:"0.72rem", color:"#22c55e", marginTop:2 }}>Administrator</div>
              </div>
            </div>
            <button onClick={() => navigate("/profile")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.25rem", borderRadius:8, cursor:"pointer" }}>
              Edit Profile
            </button>
          </div>
        )}

        {/* Notifications tab */}
        {tab === "Notifications" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
              <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Notification Preferences</h3>
              <Row label="Push Notifications" sub="Receive alerts in the dashboard"><Toggle on={notifications} onChange={() => setNotifications(s=>!s)} /></Row>
              <Row label="Email Alerts" sub="Booking confirmations and updates"><Toggle on={emailAlerts} onChange={() => setEmailAlerts(s=>!s)} /></Row>
              <Row label="Booking Alerts" sub="New bookings and cancellations"><Toggle on={bookingAlerts} onChange={() => setBookingAlerts(s=>!s)} /></Row>
              <Row label="SMS Alerts" sub="Critical alerts via SMS"><Toggle on={smsAlerts} onChange={() => setSmsAlerts(s=>!s)} /></Row>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem" }}>
              {saved && <span style={{ color:"#22c55e", fontSize:"0.82rem", alignSelf:"center" }}>✓ Saved</span>}
              <button onClick={saveSettings} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.6rem 1.5rem", borderRadius:10, cursor:"pointer" }}>Save</button>
            </div>
          </div>
        )}

        {/* Appearance tab */}
        {tab === "Appearance" && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Appearance</h3>
            <Row label="Dark Mode" sub="Switch between light and dark theme">
              <Toggle on={dark} onChange={toggle} />
            </Row>
            <Row label="Language" sub="Choose your preferred language">
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ background:sub, border:`1px solid ${bdr}`, borderRadius:8, padding:"0.4rem 0.75rem", color:txt, fontSize:"0.78rem", outline:"none", cursor:"pointer" }}>
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code} style={{ background:dark?"#111318":"#fff" }}>{name}</option>
                ))}
              </select>
            </Row>
          </div>
        )}

        {/* Security tab */}
        {tab === "Security" && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:"1rem" }}>Security</h3>
            <Row label="Two-Factor Authentication" sub="Add an extra layer of security">
              <Toggle on={false} onChange={() => {}} />
            </Row>
            <Row label="Session Timeout" sub="Auto logout after inactivity">
              <select style={{ background:sub, border:`1px solid ${bdr}`, borderRadius:8, padding:"0.4rem 0.75rem", color:txt, fontSize:"0.78rem", outline:"none", cursor:"pointer" }}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>Never</option>
              </select>
            </Row>
            <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:`1px solid ${bdr}` }}>
              <button onClick={() => { logout(); navigate("/login"); }} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:"0.85rem", padding:"0.55rem 1.5rem", borderRadius:10, cursor:"pointer", fontWeight:600 }}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
