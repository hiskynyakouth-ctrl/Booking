import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { processPayment } from "../services/paymentService";
import { addNotification } from "../services/notificationService";
import { updateUser } from "../services/authService";
import { formatCurrency } from "../utils/currency";

export default function Checkout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Accept order details passed via navigation state
  const order = location.state || { description:"Service Booking", amount:0, type:"booking" };

  const [method,   setMethod]   = useState("card");
  const [cardNum,  setCardNum]  = useState("");
  const [expiry,   setExpiry]   = useState("");
  const [cvv,      setCvv]      = useState("");
  const BANK_OPTIONS = [
    { id:"cbe",    name:"Commercial Bank of Ethiopia (CBE)",  code:"CBE"    },
    { id:"abyssinia", name:"Bank of Abyssinia",               code:"BOA"    },
    { id:"awash",  name:"Awash Bank",                         code:"AWASH"  },
    { id:"dashen", name:"Dashen Bank",                        code:"DASHEN" },
    { id:"nib",    name:"NIB International Bank",             code:"NIB"    },
    { id:"united", name:"United Bank",                        code:"UNITED" },
    { id:"oromia", name:"Cooperative Bank of Oromia",         code:"CBO"    },
    { id:"berhan", name:"Berhan Bank",                        code:"BERHAN" },
    { id:"telebirr",name:"Telebirr (Ethio Telecom)",          code:"TBIRR"  },
    { id:"mpesa",  name:"M-Pesa Ethiopia",                    code:"MPESA"  },
  ];
  const [selectedBank, setSelectedBank] = useState("cbe");
  const [bankRef,  setBankRef]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const [success,  setSuccess]  = useState(null);
  const bg   = dark ? "#090b10" : "#f8fafc";
  const card = dark ? "#111318" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const inp  = { width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 1rem", color:txt, fontSize:"0.88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    if (method === "card") {
      if (cardNum.replace(/\s/g,"").length < 16) return setError("Enter a valid 16-digit card number.");
      if (!expiry) return setError("Enter card expiry.");
      if (cvv.length < 3) return setError("Enter a valid CVV.");
    }
    if (method === "bank_transfer" && !bankRef.trim()) {
      return setError("Enter the bank reference or receipt number.");
    }
    setLoading(true);
    try {
      const result = await processPayment({
        userId:     user?.id,
        userName:   user?.name,
        type:       order.type,
        description: order.description,
        amount:     order.amount,
        method,
        bankName:   method === "bank_transfer" ? BANK_OPTIONS.find(b => b.id === selectedBank)?.name : null,
        bankRef:    method === "bank_transfer" ? bankRef.trim() : null,
        cardLast4:  method === "card" ? cardNum.slice(-4) : null,
      });
      setSuccess(result);
      await addNotification({
        userId: "admin",
        title: "New payment received",
        body: `${user?.name || "A customer"} paid ${formatCurrency(Number(order.amount), "ETB")} via ${method === "card" ? "Card" : method === "bank_transfer" ? "Bank transfer" : "Mobile payment"}`,
        type: "payment",
      });
      updateUser(user.id, { lastActivity: new Date().toISOString() });
    } catch (err) {
      setError(err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:20, padding:"2.5rem", maxWidth:420, width:"100%", margin:"0 1rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
        <h2 style={{ fontSize:"1.3rem", fontWeight:700, color:txt, marginBottom:"0.5rem" }}>Payment Successful!</h2>
        <p style={{ color:muted, fontSize:"0.85rem", marginBottom:"0.5rem" }}>{success.description}</p>
        <p style={{ color:"#22c55e", fontWeight:700, fontSize:"1.1rem", marginBottom:"1.5rem" }}>{formatCurrency(success.amount, "ETB")}</p>
        <p style={{ color:muted, fontSize:"0.75rem", marginBottom:"1.5rem" }}>Ref: {success.id}</p>
        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center" }}>
          <button onClick={() => navigate("/my-payments")} style={{ background:"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.85rem", padding:"0.6rem 1.4rem", borderRadius:10, cursor:"pointer" }}>
            View History
          </button>
          <button onClick={() => navigate("/")} style={{ background:dark?"#1e2330":"#f3f4f6", border:`1px solid ${bdr}`, color:txt, fontSize:"0.85rem", padding:"0.6rem 1.4rem", borderRadius:10, cursor:"pointer" }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter,system-ui,sans-serif", padding:"2rem 1rem" }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:"0.82rem", marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:6 }}>
          ← Back
        </button>

        <h1 style={{ fontSize:"1.3rem", fontWeight:700, color:txt, marginBottom:"0.25rem" }}>Checkout</h1>
        <p style={{ color:muted, fontSize:"0.82rem", marginBottom:"1.5rem" }}>Complete your payment securely</p>

        {/* Order summary */}
        <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"1.1rem 1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem" }}>
            <span style={{ color:muted }}>{order.description}</span>
            <span style={{ fontWeight:700, color:"#22c55e" }}>{formatCurrency(Number(order.amount), "ETB")}</span>
          </div>
        </div>

        <form onSubmit={handlePay} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1.1rem" }}>
          {error && <p style={{ color:"#ef4444", fontSize:"0.78rem", background:"rgba(239,68,68,0.1)", padding:"0.5rem 0.75rem", borderRadius:8, margin:0 }}>{error}</p>}

          {/* Method selector */}
          <div>
            <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:8 }}>Payment method</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem" }}>
              {[["card","💳 Card"],["bank_transfer","🏦 Bank"],["mobile","📱 Mobile"]].map(([val,label])=>(
                <button key={val} type="button" onClick={()=>setMethod(val)} style={{ padding:"0.65rem", borderRadius:10, border:`2px solid ${method===val?"#22c55e":bdr}`, background:method===val?"rgba(34,197,94,0.1)":dark?"#1a1a2e":"#f9fafb", color:method===val?"#22c55e":muted, fontWeight:method===val?700:400, fontSize:"0.78rem", cursor:"pointer", fontFamily:"inherit" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Card fields */}
          {method === "card" && (
            <>
              <div>
                <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Card number</label>
                <input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,"").slice(0,16))} placeholder="1234 5678 9012 3456" style={inp} maxLength={16} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                <div>
                  <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Expiry (MM/YY)</label>
                  <input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="08/27" style={inp} maxLength={5} />
                </div>
                <div>
                  <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>CVV</label>
                  <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••" style={inp} maxLength={4} />
                </div>
              </div>
            </>
          )}

          {/* Bank transfer — Ethiopian banks */}
          {method === "bank_transfer" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              <div>
                <label style={{ fontSize:"0.78rem", color:muted, display:"block", marginBottom:6 }}>Select Bank</label>
                <select value={selectedBank} onChange={e=>setSelectedBank(e.target.value)}
                  style={{ width:"100%", background:dark?"#1a1a1a":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 1rem", color:txt, fontSize:"0.88rem", outline:"none", fontFamily:"inherit" }}>
                  {BANK_OPTIONS.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div style={{ background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem", fontSize:"0.82rem" }}>
                <p style={{ fontWeight:600, marginBottom:"0.5rem", color:txt }}>Transfer Details — {BANK_OPTIONS.find(b=>b.id===selectedBank)?.name}</p>
                <p style={{ color:muted, marginBottom:"0.25rem" }}>Account Name: Thiyang Platform</p>
                <p style={{ color:muted, marginBottom:"0.25rem" }}>Account No: 1000{BANK_OPTIONS.find(b=>b.id===selectedBank)?.code}2026</p>
                <p style={{ color:muted, marginBottom:"0.75rem" }}>Reference: {user?.id?.toString().slice(-6) || "000000"}</p>
                <div>
                  <label style={{ fontSize:"0.75rem", color:muted, display:"block", marginBottom:6 }}>Your transfer reference / receipt number</label>
                  <input value={bankRef} onChange={e=>setBankRef(e.target.value)} placeholder="Enter your bank reference"
                    style={{ width:"100%", background:dark?"#111":"#fff", border:`1px solid ${bdr}`, borderRadius:10, padding:"0.7rem 1rem", color:txt, fontSize:"0.88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
                </div>
              </div>
            </div>
          )}

          {/* Mobile banking */}
          {method === "mobile" && (
            <div style={{ background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:12, padding:"1rem", fontSize:"0.82rem" }}>
              <p style={{ fontWeight:600, marginBottom:"0.5rem", color:txt }}>Mobile Banking</p>
              <p style={{ color:muted, marginBottom:"0.25rem" }}>Send to: *880*1*AMOUNT#</p>
              <p style={{ color:muted }}>Merchant code: <strong style={{ color:txt }}>THIYANG</strong></p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width:"100%", background:loading?"#1a5c3a":"#22c55e", border:"none", color:"#000", fontWeight:700, fontSize:"0.95rem", padding:"0.9rem", borderRadius:12, cursor:loading?"not-allowed":"pointer", transition:"background 0.2s", fontFamily:"inherit" }}>
            {loading ? "Processing..." : `Pay ${formatCurrency(Number(order.amount), "ETB")}`}
          </button>
        </form>
      </div>
    </div>
  );
}
