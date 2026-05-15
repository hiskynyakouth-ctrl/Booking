export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #c9d6e3, #dce6f0, #e8eef5)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.6)", filter: "blur(60px)", top: 40, left: 40 }} />
      <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "rgba(191,219,254,0.5)", filter: "blur(60px)", bottom: 0, right: 0 }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 1rem" }}>
        {children}
      </div>
    </div>
  );
}
