import api from "./api";

// paymentService.js — set USE_BACKEND = true when server is running
const USE_BACKEND = false;
const PAYMENTS_KEY = "mock_payments";
const getAll = () => JSON.parse(localStorage.getItem(PAYMENTS_KEY) || "[]");
const saveAll = (items) => localStorage.setItem(PAYMENTS_KEY, JSON.stringify(items));

const genId = () => "PAY-" + Math.random().toString(36).slice(2,8).toUpperCase();
const normalizePayment = (payment) => ({
  ...payment,
  id: payment._id || payment.id,
  userName: payment.userName || payment.user?.name || payment.user?.email || "",
  amount: Number(payment.amount || 0),
  createdAt: payment.createdAt || new Date().toISOString(),
  status: payment.status || "pending",
  method: payment.method || "card",
});

const fallbackSave = (payment) => {
  const all = getAll();
  saveAll([payment, ...all]);
  return payment;
};

export const processPayment = async ({ userId, userName, type, description, amount, method, bankName = null, bankRef = null, cardLast4 = null }) => {
  const payload = { userId, userName, type, description, amount, method, bankName, bankRef, cardLast4 };
  if (!USE_BACKEND) {
    const payment = { id: genId(), ...payload, status: method === "card" ? "paid" : "pending", createdAt: new Date().toISOString() };
    return fallbackSave(payment);
  }
  try {
    const response = await api.post("/payments", payload);
    return normalizePayment(response.data);
  } catch {
    const payment = { id: genId(), ...payload, status: method === "card" ? "paid" : "pending", createdAt: new Date().toISOString() };
    return fallbackSave(payment);
  }
};

export const getUserPayments = async (userId) => {
  if (!USE_BACKEND) return getAll().filter(p => p.userId === userId).map(normalizePayment);
  try {
    const response = await api.get("/payments/user");
    return response.data.map(normalizePayment);
  } catch {
    return getAll().filter(p => p.userId === userId).map(normalizePayment);
  }
};

export const getAllPayments = async () => {
  if (!USE_BACKEND) return getAll().map(normalizePayment);
  try {
    const response = await api.get("/payments");
    return response.data.map(normalizePayment);
  } catch {
    return getAll().map(normalizePayment);
  }
};

export const refundPayment = async (paymentId, reason = "") => {
  if (!USE_BACKEND) {
    const all = getAll();
    const updated = all.map(p => p.id === paymentId ? { ...p, status:"refunded", refundedAt:new Date().toISOString(), refundReason:reason } : p);
    saveAll(updated);
    return normalizePayment(updated.find(p => p.id === paymentId));
  }
  try {
    const response = await api.put(`/payments/${paymentId}/refund`, { reason });
    return normalizePayment(response.data);
  } catch {
    const all = getAll();
    const updated = all.map(p => p.id === paymentId ? { ...p, status:"refunded", refundedAt:new Date().toISOString(), refundReason:reason } : p);
    saveAll(updated);
    return normalizePayment(updated.find(p => p.id === paymentId));
  }
};

export const downloadInvoice = (payment) => {
  const lines = [
    "THIYANG INVOICE",
    "═══════════════════════════════",
    `Invoice ID:   ${payment.id}`,
    `Date:         ${new Date(payment.createdAt).toLocaleDateString()}`,
    `Customer:     ${payment.userName}`,
    "───────────────────────────────",
    `Description:  ${payment.description}`,
    `Method:       ${payment.method}${payment.cardLast4 ? ` (•••• ${payment.cardLast4})` : ""}`,
    ...(payment.bankName ? [`Bank:         ${payment.bankName}`] : []),
    ...(payment.bankRef ? [`Reference:    ${payment.bankRef}`] : []),
    `Status:       ${payment.status.toUpperCase()}`,
    "───────────────────────────────",
    `TOTAL:        Br ${payment.amount.toFixed(2)}`,
    "═══════════════════════════════",
    "Thank you for using Services.",
  ].join("\n");

  const blob = new Blob([lines], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${payment.id}.txt`;
  a.click();
};
