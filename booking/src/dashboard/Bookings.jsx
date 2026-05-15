import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getAllBookings, updateBooking, deleteBooking, adminConfirmPayment, adminRejectPayment, adminSendNotification } from "../services/bookingService";
import DashboardLayout from "../layouts/DashboardLayout";

const ETB = (n) => `ETB ${Number(n||0).toLocaleString()}`;

const statusColor = { pending:"#f59e0b", confirmed:"#22c55e", completed:"#3b82f6", cancelled:"#ef4444" };
const statusBg    = { pending:"rgba(245,158,11,0.12)", confirmed:"rgba(34,197,94,0.12)", completed:"rgba(59,130,246,0.12)", cancelled:"rgba(239,68,68,0.12)" };
const payColor    = { unpaid:"#f59e0b", verified:"#22c55e", rejected:"#ef4444" };
const payBg       = { unpaid:"rgba(245,158,11,0.12)", verified:"rgba(34,197,94,0.12)", rejected:"rgba(239,68,68,0.12)" };

const chartData = [
  { m:"Jan", revenue:15000, orders:800 }, { m:"Feb", revenue:22000, orders:1100 },
  { m:"Mar", revenue:18000, orders:950 }, { m:"Apr", revenue:31000, orders:1400 },
  { m:"May", revenue:27000, orders:1250 },{ m:"Jun", revenue:38000, orders:1600 },
  { m:"Jul", revenue:34000, orders:1500 },{ m:"Aug", revenue:42000, orders:1800 },
  { m:"Sep", revenue:39000, orders:1700 },{ m:"Oct", revenue:48000, orders:2000 },
  { m:"Nov", revenue:44000, orders:1900 },{ m:"Dec", revenue:52000, orders:2200 },
];

const PER_PAGE = 10;

