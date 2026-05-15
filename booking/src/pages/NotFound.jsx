import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"100vh", background:"#0f1117", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"Inter,system-ui,sans-serif", gap:"1rem" }}>
      <div style={{ fontSize:"4rem" }}>404</div>
      <p style={{ color:"#6b7280", fontSize:"1rem" }}>Page not found</p>
      <button onClick={() => navigate(-1)} style={{ background:"#6366f1", border:"none", color:"#fff", fontWeight:600, fontSize:"0.85rem", padding:"0.6rem 1.5rem", borderRadius:999, cursor:"pointer" }}>
        ← Go Back
      </button>
    </div>
  );
}
