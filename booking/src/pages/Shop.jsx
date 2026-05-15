import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  {
    id: 1,
    name: "Hair Extensions",
    price: 850,
    description: "Premium 100% human hair extensions, silky smooth",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&auto=format",
    badge: "Best Seller",
    badgeColor: "#22c55e",
    category: "Beauty",
  },
  {
    id: 2,
    name: "Women Dress",
    price: 1200,
    description: "Elegant handcrafted evening wear, Ethiopian design",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop&auto=format",
    badge: "New",
    badgeColor: "#3b82f6",
    category: "Fashion",
  },
  {
    id: 3,
    name: "Beard Oil",
    price: 380,
    description: "Nourishing blend with argan & jojoba oils",
    image: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=400&h=300&fit=crop&auto=format",
    badge: null,
    category: "Grooming",
  },
  {
    id: 4,
    name: "Nail Kit",
    price: 520,
    description: "Professional 24-piece nail care & art set",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop&auto=format",
    badge: "Popular",
    badgeColor: "#f59e0b",
    category: "Beauty",
  },
  {
    id: 5,
    name: "Yoga Mat",
    price: 680,
    description: "Non-slip premium 6mm thick exercise mat",
    image: "https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400&h=300&fit=crop&auto=format",
    badge: null,
    category: "Fitness",
  },
  {
    id: 6,
    name: "Fitness Band",
    price: 450,
    description: "Resistance training band set, 5 levels",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
    badge: null,
    category: "Fitness",
  },
  {
    id: 7,
    name: "Face Cream",
    price: 620,
    description: "Moisturizing SPF 30 day cream, all skin types",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop&auto=format",
    badge: "New",
    badgeColor: "#3b82f6",
    category: "Skincare",
  },
  {
    id: 8,
    name: "Perfume",
    price: 1500,
    description: "Luxury Ethiopian oud & rose fragrance, 50ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=300&fit=crop&auto=format",
    badge: "Premium",
    badgeColor: "#8b5cf6",
    category: "Fragrance",
  },
];

const CATEGORIES = ["All", "Beauty", "Fashion", "Grooming", "Fitness", "Skincare", "Fragrance"];

export default function Shop() {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [added, setAdded] = useState(null);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

  const handleAdd = (p) => {
    addItem(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter,system-ui,sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.2rem" }}>Shop</h1>
            <p style={{ color: "#666", fontSize: "0.82rem" }}>Premium beauty, fashion & wellness products</p>
          </div>
          <button onClick={() => navigate("/cart")}
            style={{ background: "#d4a017", border: "none", color: "#000", fontWeight: 700, fontSize: "0.85rem", padding: "0.6rem 1.4rem", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{ background: "#000", color: "#d4a017", fontSize: "0.7rem", fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: "0.4rem 1rem", borderRadius: 999, border: `1px solid ${category === c ? "#d4a017" : "rgba(255,255,255,0.1)"}`, background: category === c ? "#d4a017" : "transparent", color: category === c ? "#000" : "#888", fontWeight: category === c ? 700 : 400, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {filtered.map(p => (
            <div key={p.id}
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.2s, border-color 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(212,160,23,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>

              {/* Image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#1a1a1a" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                {/* Fallback */}
                <div style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: "3rem", background: "#1a1a1a", position: "absolute", top: 0, left: 0 }}>
                  🛍️
                </div>
                {/* Badge */}
                {p.badge && (
                  <span style={{ position: "absolute", top: 10, left: 10, background: p.badgeColor, color: "#000", fontSize: "0.65rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                    {p.badge}
                  </span>
                )}
                {/* Category tag */}
                <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#888", fontSize: "0.62rem", padding: "3px 8px", borderRadius: 999, backdropFilter: "blur(4px)" }}>
                  {p.category}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.92rem", margin: 0 }}>{p.name}</h3>
                <p style={{ fontSize: "0.75rem", color: "#666", margin: 0, lineHeight: 1.4 }}>{p.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
                  <div>
                    <span style={{ color: "#d4a017", fontWeight: 800, fontSize: "1rem" }}>Br {p.price.toLocaleString()}</span>
                  </div>
                  <button onClick={() => handleAdd(p)}
                    style={{ background: added === p.id ? "#22c55e" : "#d4a017", border: "none", color: "#000", fontWeight: 700, fontSize: "0.78rem", padding: "0.45rem 1rem", borderRadius: 999, cursor: "pointer", transition: "background 0.2s", minWidth: 70 }}>
                    {added === p.id ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
