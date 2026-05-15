export default function CalendarPicker({ value, onChange, min }) {
  return (
    <div>
      <input
        type="date"
        value={value}
        min={min || new Date().toISOString().split("T")[0]}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "0.7rem 1rem",
          color: "#fff",
          fontSize: "0.9rem",
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}
