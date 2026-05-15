const DEFAULT_SLOTS = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM",
];

export default function TimeSlotPicker({ slots = DEFAULT_SLOTS, selected, onChange, gold = "#d4a017" }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
      {slots.map(slot => (
        <button
          key={slot}
          type="button"
          onClick={() => onChange(slot)}
          style={{
            padding:"0.5rem 1rem",
            borderRadius:999,
            fontSize:"0.8rem",
            cursor:"pointer",
            transition:"all 0.15s",
            background: selected === slot ? gold : "transparent",
            border: `1px solid ${selected === slot ? gold : "rgba(255,255,255,0.12)"}`,
            color: selected === slot ? "#000" : "#888",
            fontWeight: selected === slot ? 700 : 400,
            fontFamily:"inherit",
          }}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
