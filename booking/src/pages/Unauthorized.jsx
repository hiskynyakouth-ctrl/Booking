import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight:"100vh", background:"#0a0c0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"Inter,system-ui,sans-serif", gap:"1rem", textAlign:"center", padding:"2rem" }}>
      <div style={{ fontSize:"3rem" }}>🚫</div>
      <h1 style={{ fontSize:"1.5rem", fontWeight:700 }}>Access Denied</h1>
      <p style={{ color:"#6b7280", fontSize:"0.9rem", maxWidth:360 }}>
        You don't have permission to view this page. This area is restricted to administrators.
      </p>
      <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background:"#1e2330", border:"1px solid #2a2f45", color:"#aaa", fontSize:"0.82rem", padding:"0.5rem 1.25rem", borderRadius:8, cursor:"pointer" }}>
          ← Go Back
        </button>
        <button onClick={() => navigate(user ? "/user-dashboard" : "/login")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.82rem", padding:"0.5rem 1.25rem", borderRadius:8, cursor:"pointer" }}>
          {user ? "My Dashboard" : "Login"}
        </button>
      </div>
    </div>
  );
}
