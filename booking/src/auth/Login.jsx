import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { addNotification } from "../services/notificationService";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const inputStyle = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 12,
  paddingTop: "0.85rem",
  paddingBottom: "0.85rem",
  paddingLeft: "2.75rem",
  paddingRight: "1rem",
  fontSize: "0.9rem",
  color: "#fff",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#fff",
  marginBottom: "0.5rem",
  display: "block",
};

const iconWrap = {
  position: "absolute",
  left: "0.9rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#555",
  fontSize: "1rem",
  pointerEvents: "none",
};

export default function Login({ adminOnly = false, pageTitle = "Welcome Back" }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(true);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login: ctxLogin } = useAuth();

  // Check if any users exist
  const noUsers = () => {
    try { return JSON.parse(localStorage.getItem("mock_users") || "[]").length === 0; } catch { return true; }
  };

  const createAdminAccount = async () => {
    const adminEmail = prompt("Enter admin email:", "admin@thiyang.com");
    if (!adminEmail) return;
    const adminPass = prompt("Enter admin password (min 6 chars):", "Admin123");
    if (!adminPass || adminPass.length < 6) { alert("Password must be at least 6 characters."); return; }
    const adminName = prompt("Enter admin name:", "Admin");
    if (!adminName) return;

    try {
      const { register } = await import("../services/authService");
      // Clear existing users to ensure this is first (admin)
      const existing = JSON.parse(localStorage.getItem("mock_users") || "[]");
      if (existing.length > 0 && !window.confirm("Users already exist. The new account will be a customer unless you clear all users first. Clear all users and create fresh admin?")) return;
      if (existing.length > 0) localStorage.removeItem("mock_users");

      const res = await register(adminName, adminEmail, adminPass);
      ctxLogin(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create admin.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);

      if (adminOnly && res.data.user.role !== "admin") {
        setError("Admin account required. Please sign in with an admin account.");
        return;
      }

      ctxLogin(res.data.user);

      if (res.data.user.role !== "admin") {
        await addNotification({
          userId: "admin",
          title: "Customer signed in",
          body: `${res.data.user.name} signed in`,
          type: "user",
        });
      }

      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
          {pageTitle}
        </h1>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          {adminOnly ? "Sign in to the admin dashboard" : "Sign in to your Thiyang account"}
        </p>
      </div>

      {/* Card */}
      <form onSubmit={handleSubmit} style={{
        background: "#161616",
        borderRadius: 20,
        padding: "2rem",
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}>
        {error && (
          <p style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "0.82rem", padding: "0.6rem 1rem", borderRadius: 10, margin: 0 }}>
            {error}
          </p>
        )}

        {/* No users hint */}
        {adminOnly && noUsers() && (
          <div style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10, padding: "0.85rem 1rem" }}>
            <p style={{ color: "#d4a017", fontSize: "0.82rem", margin: "0 0 0.5rem", fontWeight: 600 }}>
              No admin account found
            </p>
            <p style={{ color: "#888", fontSize: "0.75rem", margin: "0 0 0.75rem" }}>
              No users registered yet. Create an admin account to get started.
            </p>
            <button type="button" onClick={createAdminAccount}
              style={{ background: "#d4a017", border: "none", color: "#000", fontWeight: 700, fontSize: "0.8rem", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer" }}>
              + Create Admin Account
            </button>
          </div>
        )}

        {/* Email */}
        <div>
          <label style={labelStyle}>{t("email")}</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>✉️</span>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
          <p style={{ marginTop: 8, color: "#888", fontSize: "0.78rem" }}>Use a real Gmail address for faster recovery and booking updates.</p>
        </div>



        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>{t("password")}</label>
            <a href="/forgot-password" style={{ fontSize: "0.8rem", color: "#d4a017", textDecoration: "none" }}>{t("forgot_password")}</a>
          </div>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>🔒</span>
            <input
              type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: "3rem" }}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "1rem" }}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "0.75rem" }}>
          <button type="button" onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", color: "#111", border: "1px solid #d4a017", borderRadius: 12, padding: "0.9rem 1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "center" }}>
            A Gmail address is recommended for secure booking notifications.
          </div>
        </div>

        {/* Remember me */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "#888" }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#d4a017", cursor: "pointer" }} />
          {t("remember_me")}
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#a07010" : "#d4a017",
            border: "none",
            borderRadius: 12,
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#000",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            fontFamily: "inherit",
          }}>
          {loading ? "Signing in..." : t("sign_in")}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#666", margin: 0 }}>
          {adminOnly ? (
            <>
              Need a user account? <Link to="/login" style={{ color: "#d4a017", fontWeight: 700, textDecoration: "none" }}>User Login</Link>
              <span style={{ display: "block", marginTop: "0.5rem" }}>
                No account yet?{" "}
                <button type="button" onClick={createAdminAccount} style={{ background: "none", border: "none", color: "#d4a017", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>
                  Create Admin Account
                </button>
              </span>
            </>
          ) : (
            <>
              {t("no_account")} {" "}
              <Link to="/signup" style={{ color: "#d4a017", fontWeight: 700, textDecoration: "none" }}>
                {t("signup")}
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
