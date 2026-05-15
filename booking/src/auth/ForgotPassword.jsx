import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === "dark";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp = {
    width:"100%", background:dark?"#1a1a1a":"#f9fafb",
    border:`1px solid ${dark?"#2a2a2a":"#e5e7eb"}`, borderRadius:12,
    padding:"0.85rem 1rem", fontSize:"0.9rem", color:dark?"#fff":"#111",
    outline:"none", fontFamily:"inherit", boxSizing:"border-box",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError("No account found with that email address.");
      setLoading(false);
      return;
    }

    // Store reset token with email and 1hr expiry
    const token = btoa(email + "_" + Date.now());
    localStorage.setItem("reset_token", JSON.stringify({
      email: user.email,
      token,
      expires: Date.now() + 3600000,
    }));

    // Navigate directly to reset page (no real email needed)
    navigate("/reset-password");
  };

  return (
    <div style={{ minHeight:"100vh", background:dark?"#0f0f0f":"#f5f5f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>🔑</div>
        <h1 style={{ fontSize:"1.8rem", fontWeight:800, color:dark?"#fff":"#111", marginBottom:"0.5rem" }}>Forgot Password?</h1>
        <p style={{ color:dark?"#888":"#666", fontSize:"0.9rem" }}>Enter your email to reset your password</p>
      </div>

      <div style={{ background:dark?"#161616":"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:440, boxShadow:"0 4px 24px rgba(0,0,0,0.15)" }}>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          {error && (
            <p style={{ color:"#ef4444", fontSize:"0.82rem", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", padding:"0.6rem 0.9rem", borderRadius:10, margin:0 }}>
              {error}
            </p>
          )}

          <div>
            <label style={{ fontSize:"0.88rem", fontWeight:700, color:dark?"#fff":"#111", display:"block", marginBottom:6 }}>
              Email address
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              style={inp}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = dark?"#2a2a2a":"#e5e7eb"}
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", background:loading?"#a07010":"#d4a017", border:"none", borderRadius:12, padding:"1rem", fontSize:"1rem", fontWeight:700, color:"#000", cursor:loading?"not-allowed":"pointer", transition:"background 0.2s" }}>
            {loading ? "Checking..." : "Continue to Reset"}
          </button>

          <p style={{ textAlign:"center", fontSize:"0.85rem", color:dark?"#666":"#888", margin:0 }}>
            Remember it?{" "}
            <Link to="/login" style={{ color:"#d4a017", fontWeight:700, textDecoration:"none" }}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
