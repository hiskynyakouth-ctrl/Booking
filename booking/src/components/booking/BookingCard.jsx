const statusColor = { Completed: "#22c55e", Processing: "#3b82f6", Cancelled: "#f97316", Scheduled: "#f59e0b" };

export default function BookingCard({ booking, onCancel }) {
  return (
    <div style={{ background: "#141720", border: "1px solid #1e2130", borderRadius: 14, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>📋</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#fff" }}>{booking.service}</p>
          <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{booking.date} · {booking.time}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: statusColor[booking.status] || "#aaa" }}>{booking.status}</span>
        {booking.status !== "Cancelled" && booking.status !== "Completed" && (
          <button onClick={() => onCancel?.(booking.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "0.72rem", padding: "0.3rem 0.75rem", borderRadius: 999, cursor: "pointer" }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
