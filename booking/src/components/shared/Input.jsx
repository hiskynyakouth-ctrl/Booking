export default function Input({ label, type = "text", placeholder, value, onChange, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          padding: "0.65rem 1rem",
          color: "#fff",
          fontSize: "0.875rem",
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}
