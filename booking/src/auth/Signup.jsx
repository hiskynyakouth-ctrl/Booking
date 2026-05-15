import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { addNotification } from "../services/notificationService";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const inputStyle = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 12,
  padding: "0.85rem 1rem 0.85rem 2.75rem",
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

export default function Signup() {
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [role,            setRole]            = useState("customer");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd || pwd.length < 6) return "Weak";
    const checks = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((sum, re) => sum + (re.test(pwd) ? 1 : 0), 0);
    if (pwd.length >= 10 && checks >= 3) return "Strong";
    if (pwd.length >= 8 && checks >= 2) return "Medium";
    return "OK";
  };

  const passwordTip = (pwd) => {
    if (!pwd) return "Use 6+ characters.";
    const strength = passwordStrength(pwd);
    if (strength === "Strong") return "Great password!";
    if (strength === "Medium") return "Good — add more character types for stronger security.";
    if (strength === "OK") return "Acceptable — try adding uppercase or numbers.";
    return "Too short — use at least 6 characters.";
  };
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login: ctxLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await register(name, email, password, role, phone);
      ctxLogin(res.data.user);
      await addNotification({
        userId: "admin",
        title: "New customer signup",
        body: `${name} created an account`,
        type: "user",
      });
      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const msg = err?.response?.data?.message || err?.message || "Registration failed.";
      setError(msg);
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
          Create Account
        </h1>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          Join Thiyang and start booking services
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

        {/* Full Name */}
        <div>
          <label style={labelStyle}>{t("full_name")}</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>👤</span>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
        </div>

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
          <p style={{ marginTop: 8, color: "#888", fontSize: "0.78rem" }}>Use a real email to receive booking updates.</p>
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone (Ethiopia)</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>📞</span>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+251 94 741 4318"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>{t("password")}</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>🔒</span>
            <input
              type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Create a strong password"
              style={{ ...inputStyle, paddingRight: "3rem" }}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "1rem" }}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.78rem", color: passwordStrength(password) === "Strong" ? "#22c55e" : "#f59e0b" }}>
            <span>{passwordTip(password)}</span>
            <span>{passwordStrength(password)}</span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label style={labelStyle}>Confirm password</label>
          <div style={{ position: "relative" }}>
            <span style={iconWrap}>🔒</span>
            <input
              type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{ ...inputStyle, paddingRight: "3rem" }}
              onFocus={e => e.target.style.borderColor = "#d4a017"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
        </div>

        {/* Role selector */}
        <div>
          <label style={labelStyle}>I want to</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[["customer", "Book Services"], ["business", "List My Business"]].map(([val, label]) => (
              <button key={val} type="button" onClick={() => setRole(val)}
                style={{
                  padding: "0.85rem",
                  borderRadius: 12,
                  border: `2px solid ${role === val ? "#d4a017" : "#2a2a2a"}`,
                  background: role === val ? "rgba(212,160,23,0.1)" : "#1a1a1a",
                  color: role === val ? "#d4a017" : "#888",
                  fontWeight: role === val ? 700 : 400,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Google Sign-In */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
            <span style={{ color: "#666", fontSize: "0.8rem" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
          </div>
          <button type="button" onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", color: "#111", border: "1px solid #d4a017", borderRadius: 12, padding: "0.9rem 1rem", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
        </div>

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
          {loading ? "Creating..." : t("create_account")}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#666", margin: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#d4a017", fontWeight: 700, textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
