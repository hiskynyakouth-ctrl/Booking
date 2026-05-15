export default function Button({ children, onClick, variant = "primary", disabled, style = {}, type = "button" }) {
  const base = {
    border: "none", borderRadius: 999, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: "0.875rem", padding: "0.6rem 1.4rem",
    transition: "opacity 0.2s, background 0.2s", opacity: disabled ? 0.4 : 1,
    fontFamily: "inherit", ...style,
  };
  const variants = {
    primary:  { background: "#d4a017", color: "#000" },
    ghost:    { background: "transparent", color: "#d4a017", border: "1px solid rgba(212,160,23,0.4)" },
    danger:   { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" },
    dark:     { background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" },
    yellow:   { background: "#e8ff47", color: "#1c1c1e" },
    indigo:   { background: "#6366f1", color: "#fff" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}
