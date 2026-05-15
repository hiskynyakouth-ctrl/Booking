import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../services/bookingService";
import { addNotification } from "../services/notificationService";

const ALL_SERVICES = [
  { id:1, title:"Doctor Consultation", duration:"30 min", price:300, image:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format", desc:"Certified physicians, same-day visits." },
  { id:2, title:"Dental Checkup",      duration:"45 min", price:400, image:"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=80&h=80&fit=crop&auto=format", desc:"Full exam, cleaning & X-rays." },
  { id:3, title:"Yoga Class",          duration:"60 min", price:150, image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop&auto=format", desc:"Guided sessions for all levels." },
  { id:4, title:"House Cleaning",      duration:"2 hrs",  price:600, image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop&auto=format", desc:"Deep cleaning for your space." },
  { id:5, title:"Nail Studio",         duration:"50 min", price:250, image:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=80&h=80&fit=crop&auto=format", desc:"Manicure, pedicure & nail art." },
  { id:6, title:"Barbershop",          duration:"30 min", price:150, image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=80&fit=crop&auto=format", desc:"Classic cuts, fades & beard trims." },
  { id:7, title:"Personal Trainer",    duration:"1 hr",   price:500, image:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=80&h=80&fit=crop&auto=format", desc:"One-on-one coaching sessions." },
  { id:8, title:"Hair Salon",          duration:"45 min", price:200, image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=80&h=80&fit=crop&auto=format", desc:"Professional cuts, color & styling." },
];

const TIME_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

const PAYMENT_METHODS = [
  { id:"card", label:"Credit / Debit Card" },
  { id:"bank_transfer", label:"Bank Transfer" },
  { id:"mobile", label:"Mobile Wallet" },
];

const BANK_OPTIONS = [
  { id:"cbe",    name:"Commercial Bank of Ethiopia (CBE)" },
  { id:"abyssinia", name:"Bank of Abyssinia" },
  { id:"awash",  name:"Awash Bank" },
  { id:"dashen", name:"Dashen Bank" },
  { id:"nib",    name:"NIB International Bank" },
  { id:"united", name:"United Bank" },
  { id:"oromia", name:"Cooperative Bank of Oromia" },
  { id:"berhan", name:"Berhan Bank" },
  { id:"telebirr",name:"Telebirr (Ethio Telecom)" },
];

const ETB = (amount) => `ETB ${Number(amount).toLocaleString()}`;

const gold = "#d4a017";

export default function Booking() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme } = useTheme();
  const { t }     = useLanguage();
  const { user }  = useAuth();
  const dark = theme === "dark";

  // Pre-select service if passed from Explore or another page
  const incoming = location.state?.service;
  const preSelected = incoming
    ? ALL_SERVICES.find(s => s.title === incoming.title) || { ...incoming, id: 0 }
    : null;

  const [selectedService, setSelectedService] = useState(preSelected?.id ?? null);
  const [selectedTime,    setSelectedTime]    = useState("");
  const [date,            setDate]            = useState("");
  const [paymentMethod,   setPaymentMethod]   = useState("card");
  const [selectedBank,    setSelectedBank]    = useState(BANK_OPTIONS[0].id);
  const [notes,           setNotes]           = useState("");
  const [confirmed,       setConfirmed]       = useState(false);

  const service = selectedService !== null
    ? (ALL_SERVICES.find(s => s.id === selectedService) || preSelected)
    : null;

  const bg   = dark ? "#0d0d0d" : "#f5f5f5";
  const card = dark ? "#141414" : "#fff";
  const bdr  = dark ? "#222"    : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#888"    : "#666";

  if (confirmed) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter,system-ui,sans-serif", padding:"1rem" }}>
      <div style={{ background:card, border:`1px solid ${gold}40`, borderRadius:20, padding:"2.5rem 2rem", textAlign:"center", maxWidth:420, width:"100%" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>📋</div>
        <h2 style={{ color:txt, fontWeight:700, marginBottom:"0.5rem" }}>Booking Submitted!</h2>
        <p style={{ color:muted, fontSize:"0.88rem", marginBottom:"0.5rem" }}>{service?.title}</p>
        <p style={{ color:muted, fontSize:"0.82rem", marginBottom:"1rem" }}>{date} · {selectedTime}</p>

        {/* Payment pending notice */}
        <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:"1rem", marginBottom:"1.25rem", textAlign:"left" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.5rem" }}>
            <span style={{ fontSize:"1.1rem" }}>⏳</span>
            <span style={{ fontWeight:700, color:"#f59e0b", fontSize:"0.88rem" }}>Awaiting Payment Verification</span>
          </div>
          <p style={{ color:muted, fontSize:"0.78rem", margin:0, lineHeight:1.6 }}>
            Your booking is pending. Please complete your payment of <strong style={{ color:gold }}>{ETB(service?.price)}</strong> via {paymentMethod === "bank_transfer" ? BANK_OPTIONS.find(b=>b.id===selectedBank)?.name : paymentMethod}. Admin will verify and confirm your booking.
          </p>
        </div>

        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => navigate("/my-bookings")} style={{ background:gold, border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.65rem 1.4rem", borderRadius:999, cursor:"pointer" }}>
            {t("my_bookings_link")}
          </button>
          <button onClick={() => navigate("/my-notifications")} style={{ background:"transparent", border:`1px solid ${bdr}`, color:muted, fontSize:"0.85rem", padding:"0.65rem 1.4rem", borderRadius:999, cursor:"pointer" }}>
            My Notifications
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"Inter,system-ui,sans-serif", color:txt }}>

      {/* Hero header */}
      <div style={{ background:`linear-gradient(to bottom, rgba(0,0,0,0.75), ${bg})`, padding:"2rem 2rem 1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", color:muted, fontSize:"0.8rem", cursor:"pointer", marginBottom:"0.75rem", display:"flex", alignItems:"center", gap:4 }}>
          ← {t("back")}
        </button>
        <h1 style={{ fontSize:"1.6rem", fontWeight:800, marginBottom:"0.25rem" }}>
          {location.state?.business || t("booking_title")}
        </h1>
        {location.state?.business && (
          <p style={{ color:muted, fontSize:"0.82rem" }}>Select a service and choose your preferred time</p>
        )}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.5rem", alignItems:"start" }} className="booking-layout">

        {/* Left — Services + Time */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

          {/* Services */}
          <div>
            <h3 style={{ fontSize:"0.75rem", fontWeight:700, color:gold, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.75rem" }}>{t("select_service")}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {ALL_SERVICES.map(s => (
                <button key={s.id} type="button" onClick={() => setSelectedService(s.id)} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  background: selectedService===s.id ? `rgba(212,160,23,0.1)` : card,
                  border: `1px solid ${selectedService===s.id ? gold : bdr}`,
                  borderRadius:12, padding:"0.85rem 1rem", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a1a" }}>
                      <img src={s.image} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display="none"; }} />
                    </div>
                    <div>
                      <p style={{ fontWeight:600, fontSize:"0.88rem", color:selectedService===s.id?gold:txt, margin:0 }}>{s.title}</p>
                      <p style={{ fontSize:"0.72rem", color:muted, margin:0 }}>{s.duration} · {s.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight:700, fontSize:"0.88rem", color:selectedService===s.id?gold:muted, flexShrink:0, marginLeft:8 }}>Br {s.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <h3 style={{ fontSize:"0.75rem", fontWeight:700, color:gold, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.75rem" }}>{t("pick_date")}</h3>
            <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e=>setDate(e.target.value)}
              style={{ background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"0.75rem 1rem", color:txt, fontSize:"0.9rem", outline:"none", width:"100%", maxWidth:280, boxSizing:"border-box" }} />
          </div>

          {/* Time slots */}
          <div>
            <h3 style={{ fontSize:"0.75rem", fontWeight:700, color:gold, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.75rem" }}>{t("select_time")}</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
              {TIME_SLOTS.map(t => (
                <button key={t} type="button" onClick={() => setSelectedTime(t)} style={{
                  padding:"0.55rem 1.1rem", borderRadius:999, fontSize:"0.8rem", cursor:"pointer", transition:"all 0.15s",
                  background: selectedTime===t ? gold : card,
                  border: `1px solid ${selectedTime===t ? gold : bdr}`,
                  color: selectedTime===t ? "#000" : muted,
                  fontWeight: selectedTime===t ? 700 : 400,
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div>
            <h3 style={{ fontSize:"0.75rem", fontWeight:700, color:gold, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.75rem" }}>{t("payment_method")}</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
              {PAYMENT_METHODS.map(method => (
                <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} style={{
                  padding:"0.65rem 0.95rem", borderRadius:12, border:`1px solid ${paymentMethod===method.id ? gold : bdr}`,
                  background: paymentMethod===method.id ? gold : card, color: paymentMethod===method.id ? "#000" : txt,
                  cursor:"pointer", fontWeight: paymentMethod===method.id ? 700 : 500,
                  fontSize:"0.85rem", transition:"all 0.15s",
                }}>{method.label}</button>
              ))}
            </div>

            {paymentMethod === "bank_transfer" && (
              <div style={{ marginTop:"1rem" }}>
                <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:8 }}>Select Bank</label>
                <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"0.85rem 1rem", color:txt, fontSize:"0.9rem", outline:"none" }}>
                  {BANK_OPTIONS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <div style={{ marginTop:"0.75rem", padding:"0.9rem 1rem", border:`1px solid ${bdr}`, borderRadius:12, background:dark?"#111" : "#f8fafc" }}>
                  <p style={{ fontWeight:600, marginBottom:"0.35rem" }}>Bank transfer details</p>
                  <p style={{ color:muted, margin:0 }}>Please complete the transfer to account number <strong>1000{selectedBank.toUpperCase()}2026</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 style={{ fontSize:"0.75rem", fontWeight:700, color:gold, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"0.75rem" }}>{t("notes_label")} <span style={{ color:muted, fontWeight:400, textTransform:"none", letterSpacing:0 }}>{t("notes_optional")}</span></h3>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder={t("notes_placeholder")}
              style={{ width:"100%", background:card, border:`1px solid ${bdr}`, borderRadius:12, padding:"0.75rem 1rem", color:txt, fontSize:"0.85rem", outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
          </div>
        </div>

        {/* Right — Booking panel */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:18, padding:"1.25rem", position:"sticky", top:"1.5rem" }}>
          <h3 style={{ fontWeight:700, fontSize:"0.9rem", color:txt, marginBottom:"0.25rem" }}>{t("booking_summary")}</h3>

          {service ? (
            <div style={{ marginBottom:"1rem", padding:"0.75rem", background:dark?"rgba(212,160,23,0.06)":"rgba(212,160,23,0.04)", borderRadius:10, border:`1px solid ${gold}30` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.3rem" }}>
                <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#1a1a1a" }}>
                  <img src={service.image} alt={service.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
                </div>
                <span style={{ fontWeight:600, fontSize:"0.85rem", color:gold }}>{service.title}</span>
              </div>
              <p style={{ fontSize:"0.72rem", color:muted, margin:0 }}>{service.duration}</p>
            </div>
          ) : (
            <p style={{ fontSize:"0.78rem", color:muted, marginBottom:"1rem" }}>No service selected</p>
          )}

          <p style={{ fontSize:"0.7rem", color:muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.6rem" }}>{t("available_today")}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem", marginBottom:"1.25rem" }}>
            {TIME_SLOTS.slice(0,6).map(t => (
              <button key={t} type="button" onClick={() => setSelectedTime(t)} style={{
                padding:"0.5rem", borderRadius:8, fontSize:"0.75rem", cursor:"pointer", textAlign:"center", transition:"all 0.15s",
                background: selectedTime===t ? gold : dark?"#1e1e1e":"#f3f4f6",
                border: `1px solid ${selectedTime===t ? gold : bdr}`,
                color: selectedTime===t ? "#000" : muted,
                fontWeight: selectedTime===t ? 700 : 400,
              }}>{t}</button>
            ))}
          </div>

          {service && date && selectedTime && (
            <div style={{ background:dark?"rgba(34,197,94,0.06)":"rgba(34,197,94,0.04)", border:`1px solid rgba(34,197,94,0.2)`, borderRadius:10, padding:"0.75rem", marginBottom:"1rem", fontSize:"0.78rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                <span style={{ color:muted }}>Service</span>
                <span style={{ fontWeight:600 }}>{service.title}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                <span style={{ color:muted }}>Date & Time</span>
                <span style={{ fontWeight:600 }}>{date} · {selectedTime}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                <span style={{ color:muted }}>Payment</span>
                <span style={{ fontWeight:600, textTransform:"capitalize" }}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
              </div>
              {paymentMethod === "bank_transfer" && (
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                  <span style={{ color:muted }}>Bank</span>
                  <span style={{ fontWeight:600 }}>{BANK_OPTIONS.find(b => b.id === selectedBank)?.name}</span>
                </div>
              )}
              {notes && (
                <div style={{ marginTop:"0.5rem", paddingTop:"0.5rem", borderTop:`1px solid ${bdr}` }}>
                  <div style={{ color:muted, fontSize:"0.72rem", marginBottom:"0.25rem" }}>Booking note</div>
                  <div style={{ fontSize:"0.82rem", color:txt }}>{notes}</div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"0.5rem", borderTop:`1px solid ${bdr}`, marginTop:"0.5rem" }}>
                <span style={{ color:muted }}>Total</span>
                <span style={{ fontWeight:700, color:gold, fontSize:"0.9rem" }}>{ETB(service.price)}</span>
              </div>
            </div>
          )}

          <button onClick={() => navigate("/messages")} style={{
            width:"100%", padding:"0.75rem", borderRadius:12, border:"1px solid transparent", cursor:"pointer",
            background:dark?"#111" : "#f3f4f6", color:dark?"#fff":"#111", fontWeight:600, fontSize:"0.85rem", marginBottom:"0.75rem",
          }}>
            Message Admin for help
          </button>

          <button
            onClick={() => {
              if (!service || !date || !selectedTime) return;
              // Save booking to shared store
              const booking = createBooking({
                userId:       user?.id || "guest",
                userName:     user?.name || "Guest",
                userEmail:    user?.email || "",
                service:      service.title,
                serviceIcon:  service.image,
                price:        service.price,
                duration:     service.duration,
                date,
                time:         selectedTime,
                paymentMethod,
                bankName:     paymentMethod === "bank_transfer" ? BANK_OPTIONS.find(b=>b.id===selectedBank)?.name : null,
                notes,
              });
              // Notify admin
              addNotification({
                userId: "admin",
                title:  "New Booking Request",
                body:   `${user?.name || "A customer"} booked ${service.title} for ${date} at ${selectedTime}. Payment: ${paymentMethod === "bank_transfer" ? BANK_OPTIONS.find(b=>b.id===selectedBank)?.name : paymentMethod}`,
                type:   "booking",
              });
              setConfirmed(true);
            }}
            disabled={!service || !date || !selectedTime}
            style={{
              width:"100%", padding:"0.85rem", borderRadius:12, border:"none", cursor: service&&date&&selectedTime ? "pointer" : "not-allowed",
              background: service&&date&&selectedTime ? gold : dark?"#222":"#e5e7eb",
              color: service&&date&&selectedTime ? "#000" : muted,
              fontWeight:700, fontSize:"0.88rem", transition:"all 0.2s",
            }}>
            {t("confirm_booking")}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .booking-layout { grid-template-columns: 1fr !important; padding: 0 1rem 3rem !important; }
          .booking-layout > div:last-child { position: static !important; }
        }
      `}</style>
    </div>
  );
}
