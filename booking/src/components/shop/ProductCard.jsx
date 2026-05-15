import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "2.5rem", textAlign: "center", padding: "0.5rem 0" }}>{product.icon || "🛍️"}</div>
      <div>
        <h3 style={{ fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>{product.name}</h3>
        <p style={{ fontSize: "0.78rem", color: "#666", marginTop: 2 }}>{product.description}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ color: "#d4a017", fontWeight: 700 }}>Br {product.price}</span>
        <button onClick={() => addItem(product)} style={{ background: "#d4a017", border: "none", color: "#000", fontWeight: 700, fontSize: "0.75rem", padding: "0.4rem 0.9rem", borderRadius: 999, cursor: "pointer" }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
