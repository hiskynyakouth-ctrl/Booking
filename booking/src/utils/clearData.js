// clearData.js — wipe all data from localStorage AND MongoDB backend

const LOCAL_KEYS = [
  "mock_orders",
  "mock_payments",
  "mock_notifications",
  "mock_chats",
  "mock_emails",
  "all_bookings",
  "admin_products",
  "admin_users",
  "mock_users",
  "thiyang_seeded_v2",
];

// Wipe localStorage
const clearLocal = () => LOCAL_KEYS.forEach(k => localStorage.removeItem(k));

// Wipe MongoDB via backend API
const clearBackend = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    await fetch("http://localhost:5000/api/reset/all", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // backend offline — local clear is enough
  }
};

export const clearAllData = async () => {
  clearLocal();
  await clearBackend();
};

export const clearOrders       = () => localStorage.removeItem("mock_orders");
export const clearPayments     = () => localStorage.removeItem("mock_payments");
export const clearBookings     = () => localStorage.removeItem("all_bookings");
export const clearNotifications= () => localStorage.removeItem("mock_notifications");
export const clearProducts     = () => localStorage.removeItem("admin_products");
export const clearUsers        = () => localStorage.removeItem("mock_users");
