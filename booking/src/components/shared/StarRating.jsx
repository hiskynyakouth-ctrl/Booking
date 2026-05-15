export default function StarRating({ rating, max = 5, size = 16, interactive = false, onChange }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          style={{
            fontSize: size,
            color: star <= rating ? "#f59e0b" : "#374151",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.1s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
