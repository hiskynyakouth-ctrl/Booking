export default function Loader({ size = 32, color = "#d4a017" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{
        width: size, height: size,
        border: `3px solid rgba(255,255,255,0.1)`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
