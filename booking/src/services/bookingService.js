// bookingService.js — real API with localStorage fallback
import api from "./api";

const USE_BACKEND = false;
const KEY = "all_bookings";

// ── localStorage helpers ──────────────────────────────────────────────────────
export const getAllBookings   = () => JSON.parse(localStorage.getItem(KEY) || "[]");
export const saveAllBookings  = (b) => localStorage.setItem(KEY, JSON.stringify(b));
export const getUserBookings  = (userId) => getAllBookings().filter(b => String(b.userId||b.user) === String(userId));

const normalize = (b) => ({
  ...b,
  id:           b._id || b.id,
  userId:       b.user?._id || b.user || b.userId,
  userName:     b.user?.name || b.userName || "",
  userEmail:    b.user?.email || b.userEmail || "",
  service:      b.serviceTitle || b.service || "",
  serviceTitle: b.serviceTitle || b.service || "",
});

// ── Sync API response into localStorage so offline reads still work ───────────
const syncToLocal = (bookings) => {
  saveAllBookings(bookings.map(normalize));
};

// ── Public API ────────────────────────────────────────────────────────────────
export const fetchAllBookings = async () => {
  if (!USE_BACKEND) return getAllBookings();
  try {
    const res = await api.get("/bookings");
    const normalized = res.data.map(normalize);
    syncToLocal(normalized);
    return normalized;
  } catch {
    return getAllBookings();
  }
};

export const createBooking = async (booking) => {
  if (!USE_BACKEND) {
    const newB = { ...booking, id:"BK-"+Math.random().toString(36).slice(2,7).toUpperCase(), status:"pending", paymentStatus:"unpaid", createdAt:new Date().toISOString() };
    saveAllBookings([newB, ...getAllBookings()]);
    return newB;
  }
  try {
    const res = await api.post("/bookings", booking);
    const newB = normalize(res.data);
    saveAllBookings([newB, ...getAllBookings()]);
    return newB;
  } catch {
    const newB = { ...booking, id:"BK-"+Math.random().toString(36).slice(2,7).toUpperCase(), status:"pending", paymentStatus:"unpaid", createdAt:new Date().toISOString() };
    saveAllBookings([newB, ...getAllBookings()]);
    return newB;
  }
};

export const updateBooking = async (id, changes) => {
  // Optimistic local update first
  const all = getAllBookings().map(b => (b.id===id||b._id===id) ? {...b,...changes} : b);
  saveAllBookings(all);
  if (!USE_BACKEND) return all.find(b => b.id===id);
  try {
    const res = await api.put(`/bookings/${id}`, changes);
    return normalize(res.data);
  } catch {
    return all.find(b => b.id===id);
  }
};

export const deleteBooking = async (id) => {
  saveAllBookings(getAllBookings().filter(b => b.id!==id && b._id!==id));
  if (!USE_BACKEND) return;
  try { await api.delete(`/bookings/${id}`); } catch { /* already removed locally */ }
};

// ── Admin actions ─────────────────────────────────────────────────────────────
export const adminConfirmPayment = (bookingId, adminNote = "") =>
  updateBooking(bookingId, { status:"confirmed", paymentStatus:"verified", verifiedAt:new Date().toISOString(), adminNote });

export const adminRejectPayment = (bookingId, reason = "") =>
  updateBooking(bookingId, { status:"cancelled", paymentStatus:"rejected", adminNote:reason });

export const adminSendNotification = ({ userId, title, body, type = "info" }) => {
  const notifs = JSON.parse(localStorage.getItem("mock_notifications") || "[]");
  notifs.unshift({ id:Date.now(), userId:String(userId), title, body, type, read:false, createdAt:new Date().toISOString() });
  localStorage.setItem("mock_notifications", JSON.stringify(notifs));
  if (USE_BACKEND) {
    api.post("/notifications", { userId, title, body, type }).catch(() => {});
  }
};
