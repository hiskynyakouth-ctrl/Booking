import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/shared/Footer";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const SERVICES = [
  {
    id: 1, category: "Beauty", title: "Hair Salon", rating: 4.9, reviews: 128, price: "From Br 200",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=220&fit=crop&auto=format",
    description: "Professional cuts, color & styling.",
    detail: "Transform your look with our expert stylists. From precision cuts to vibrant color treatments, we deliver salon-quality results tailored to your style.",
    features: ["Expert stylists with 5+ years experience","Color, highlights & balayage","Blowouts & special occasion styling","Relaxing scalp treatments"],
    cta: "Book your style session today and walk out feeling confident.",
    amount: 200,
  },
  {
    id: 2, category: "Health", title: "Doctor Consultation", rating: 4.8, reviews: 94, price: "From Br 300",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=220&fit=crop&auto=format",
    description: "Certified physicians, same-day visits.",
    detail: "Get fast, reliable care from experienced professionals whenever you need it.",
    features: ["Certified physicians","Same-day visits","Easy online booking","Secure consultations"],
    cta: "Schedule your appointment today and get quality care without the long wait.",
    amount: 300,
  },
  {
    id: 3, category: "Fitness", title: "Personal Trainer", rating: 4.7, reviews: 76, price: "From Br 500",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=220&fit=crop&auto=format",
    description: "One-on-one coaching sessions.",
    detail: "Reach your fitness goals faster with a dedicated personal trainer.",
    features: ["Personalized workout programs","Nutrition guidance","Progress tracking","Flexible session times"],
    cta: "Start your fitness journey today.",
    amount: 500,
  },
  {
    id: 4, category: "Beauty", title: "Barbershop", rating: 4.9, reviews: 210, price: "From Br 150",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=220&fit=crop&auto=format",
    description: "Classic cuts, fades & beard trims.",
    detail: "Experience the classic barbershop tradition with modern precision.",
    features: ["Classic & modern haircuts","Skin fades & tapers","Beard shaping","Hot towel shave"],
    cta: "Walk in sharp, walk out sharper.",
    amount: 150,
  },
  {
    id: 5, category: "Health", title: "Dental Checkup", rating: 4.6, reviews: 58, price: "From Br 400",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=220&fit=crop&auto=format",
    description: "Full exam, cleaning & X-rays.",
    detail: "Keep your smile healthy with a comprehensive dental checkup.",
    features: ["Full oral examination","Professional cleaning","Digital X-rays","Cavity prevention"],
    cta: "Book your checkup and keep your smile bright.",
    amount: 400,
  },
  {
    id: 6, category: "Fashion", title: "Personal Stylist", rating: 4.8, reviews: 43, price: "From Br 600",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop&auto=format",
    description: "Wardrobe curation & styling advice.",
    detail: "Elevate your personal style with expert guidance.",
    features: ["Wardrobe audit","Personalized style profile","Shopping assistance","Outfit planning"],
    cta: "Dress with confidence every day.",
    amount: 600,
  },
  {
    id: 7, category: "Fitness", title: "Yoga Class", rating: 4.7, reviews: 89, price: "From Br 150",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=220&fit=crop&auto=format",
    description: "Guided sessions for all levels.",
    detail: "Find balance, flexibility, and inner peace with our guided yoga sessions.",
    features: ["All skill levels welcome","Hatha, Vinyasa & Restorative","Breathwork & meditation","Private sessions available"],
    cta: "Roll out your mat and start your wellness journey today.",
    amount: 150,
  },
  {
    id: 8, category: "Home", title: "House Cleaning", rating: 4.5, reviews: 162, price: "From Br 600",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=220&fit=crop&auto=format",
    description: "Deep cleaning for your space.",
    detail: "Come home to a spotless space with eco-friendly products.",
    features: ["Full home deep cleaning","Eco-friendly products","Flexible scheduling","Background-checked staff"],
    cta: "Book a clean today and enjoy a fresh, spotless home.",
    amount: 600,
  },
  {
    id: 9, category: "Fashion", title: "Nail Studio", rating: 4.9, reviews: 305, price: "From Br 250",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=220&fit=crop&auto=format",
    description: "Manicure, pedicure & nail art.",
    detail: "Treat yourself to a luxurious nail experience.",
    features: ["Gel, acrylic & natural nails","Custom nail art","Relaxing pedicure","Long-lasting finishes"],
    cta: "Book your nail appointment and leave with hands you'll love.",
    amount: 250,
  },
];

const CATEGORIES = ["All", "Beauty", "Health", "Fitness", "Fashion", "Home"];

