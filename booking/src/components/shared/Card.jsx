export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 20,
      padding: "1.25rem",
      ...style,
    }}>
      {children}
    </div>
  );
}
