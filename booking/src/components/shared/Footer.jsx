import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const LINKS = {
  Services: [
    { label: "Hair Salon",          to: "/booking" },
    { label: "Doctor Consultation", to: "/booking" },
    { label: "Personal Trainer",    to: "/booking" },
    { label: "Barbershop",          to: "/booking" },
    { label: "Nail Studio",         to: "/booking" },
  ],
  Company: [
    { label: "About Us",   to: "/about"   },
    { label: "Explore",    to: "/"        },
    { label: "Shop",       to: "/shop"    },
    { label: "Clients",    to: "/clients" },
  ],
  Account: [
    { label: "Sign Up",       to: "/signup"   },
    { label: "Login",         to: "/login"    },
    { label: "My Bookings",   to: "/my-bookings" },
    { label: "My Payments",   to: "/my-payments" },
  ],
};

const SOCIALS = [
  { label: "Facebook",  href: "#", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  )},
  { label: "Instagram", href: "#", icon: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  )},
  { label: "Twitter",   href: "#", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  )},
  { label: "YouTube",   href: "#", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
  )},
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
      borderTop: "1px solid rgba(212,160,23,0.15)",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#fff",
    }}>
      {/* Top CTA strip */}
      <div style={{
        background: "linear-gradient(90deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.04) 100%)",
        borderBottom: "1px solid rgba(212,160,23,0.1)",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
      </div>

      {/* Main footer content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "2.5rem",
        }} className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{
                width: 36, height: 36, background: "#d4a017", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "1rem", color: "#000", flexShrink: 0,
              }}>T</div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
                Thiyang<span style={{ color: "#d4a017" }}>.</span>
              </span>
            </div>
            <p style={{ color: "#666", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: 260 }}>
              Ethiopia's premier booking platform. Connect with top local businesses — salons, clinics, trainers, and more.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#888", textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,160,23,0.15)"; e.currentTarget.style.color = "#d4a017"; e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                {section}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={{ color: "#666", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = "#d4a017"}
                      onMouseLeave={e => e.target.style.color = "#666"}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div style={{
          display: "flex", gap: "1.5rem", flexWrap: "wrap",
          padding: "1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          margin: "2rem 0 1.5rem",
        }}>
          {[
            { icon: "📍", text: "Addis Ababa, Ethiopia" },
            { icon: "📞", text: "+251 977638959" },
            { icon: "✉️", text: "support@thiyang.com" },
            { icon: "🕐", text: "Mon–Sat, 8AM–8PM EAT" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#666" }}>
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ color: "#444", fontSize: "0.75rem", margin: 0 }}>
            © {year} Thiyang. {t("rights")}
          </p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {["Terms", "Privacy", "Cookies"].map(item => (
              <a key={item} href="#" style={{ color: "#444", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = "#d4a017"}
                onMouseLeave={e => e.target.style.color = "#444"}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