export default function Explore() {
  const [search, setSearch]               = useState("");
  const [location, setLocation]           = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const filtered = SERVICES.filter((s) => {
    const matchCat    = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text)" }}>

      {/* ── Service Detail Modal ── */}
      {selectedService && (
        <div onClick={() => setSelectedService(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:dark?"#111318":"#fff", borderRadius:20, padding:"2rem", maxWidth:560, width:"100%", maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
            {/* Close */}
            <button onClick={() => setSelectedService(null)} style={{ position:"absolute", top:"1rem", right:"1rem", background:"none", border:"none", color:dark?"#888":"#999", cursor:"pointer", fontSize:"1.3rem" }}>✕</button>

            {/* Header */}
            <div style={{ marginBottom: "1.25rem", borderRadius: 12, overflow: "hidden", height: 180 }}>
              <img src={selectedService.image} alt={selectedService.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "#d4a017", background: "rgba(212,160,23,0.1)", padding: "2px 10px", borderRadius: 999, display: "inline-block", marginBottom: 4 }}>{selectedService.category}</span>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: dark ? "#fff" : "#111", margin: 0 }}>{selectedService.title}</h2>
              </div>
            </div>

            {/* Rating */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:"1rem", fontSize:"0.78rem", color:dark?"#888":"#666" }}>
              <span style={{ color:"#f59e0b" }}>★</span>
              <span style={{ color:dark?"#fff":"#111", fontWeight:600 }}>{selectedService.rating}</span>
              <span>({selectedService.reviews} reviews)</span>
              <span style={{ marginLeft:"auto", color:"#d4a017", fontWeight:700, fontSize:"0.9rem" }}>{selectedService.price}</span>
            </div>

            {/* Detail */}
            <p style={{ fontSize:"0.88rem", color:dark?"#ccc":"#444", lineHeight:1.7, marginBottom:"1.25rem" }}>{selectedService.detail}</p>

            {/* Why choose us */}
            <div style={{ marginBottom:"1.25rem" }}>
              <h3 style={{ fontSize:"0.85rem", fontWeight:700, color:dark?"#fff":"#111", marginBottom:"0.75rem" }}>Why choose us?</h3>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {selectedService.features.map((f, i) => (
                  <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:"0.82rem", color:dark?"#aaa":"#555" }}>
                    <span style={{ color:"#22c55e", flexShrink:0, marginTop:1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA text */}
            <p style={{ fontSize:"0.82rem", color:dark?"#888":"#666", lineHeight:1.6, marginBottom:"1.5rem", fontStyle:"italic" }}>{selectedService.cta}</p>

            {/* Actions */}
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button onClick={() => { setSelectedService(null); navigate("/booking", { state: { service: { title: selectedService.title, desc: selectedService.description, price: selectedService.amount, duration: "30 min", icon: selectedService.icon } } }); }} className="btn-gold" style={{ flex:1, padding:"0.85rem", fontSize:"0.95rem", borderRadius:12 }}>
                Book Now
              </button>
              <button onClick={() => setSelectedService(null)} style={{ padding:"0.85rem 1.25rem", borderRadius:12, border:`1px solid ${dark?"rgba(255,255,255,0.1)":"#e5e7eb"}`, background:"transparent", color:dark?"#888":"#666", cursor:"pointer", fontSize:"0.85rem" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="hero-bg" style={{ minHeight: "480px", display: "flex", alignItems: "flex-end", padding: "0 2rem 4rem" }}>
        <div style={{ maxWidth: "600px" }}>
          <span className="badge-gold" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>✦ {t("premium_local")}</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "0.75rem" }}>
            {t("hero_title")}<br />
            <span style={{ color: "#d4a017" }}>{t("hero_subtitle")}</span>
          </h1>
          <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "2rem", maxWidth: "440px", lineHeight: 1.6 }}>
            {t("hero_desc")}
          </p>

          {/* Search bar */}
          <div className="search-bar">
            <div className="search-bar-field">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input placeholder="What service are you looking for?" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="search-bar-field">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <input placeholder={t("location")} value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <button className="search-bar-btn">Search</button>
          </div>
        </div>
      </div>

      {/* ── Services ── */}
      <div id="services" style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem 5rem", backgroundColor: "var(--bg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{t("popular_services")}</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} className={`pill${activeCategory === cat ? " active" : ""}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {filtered.length === 0 ? (
            <p style={{ color: "#555", gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>No services found.</p>
          ) : filtered.map((s) => (
            <div key={s.id} className="card-dark" style={{ padding: 0, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,160,23,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#1a1a1a" }}>
                <img
                  src={s.image}
                  alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  onError={e => { e.target.style.display = "none"; }}
                />
                {/* Category badge */}
                <span style={{ position: "absolute", top: 10, right: 10, fontSize: "0.65rem", color: "#d4a017", background: "rgba(0,0,0,0.7)", padding: "3px 10px", borderRadius: "999px", backdropFilter: "blur(4px)", fontWeight: 600 }}>{s.category}</span>
                {/* Rating overlay */}
                <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.7)", padding: "3px 10px", borderRadius: 999, backdropFilter: "blur(4px)" }}>
                  <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>★</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.75rem" }}>{s.rating}</span>
                  <span style={{ color: "#888", fontSize: "0.68rem" }}>({s.reviews})</span>
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.95rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.78rem", color: "#888", marginBottom: "0.85rem", lineHeight: 1.5 }}>{s.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#d4a017", fontWeight: 700, fontSize: "0.88rem" }}>{s.price}</span>
                  <button className="btn-gold" onClick={() => setSelectedService(s)} style={{ fontSize: "0.78rem", padding: "0.4rem 1rem" }}>{t("book_now")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
