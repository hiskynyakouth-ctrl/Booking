import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={dark ? "Switch to Light" : "Switch to Dark"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
        borderRadius: 999,
        padding: "0.3rem 0.75rem",
        cursor: "pointer",
        fontSize: "0.78rem",
        color: dark ? "#fff" : "#111",
        transition: "all 0.2s",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: "0.9rem" }}>{dark ? "☀️" : "🌙"}</span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