export default function Bookings() {
  const navigate = useNavigate();
  const { t }    = useLanguage();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [bookings,    setBookings]    = useState([]);
  const [search,      setSearch]      = useState("");
  const [filterStatus,setFilterStatus]= useState("All");
  const [filterDate,  setFilterDate]  = useState("");
  const [page,        setPage]        = useState(1);
  const [viewItem,    setViewItem]    = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason,setRejectReason]= useState("");
  const [notifModal,  setNotifModal]  = useState(null);
  const [notifMsg,    setNotifMsg]    = useState({ title:"", body:"" });
  const [toast,       setToast]       = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const card = dark ? "#141720" : "#fff";
  const bdr  = dark ? "#1e2330" : "#e5e7eb";
  const txt  = dark ? "#fff"    : "#111";
  const muted= dark ? "#6b7280" : "#9ca3af";
  const sub  = dark ? "#1e2330" : "#f3f4f6";

  const load = () => setBookings((getAllBookings() || []).filter(Boolean));
  useEffect(() => { load(); }, []);

  const showToast = (msg, color="#22c55e") => { setToast({ msg, color }); setTimeout(()=>setToast(""),3000); };

  const handleConfirm = (id) => {
    adminConfirmPayment(id, "Payment verified by admin");
    load();
    showToast("✅ Payment confirmed — customer notified");
    if (viewItem?.id === id) setViewItem(prev => ({ ...prev, status:"confirmed", paymentStatus:"verified" }));
  };

  const handleReject = () => {
    adminRejectPayment(rejectModal, rejectReason);
    load();
    setRejectModal(null);
    setRejectReason("");
    showToast("❌ Payment rejected — customer notified", "#ef4444");
  };

  const handleSendNotif = () => {
    if (!notifMsg.title || !notifMsg.body) return;
    adminSendNotification({ userId: notifModal.userId, ...notifMsg, type:"info" });
    setNotifModal(null);
    setNotifMsg({ title:"", body:"" });
    showToast("🔔 Notification sent to customer");
  };

  const handleDelete = (id) => {
    deleteBooking(id);
    load();
    showToast("Booking deleted");
    if (viewItem?.id === id) setViewItem(null);
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === "All" || b.status === filterStatus.toLowerCase();
    const matchDate   = !filterDate || b.date === filterDate;
    const matchSearch = !search || b.userName?.toLowerCase().includes(search.toLowerCase()) || b.service?.toLowerCase().includes(search.toLowerCase()) || b.id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchDate && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const STATS = [
    { label:"Upcoming",  value:bookings.filter(b=>b.status==="pending"||b.status==="confirmed").length, change:"+10%", up:true,  icon:"📋" },
    { label:"Total",     value:bookings.length,                                                          change:"+2%",  up:true,  icon:"👤" },
    { label:"Completed", value:bookings.filter(b=>b.status==="completed").length,                        change:"+15%", up:true,  icon:"✅" },
    { label:"Cancelled", value:bookings.filter(b=>b.status==="cancelled").length,                        change:"0%",   up:null,  icon:"❌" },
  ];

  const pendingPayments = bookings.filter(b => b.paymentStatus === "unpaid" && b.status !== "cancelled");

  const inp = { width:"100%", background:dark?"#1a1a2e":"#f9fafb", border:`1px solid ${bdr}`, borderRadius:8, padding:"0.55rem 0.75rem", color:txt, fontSize:"0.82rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const newBookingAction = (
    <button onClick={()=>navigate("/booking")} style={{ background:"#22c55e",border:"none",color:"#000",fontWeight:700,fontSize:"0.78rem",padding:"0.45rem 1rem",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
      + New Booking
    </button>
  );

  return (
    <DashboardLayout title="Bookings" subtitle="Manage your appointments and bookings." actions={newBookingAction}>
      <div style={{ padding:"1.25rem", position:"relative" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position:"fixed",bottom:"1.5rem",right:"1.5rem",background:toast.color||"#22c55e",color:"#000",fontWeight:700,fontSize:"0.82rem",padding:"0.6rem 1.25rem",borderRadius:10,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
            {toast.msg}
          </div>
        )}

        {/* Pending payments banner */}
        {pendingPayments.length > 0 && (
          <div style={{ background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"0.85rem 1.1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:"1.1rem" }}>⏳</span>
              <span style={{ fontWeight:600,color:"#f59e0b",fontSize:"0.88rem" }}>{pendingPayments.length} booking{pendingPayments.length>1?"s":""} awaiting payment verification</span>
            </div>
            <button onClick={()=>setFilterStatus("pending")} style={{ background:"#f59e0b",border:"none",color:"#000",fontWeight:700,fontSize:"0.75rem",padding:"0.35rem 0.9rem",borderRadius:8,cursor:"pointer" }}>
              Review Now
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.25rem" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1.1rem" }}>
              <div style={{ fontSize:"1.2rem",marginBottom:"0.5rem" }}>{s.icon}</div>
              <div style={{ fontSize:"0.72rem",color:muted,marginBottom:"0.3rem" }}>{s.label}</div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:"1.5rem",fontWeight:800 }}>{s.value}</span>
                {s.up!==null&&<span style={{ fontSize:"0.65rem",fontWeight:700,padding:"2px 7px",borderRadius:999,background:s.up?"rgba(34,197,94,0.15)":"rgba(107,114,128,0.15)",color:s.up?"#22c55e":"#6b7280" }}>{s.change}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mid-row" style={{ display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"1.25rem" }}>
          <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,padding:"1.25rem" }}>
            <div style={{ fontWeight:700,fontSize:"0.95rem",marginBottom:"0.25rem" }}>Appointment Stats</div>
            <div style={{ fontSize:"0.72rem",color:muted,marginBottom:"0.75rem" }}>Online and Offline</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1e2330":"#f0f0f0"} />
                <XAxis dataKey="m" tick={{ fontSize:10,fill:muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10,fill:muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                <Tooltip contentStyle={{ background:dark?"#1e2330":"#fff",border:"none",borderRadius:8,fontSize:11 }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" dot={false} strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="orders"  stroke="#f97316" dot={false} strokeWidth={2} name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:14,overflow:"hidden" }}>
          {/* Table header */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.85rem 1rem",borderBottom:`1px solid ${bdr}`,flexWrap:"wrap",gap:8 }}>
            <span style={{ fontWeight:700,fontSize:"0.95rem" }}>Recent Appointments</span>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,background:sub,borderRadius:10,padding:"0.4rem 0.8rem" }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." style={{ background:"transparent",border:"none",outline:"none",color:txt,fontSize:"0.78rem",width:140 }} />
              </div>
              {["All","pending","confirmed","completed","cancelled"].map(s=>(
                <button key={s} onClick={()=>{setFilterStatus(s);setPage(1);}} style={{ padding:"0.3rem 0.75rem",borderRadius:8,border:"none",fontSize:"0.72rem",background:filterStatus===s?(dark?"#1e2330":"#e5e7eb"):"transparent",color:filterStatus===s?txt:muted,fontWeight:filterStatus===s?700:400,cursor:"pointer",textTransform:"capitalize" }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.78rem",minWidth:700 }}>
              <thead>
                <tr style={{ color:muted,borderBottom:`1px solid ${bdr}`,background:dark?"#0d1117":"#f9fafb" }}>
                  {["Customer","Service","Date","Payment","Status","Action"].map(h=>(
                    <th key={h} style={{ textAlign:"left",padding:"0.55rem 0.75rem",fontWeight:500,fontSize:"0.72rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length===0 ? (
                  <tr><td colSpan={6} style={{ textAlign:"center",padding:"3rem",color:muted }}>No bookings found</td></tr>
                ) : paginated.map(b=>(
                  <tr key={b.id} style={{ borderBottom:`1px solid ${bdr}` }}>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ fontWeight:600,fontSize:"0.82rem" }}>{b.userName||"—"}</div>
                      <div style={{ color:muted,fontSize:"0.68rem" }}>{b.userEmail||""}</div>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <div style={{ width:32,height:32,borderRadius:8,overflow:"hidden",background:"#1e2330",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                          {b.serviceIcon && (b.serviceIcon.startsWith("http")||b.serviceIcon.startsWith("/")) ? (
                            <img src={b.serviceIcon} alt={b.service} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{e.target.style.display="none";}} />
                          ) : (
                            <span style={{ fontSize:"1rem" }}>{b.serviceIcon||"📅"}</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight:500,fontSize:"0.78rem" }}>{b.service}</div>
                          <div style={{ color:muted,fontSize:"0.68rem" }}>{ETB(b.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem",color:muted,whiteSpace:"nowrap",fontSize:"0.75rem" }}>{b.date} · {b.time}</td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <span style={{ fontSize:"0.7rem",fontWeight:600,color:payColor[b.paymentStatus||"unpaid"],background:payBg[b.paymentStatus||"unpaid"],padding:"3px 10px",borderRadius:999,textTransform:"capitalize" }}>
                        {b.paymentStatus||"unpaid"}
                      </span>
                      {b.bankName && <div style={{ fontSize:"0.65rem",color:muted,marginTop:2 }}>{b.bankName}</div>}
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <span style={{ fontSize:"0.7rem",fontWeight:600,color:statusColor[b.status||"pending"],background:statusBg[b.status||"pending"],padding:"3px 10px",borderRadius:999,textTransform:"capitalize" }}>
                        {b.status||"pending"}
                      </span>
                    </td>
                    <td style={{ padding:"0.65rem 0.75rem" }}>
                      <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                        <button onClick={()=>setViewItem(b)} title="View" style={{ background:"#1e2330",border:"none",color:"#aaa",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:"0.8rem" }}>👁</button>
                        {b.paymentStatus==="unpaid" && b.status!=="cancelled" && (
                          <>
                            <button onClick={()=>handleConfirm(b.id)} title="Confirm payment" style={{ background:"rgba(34,197,94,0.15)",border:"none",color:"#22c55e",fontSize:"0.68rem",padding:"0 8px",height:26,borderRadius:6,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap" }}>✓ Verify</button>
                            <button onClick={()=>setRejectModal(b.id)} title="Reject payment" style={{ background:"rgba(239,68,68,0.1)",border:"none",color:"#ef4444",fontSize:"0.68rem",padding:"0 8px",height:26,borderRadius:6,cursor:"pointer",fontWeight:700 }}>✕</button>
                          </>
                        )}
                        <button onClick={()=>setNotifModal(b)} title="Send notification" style={{ background:"rgba(59,130,246,0.1)",border:"none",color:"#3b82f6",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:"0.8rem" }}>🔔</button>
                        <button onClick={()=>handleDelete(b.id)} title="Delete" style={{ background:"rgba(239,68,68,0.1)",border:"none",color:"#ef4444",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:"0.8rem" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",borderTop:`1px solid ${bdr}`,fontSize:"0.75rem",color:muted,flexWrap:"wrap",gap:8 }}>
            <span>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex",gap:4 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background:card,border:`1px solid ${bdr}`,color:page===1?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===1?"not-allowed":"pointer",fontSize:"0.78rem" }}>Previous</button>
              {Array.from({length:totalPages},(_,i)=>i+1).slice(Math.max(0,page-2),Math.min(totalPages,page+1)).map(p=>(
                <button key={p} onClick={()=>setPage(p)} style={{ width:28,height:28,borderRadius:8,border:page===p?"none":`1px solid ${bdr}`,cursor:"pointer",fontSize:"0.78rem",background:page===p?"#22c55e":card,color:page===p?"#000":txt,fontWeight:page===p?700:400 }}>{p}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ background:card,border:`1px solid ${bdr}`,color:page===totalPages?muted+"66":txt,padding:"0.3rem 0.7rem",borderRadius:8,cursor:page===totalPages?"not-allowed":"pointer",fontSize:"0.78rem" }}>Next</button>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {viewItem && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setViewItem(null)}>
            <div style={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:460,margin:"0 1rem" }} onClick={e=>e.stopPropagation()}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
                <h3 style={{ fontWeight:700,fontSize:"1rem",color:txt }}>Booking Details</h3>
                <button onClick={()=>setViewItem(null)} style={{ background:"none",border:"none",color:muted,cursor:"pointer",fontSize:"1.2rem" }}>✕</button>
              </div>
              {[
                ["Booking ID", viewItem.id],
                ["Customer",   viewItem.userName],
                ["Email",      viewItem.userEmail],
                ["Service",    viewItem.service],
                ["Date",       viewItem.date],
                ["Time",       viewItem.time],
                ["Amount",     ETB(viewItem.price)],
                ["Payment",    viewItem.paymentMethod],
                ["Bank",       viewItem.bankName||"—"],
                ["Pay Status", viewItem.paymentStatus||"unpaid"],
                ["Status",     viewItem.status],
                ["Notes",      viewItem.notes||"—"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:`1px solid ${bdr}`,fontSize:"0.82rem" }}>
                  <span style={{ color:muted }}>{k}</span>
                  <span style={{ fontWeight:600,color:txt,textTransform:"capitalize" }}>{v}</span>
                </div>
              ))}
              {viewItem.paymentStatus==="unpaid" && viewItem.status!=="cancelled" && (
                <div style={{ display:"flex",gap:8,marginTop:"1.25rem" }}>
                  <button onClick={()=>{handleConfirm(viewItem.id);setViewItem(null);}} style={{ flex:1,background:"#22c55e",border:"none",color:"#000",fontWeight:700,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>✓ Verify Payment</button>
                  <button onClick={()=>{setRejectModal(viewItem.id);setViewItem(null);}} style={{ flex:1,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontWeight:700,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>✕ Reject</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setRejectModal(null)}>
            <div style={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:400,margin:"0 1rem" }} onClick={e=>e.stopPropagation()}>
              <h3 style={{ fontWeight:700,fontSize:"1rem",color:txt,marginBottom:"1rem" }}>Reject Payment</h3>
              <label style={{ fontSize:"0.78rem",color:muted,display:"block",marginBottom:6 }}>Reason (optional)</label>
              <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={3} placeholder="e.g. Payment not received, wrong reference..."
                style={{ ...inp,resize:"vertical" }} />
              <div style={{ display:"flex",gap:8,marginTop:"1rem" }}>
                <button onClick={()=>setRejectModal(null)} style={{ flex:1,background:sub,border:`1px solid ${bdr}`,color:muted,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>Cancel</button>
                <button onClick={handleReject} style={{ flex:1,background:"#ef4444",border:"none",color:"#fff",fontWeight:700,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>Reject</button>
              </div>
            </div>
          </div>
        )}

        {/* Send Notification Modal */}
        {notifModal && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setNotifModal(null)}>
            <div style={{ background:dark?"#111318":"#fff",border:`1px solid ${bdr}`,borderRadius:16,padding:"1.75rem",width:"100%",maxWidth:420,margin:"0 1rem" }} onClick={e=>e.stopPropagation()}>
              <h3 style={{ fontWeight:700,fontSize:"1rem",color:txt,marginBottom:"0.5rem" }}>Send Notification</h3>
              <p style={{ fontSize:"0.78rem",color:muted,marginBottom:"1rem" }}>To: {notifModal.userName}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
                <div>
                  <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Title</label>
                  <input value={notifMsg.title} onChange={e=>setNotifMsg(n=>({...n,title:e.target.value}))} placeholder="Notification title" style={inp} />
                </div>
                <div>
                  <label style={{ fontSize:"0.75rem",color:muted,display:"block",marginBottom:4 }}>Message</label>
                  <textarea value={notifMsg.body} onChange={e=>setNotifMsg(n=>({...n,body:e.target.value}))} rows={3} placeholder="Write your message..." style={{ ...inp,resize:"vertical" }} />
                </div>
              </div>
              <div style={{ display:"flex",gap:8,marginTop:"1rem" }}>
                <button onClick={()=>setNotifModal(null)} style={{ flex:1,background:sub,border:`1px solid ${bdr}`,color:muted,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>Cancel</button>
                <button onClick={handleSendNotif} style={{ flex:1,background:"#3b82f6",border:"none",color:"#fff",fontWeight:700,padding:"0.6rem",borderRadius:10,cursor:"pointer" }}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
