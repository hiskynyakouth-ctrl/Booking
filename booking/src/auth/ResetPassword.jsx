import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ResetPassword() {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const dark = theme === "dark";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reset_token") || "null");
    if (!stored || Date.now() > stored.expires) {
      setError("Reset link has expired or is invalid. Please request a new one.");
    } else {
      setTokenData(stored);
    }
  }, []);

  const inp = {
    width:"100%", background:dark?"#1a1a1a":"#f9fafb",
    border:`1px solid ${dark?"#2a2a2a":"#e5e7eb"}`, borderRadius:12,
    padding:"0.85rem 1rem 0.85rem 1rem", fontSize:"0.9rem",
    color:dark?"#fff":"#111", outline:"none", fontFamily:"inherit", boxSizing:"border-box",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!tokenData) {
      setError("Invalid reset session. Please request a new link.");
      return;
    }

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const updated = users.map(u =>
      u.email.toLowerCase() === tokenData.email.toLowerCase()
        ? { ...u, password }
        : u
    );
    localStorage.setItem("mock_users", JSON.stringify(updated));
    localStorage.removeItem("reset_token");

    setSuccess(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  return (
    <div style={{ minHeight:"100vh", background:dark?"#0f0f0f":"#f5f5f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>🔒</div>
        <h1 style={{ fontSize:"1.8rem", fontWeight:800, color:dark?"#fff":"#111", marginBottom:"0.5rem" }}>Reset Password</h1>
        {tokenData && (
          <p style={{ color:dark?"#888":"#666", fontSize:"0.85rem" }}>
            Resetting password for <strong style={{ color:"#d4a017" }}>{tokenData.email}</strong>
          </p>
        )}
      </div>

      <div style={{ background:dark?"#161616":"#fff", borderRadius:20, padding:"2rem", width:"100%", maxWidth:440, boxShadow:"0 4px 24px rgba(0,0,0,0.15)" }}>
        {success ? (
          <div style={{ textAlign:"center", padding:"1rem 0" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
            <h3 style={{ color:"#22c55e", marginBottom:"0.5rem" }}>Password Reset!</h3>
            <p style={{ color:dark?"#888":"#666", fontSize:"0.85rem" }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            {error && (
              <div style={{ color:"#ef4444", fontSize:"0.82rem", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", padding:"0.6rem 0.9rem", borderRadius:10 }}>
                {error}
                {error.includes("expired") && (
                  <div style={{ marginTop:"0.5rem" }}>
                    <Link to="/forgot-password" style={{ color:"#d4a017", fontWeight:700, textDecoration:"none" }}>
                      Request new link →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={{ fontSize:"0.88rem", fontWeight:700, color:dark?"#fff":"#111", display:"block", marginBottom:6 }}>
                New password
              </label>
              <div style={{ position:"relative" }}>
                <input
                  type={showPw ? "text" : "password"} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...inp, paddingRight:"3rem" }}
                  onFocus={e => e.target.style.borderColor = "#d4a017"}
                  onBlur={e => e.target.style.borderColor = dark?"#2a2a2a":"#e5e7eb"}
                  disabled={!!error && error.includes("expired")}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position:"absolute", right:"0.9rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:dark?"#555":"#999", fontSize:"1rem" }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize:"0.88rem", fontWeight:700, color:dark?"#fff":"#111", display:"block", marginBottom:6 }}>
                Confirm new password
              </label>
              <input
                type={showPw ? "text" : "password"} required
                value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                style={inp}
                onFocus={e => e.target.style.borderColor = "#d4a017"}
                onBlur={e => e.target.style.borderColor = dark?"#2a2a2a":"#e5e7eb"}
                disabled={!!error && error.includes("expired")}
              />
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div>
                <div style={{ height:4, borderRadius:999, background:dark?"#2a2a2a":"#e5e7eb", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:999, transition:"width 0.3s, background 0.3s", width: password.length < 6 ? "33%" : password.length < 10 ? "66%" : "100%", background: password.length < 6 ? "#ef4444" : password.length < 10 ? "#f59e0b" : "#22c55e" }} />
                </div>
                <div style={{ fontSize:"0.68rem", color:password.length < 6 ? "#ef4444" : password.length < 10 ? "#f59e0b" : "#22c55e", marginTop:4 }}>
                  {password.length < 6 ? "Too short" : password.length < 10 ? "Good" : "Strong"}
                </div>
              </div>
            )}

            <button type="submit"
              disabled={!!error && error.includes("expired")}
              style={{ width:"100%", background:"#d4a017", border:"none", borderRadius:12, padding:"1rem", fontSize:"1rem", fontWeight:700, color:"#000", cursor:"pointer", opacity:(!!error && error.includes("expired")) ? 0.5 : 1 }}>
              Reset Password
            </button>

            <p style={{ textAlign:"center", fontSize:"0.85rem", color:dark?"#666":"#888", margin:0 }}>
              <Link to="/login" style={{ color:"#d4a017", fontWeight:700, textDecoration:"none" }}>Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
