import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"2rem 1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem" }}>
          <h1 style={{ fontSize:"1.4rem", fontWeight:700 }}>🛒 Cart</h1>
          <button onClick={() => navigate("/shop")} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", color:"#aaa", fontSize:"0.8rem", padding:"0.4rem 1rem", borderRadius:999, cursor:"pointer" }}>← Shop</button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem 0", color:"#555" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🛒</div>
            <p>Your cart is empty</p>
            <button onClick={() => navigate("/shop")} style={{ marginTop:"1rem", background:"#d4a017", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.5rem", borderRadius:999, cursor:"pointer" }}>Browse Shop</button>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"1.5rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ background:"#111", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem", display:"flex", alignItems:"center", gap:"1rem" }}>
                  <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:12, flexShrink:0, background:"#222" }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:"0.9rem", margin:0 }}>{item.name}</p>
                    <p style={{ color:"#d4a017", fontWeight:700, fontSize:"0.85rem", margin:"0.35rem 0 0" }}>Br {item.price}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width:28, height:28, borderRadius:"50%", background:"#222", border:"none", color:"#fff", cursor:"pointer", fontSize:"1rem" }}>−</button>
                    <span style={{ minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width:28, height:28, borderRadius:"50%", background:"#222", border:"none", color:"#fff", cursor:"pointer", fontSize:"1rem" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"1.1rem" }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1.25rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1rem" }}>
                <span style={{ color:"#888" }}>Total</span>
                <span style={{ fontWeight:700, fontSize:"1.1rem", color:"#d4a017" }}>Br {total}</span>
              </div>
              <button onClick={() => { clearCart(); navigate("/booking"); }} style={{ width:"100%", background:"#d4a017", border:"none", color:"#000", fontWeight:700, fontSize:"0.9rem", padding:"0.75rem", borderRadius:12, cursor:"pointer" }}>
                Checkout → Book Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
