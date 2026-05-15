import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle    from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import LocationMap from "./LocationMap";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth }     from "../../context/AuthContext";

const NAV_LINKS = [
  { key:"nav_explore",  to:"/"         },
  { key:"nav_bookings", to:"/bookings" },
  { key:"nav_shop",     to:"/shop"     },
  {  key:"nav_messages", to:"/messages" },
  { key:"nav_about",    to:"/about"    },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t }     = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); setOpen(false); };

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:50,
      background:"rgba(10,10,10,0.95)",
      backdropFilter:"blur(14px)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",
      fontFamily:"Inter,system-ui,sans-serif",
    }}>
      {/* ── Main bar ── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 1rem", display:"flex", alignItems:"center", height:52, gap:"0.5rem" }}>

        {/* Logo */}
        <Link to="/" style={{ fontWeight:800, fontSize:"0.95rem", color:"#fff", textDecoration:"none", flexShrink:0, marginRight:"0.5rem" }}>
          Thiyang<span style={{ color:"#d4a017" }}>.</span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display:"flex", gap:2, flex:1 }} className="nav-links">
          {NAV_LINKS.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} style={{
                padding:"0.3rem 0.65rem", borderRadius:7, fontSize:"0.78rem",
                fontWeight: active ? 600 : 400,
                color: active ? "#fff" : "#888",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                textDecoration:"none", transition:"all 0.15s", whiteSpace:"nowrap",
              }}>
                {t(l.key)}
              </Link>
            );
          })}
        </div>

        {/* Right — desktop */}
        <div style={{ display:"flex", gap:"0.4rem", alignItems:"center", flexShrink:0 }} className="nav-right-full">
          <button onClick={() => setShowLocation(true)} style={{
            background:"none", border:"none", color:"#888",
            fontSize:"1rem", cursor:"pointer", padding:"0.2rem",
            borderRadius:4, transition:"all 0.15s",
          }} title="Show my location">
            📍
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              <Link to={isAdmin ? "/dashboard" : "/user-dashboard"} style={{
                fontSize:"0.72rem", color:"#888", textDecoration:"none",
                padding:"0.28rem 0.65rem", borderRadius:7,
                border:"1px solid rgba(255,255,255,0.1)", whiteSpace:"nowrap",
              }}>
                {isAdmin ? "Admin" : t("my_dashboard")}
              </Link>
              <button onClick={handleLogout} style={{
                background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)",
                color:"#ef4444", fontSize:"0.72rem", cursor:"pointer",
                padding:"0.28rem 0.65rem", borderRadius:7, whiteSpace:"nowrap",
              }}>
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} style={{
                background:"none", border:"none", color:"#aaa",
                fontSize:"0.78rem", cursor:"pointer", padding:"0.28rem 0.5rem",
              }}>
                {t("nav_login")}
              </button>
              <button onClick={() => navigate("/signup")} style={{
                background:"#d4a017", border:"none", color:"#000",
                fontWeight:700, fontSize:"0.75rem",
                padding:"0.32rem 0.85rem", borderRadius:999, cursor:"pointer",
                whiteSpace:"nowrap",
              }}>
                {t("nav_signup")}
              </button>
            </>
          )}
        </div>

        {/* Right — mobile (just theme + hamburger) */}
        <div style={{ display:"none", gap:"0.4rem", alignItems:"center" }} className="nav-right-min">
          <button onClick={() => setShowLocation(true)} style={{
            background:"none", border:"none", color:"#fff",
            fontSize:"1rem", cursor:"pointer", padding:"0.2rem",
          }} title="Show my location">
            📍
          </button>
          <ThemeToggle />
          <button onClick={() => setOpen(o => !o)} style={{
            background:"none", border:"none", color:"#fff",
            fontSize:"1.2rem", cursor:"pointer", padding:"0.2rem",
            lineHeight:1,
          }}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div style={{
          background:"#111", borderTop:"1px solid #222",
          padding:"0.75rem 1rem 1rem",
          display:"flex", flexDirection:"column", gap:4,
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              padding:"0.55rem 0.5rem", fontSize:"0.88rem",
              color: location.pathname === l.to ? "#d4a017" : "#ccc",
              textDecoration:"none", borderBottom:"1px solid #1a1a1a",
            }}>
              {t(l.key)}
            </Link>
          ))}

          {user ? (
            <>
              <Link to={isAdmin ? "/dashboard" : "/user-dashboard"} onClick={() => setOpen(false)} style={{ padding:"0.55rem 0.5rem", fontSize:"0.88rem", color:"#ccc", textDecoration:"none", borderBottom:"1px solid #1a1a1a" }}>
                {isAdmin ? "Admin Dashboard" : t("my_dashboard")}
              </Link>
              <button onClick={handleLogout} style={{ background:"none", border:"none", color:"#ef4444", fontSize:"0.88rem", cursor:"pointer", textAlign:"left", padding:"0.55rem 0.5rem" }}>
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  onClick={() => setOpen(false)} style={{ padding:"0.55rem 0.5rem", fontSize:"0.88rem", color:"#ccc", textDecoration:"none", borderBottom:"1px solid #1a1a1a" }}>{t("nav_login")}</Link>
              <Link to="/signup" onClick={() => setOpen(false)} style={{ padding:"0.55rem 0.5rem", fontSize:"0.88rem", color:"#d4a017", fontWeight:700, textDecoration:"none" }}>{t("nav_signup")}</Link>
            </>
          )}

          <div style={{ paddingTop:"0.5rem" }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}

      {/* ── Location Modal ── */}
      {showLocation && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,0,0.5)", zIndex:100,
          display:"flex", alignItems:"center", justifyContent:"center",
        }} onClick={() => setShowLocation(false)}>
          <div style={{
            background:"#fff", borderRadius:12, padding:"1.5rem",
            maxWidth:500, width:"90%", maxHeight:"80vh", overflow:"auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h3 style={{ fontSize:"1.25rem", fontWeight:700, color:"#111" }}>Your Location</h3>
              <button onClick={() => setShowLocation(false)} style={{
                background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:"#666"
              }}>×</button>
            </div>
            <LocationMap height={300} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .nav-links      { display: none !important; }
          .nav-right-full { display: none !important; }
          .nav-right-min  { display: flex !important; }
        }
        @media (max-width: 900px) {
          .nav-right-full .lang-switcher { display: none; }
        }
      `}</style>
    </nav>
  );
}
