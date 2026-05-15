import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { getReviews, addReview, getAverageRating } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/shared/StarRating";

// Mock business data — in real app fetched from API by ID
const BUSINESSES = {
  "hisky-barbershop": {
    id: "hisky-barbershop",
    name: "Hisky Barbershop",
    category: "Beauty",
    description: "Premium barbershop offering classic and modern trims. Best fade in town and the barbers really care about quality and style.",
    address: "123 Main St, Downtown",
    phone: "+1 555 123 4567",
    email: "hisky@barbershop.com",
    hours: { Mon:"9AM–8PM", Tue:"9AM–8PM", Wed:"9AM–8PM", Thu:"9AM–8PM", Fri:"9AM–9PM", Sat:"10AM–6PM", Sun:"Closed" },
    services: [
      { title:"Classic Haircut", duration:"30 min", price:30 },
      { title:"Beard Trim",      duration:"20 min", price:20 },
      { title:"Haircut + Beard", duration:"45 min", price:45 },
      { title:"Hot Towel Shave", duration:"35 min", price:35 },
    ],
    images: [],
    verified: true,
  },
};

export default function BusinessProfile() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const { t }     = useLanguage();
  const { user }  = useAuth();
  const dark = theme === "dark";

  const business = BUSINESSES[id] || BUSINESSES["hisky-barbershop"];

  const [reviews,    setReviews]    = useState([]);
  const [avgRating,  setAvgRating]  = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [myRating,   setMyRating]   = useState(5);
  const [myComment,  setMyComment]  = useState("");
  const [activeTab,  setActiveTab]  = useState("services");

  const bg   = dark ? "#0a0a0a" : "#f5f5f5";
  const card = dark ? "#111"    : "#fff";
  const bdr  = dark ? "#222"    : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#888"    : "#666";

  useEffect(() => {
    getReviews(business.id).then(setReviews);
    setAvgRating(getAverageRating(business.id));
  }, [business.id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    await addReview({ userId:user.id, userName:user.name, businessId:business.id, rating:myRating, comment:myComment });
    const updated = await getReviews(business.id);
    setReviews(updated);
    setAvgRating(getAverageRating(business.id));
    setMyComment(""); setMyRating(5); setShowReview(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:bg, color:txt, fontFamily:"Inter,system-ui,sans-serif" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(to bottom, rgba(0,0,0,0.7), ${bg})`, padding:"3rem 2rem 2rem", minHeight:200, display:"flex", alignItems:"flex-end" }}>
        <div style={{ maxWidth:900, margin:"0 auto", width:"100%" }}>
          <button onClick={()=>navigate(-1)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"0.82rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:4 }}>← Back</button>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
            <div style={{ width:64,height:64,borderRadius:14,background:"#d4a017",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",flexShrink:0 }}>✂️</div>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:"0.25rem" }}>
                <h1 style={{ fontSize:"1.6rem",fontWeight:800,margin:0 }}>{business.name}</h1>
                {business.verified && <span style={{ background:"rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"0.7rem",fontWeight:700,padding:"2px 8px",borderRadius:999 }}>✓ Verified</span>}
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:12,fontSize:"0.8rem",color:muted,flexWrap:"wrap" }}>
                <span>📍 {business.address}</span>
                <span>📞 {business.phone}</span>
                <span style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <StarRating rating={Number(avgRating)} size={13} />
                  <span style={{ color:txt,fontWeight:600 }}>{avgRating || "New"}</span>
                  <span>({reviews.length} reviews)</span>
                </span>
              </div>
            </div>
            <button onClick={()=>navigate("/booking",{state:{business:business.name}})} style={{ marginLeft:"auto",background:"#d4a017",border:"none",color:"#000",fontWeight:700,fontSize:"0.9rem",padding:"0.7rem 1.75rem",borderRadius:999,cursor:"pointer",flexShrink:0 }}>
              {t("book_now")}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"1.5rem 2rem 4rem" }}>
        {/* Tabs */}
        <div style={{ display:"flex",gap:4,marginBottom:"1.5rem",borderBottom:`1px solid ${bdr}`,paddingBottom:"0.5rem" }}>
          {["services","reviews","hours","about"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:"0.4rem 1rem",borderRadius:8,border:"none",fontSize:"0.82rem",background:activeTab===tab?(dark?"#1e1e1e":"#e5e7eb"):"transparent",color:activeTab===tab?txt:muted,fontWeight:activeTab===tab?700:400,cursor:"pointer",textTransform:"capitalize" }}>{tab}</button>
          ))}
        </div>

        {/* Services tab */}
        {activeTab==="services" && (
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            {business.services.map((s,i)=>(
              <div key={i} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
                <div>
                  <div style={{ fontWeight:600,fontSize:"0.9rem" }}>{s.title}</div>
                  <div style={{ fontSize:"0.75rem",color:muted }}>{s.duration}</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:"1rem" }}>
                  <span style={{ fontWeight:700,color:"#d4a017" }}>Br {s.price}</span>
                  <button onClick={()=>navigate("/booking",{state:{business:business.name,service:{...s,desc:s.title}}})} style={{ background:"#d4a017",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.4rem 1rem",borderRadius:999,cursor:"pointer" }}>Book</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab==="reviews" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
              <div>
                <span style={{ fontSize:"2rem",fontWeight:800 }}>{avgRating || "—"}</span>
                <span style={{ color:muted,fontSize:"0.85rem",marginLeft:8 }}>/ 5 · {reviews.length} reviews</span>
              </div>
              <button onClick={()=>setShowReview(s=>!s)} style={{ background:"#d4a017",border:"none",color:"#000",fontWeight:700,fontSize:"0.82rem",padding:"0.5rem 1.2rem",borderRadius:8,cursor:"pointer" }}>
                {showReview?"Cancel":"Write a Review"}
              </button>
            </div>

            {showReview && (
              <form onSubmit={submitReview} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1.25rem",marginBottom:"1.25rem",display:"flex",flexDirection:"column",gap:"0.75rem" }}>
                <div>
                  <label style={{ fontSize:"0.78rem",color:muted,display:"block",marginBottom:6 }}>Your rating</label>
                  <StarRating rating={myRating} interactive onChange={setMyRating} size={24} />
                </div>
                <div>
                  <label style={{ fontSize:"0.78rem",color:muted,display:"block",marginBottom:6 }}>Your review</label>
                  <textarea value={myComment} onChange={e=>setMyComment(e.target.value)} required rows={3} placeholder="Share your experience..."
                    style={{ width:"100%",background:dark?"#1a1a1a":"#f9fafb",border:`1px solid ${bdr}`,borderRadius:10,padding:"0.7rem 1rem",color:txt,fontSize:"0.85rem",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box" }} />
                </div>
                <button type="submit" style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.85rem",padding:"0.6rem 1.5rem",borderRadius:10,cursor:"pointer",alignSelf:"flex-end" }}>Submit Review</button>
              </form>
            )}

            {reviews.length===0 ? (
              <p style={{ color:muted,textAlign:"center",padding:"2rem" }}>No reviews yet. Be the first!</p>
            ) : reviews.map(r=>(
              <div key={r.id} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1rem 1.25rem",marginBottom:"0.75rem" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:32,height:32,borderRadius:"50%",background:"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:700,color:"#fff" }}>
                      {r.userName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:600,fontSize:"0.82rem" }}>{r.userName}</div>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                  </div>
                  <span style={{ fontSize:"0.7rem",color:muted }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize:"0.82rem",color:muted,margin:0,lineHeight:1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Hours tab */}
        {activeTab==="hours" && (
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1.25rem" }}>
            <h3 style={{ fontWeight:700,fontSize:"0.9rem",marginBottom:"1rem" }}>Working Hours</h3>
            {Object.entries(business.hours).map(([day,hours])=>(
              <div key={day} style={{ display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:`1px solid ${bdr}`,fontSize:"0.85rem" }}>
                <span style={{ fontWeight:600 }}>{day}</span>
                <span style={{ color:hours==="Closed"?"#ef4444":muted }}>{hours}</span>
              </div>
            ))}
          </div>
        )}

        {/* About tab */}
        {activeTab==="about" && (
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1.5rem" }}>
            <h3 style={{ fontWeight:700,fontSize:"0.9rem",marginBottom:"0.75rem" }}>About</h3>
            <p style={{ fontSize:"0.88rem",color:muted,lineHeight:1.7,marginBottom:"1rem" }}>{business.description}</p>
            <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem",fontSize:"0.82rem" }}>
              <div style={{ display:"flex",gap:8 }}><span style={{ color:muted }}>📍</span><span>{business.address}</span></div>
              <div style={{ display:"flex",gap:8 }}><span style={{ color:muted }}>📞</span><span>{business.phone}</span></div>
              <div style={{ display:"flex",gap:8 }}><span style={{ color:muted }}>✉️</span><span>{business.email}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
