import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter,system-ui,sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>
          Thiyang<span style={{ color: "#d4a017" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "0.85rem" }}>Login</button>
          <button onClick={() => navigate("/signup")} style={{ background: "#d4a017", border: "none", color: "#000", fontWeight: 700, fontSize: "0.85rem", padding: "0.4rem 1rem", borderRadius: 999, cursor: "pointer" }}>Sign Up</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
