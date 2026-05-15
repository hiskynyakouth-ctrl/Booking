// notificationService.js
const KEY = "mock_notifications";
const getAll = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const saveAll = (n) => localStorage.setItem(KEY, JSON.stringify(n));
const emit = () => window.dispatchEvent(new Event("notifications-changed"));

// userId can be: "admin", "all", or a user id (string or number)
export const getNotifications = (userId) => {
  const id = String(userId);
  return Promise.resolve(
    getAll().filter(n => n.userId === "all" || String(n.userId) === id)
  );
};

export const addNotification = ({ userId, title, body, type = "info" }) => {
  if (!title) return Promise.resolve(null);
  const notif = {
    id: Date.now() + Math.random(), // ensure unique
    userId: userId ? String(userId) : "all",
    title,
    body: body || "",
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveAll([notif, ...getAll()]);
  emit();
  return Promise.resolve(notif);
};

export const markRead = (id) => {
  saveAll(getAll().map(n => n.id == id ? { ...n, read: true } : n));
  emit();
  return Promise.resolve();
};

export const markAllRead = (userId) => {
  const id = String(userId);
  saveAll(getAll().map(n =>
    (n.userId === "all" || String(n.userId) === id) ? { ...n, read: true } : n
  ));
  emit();
  return Promise.resolve();
};

export const removeNotification = (id) => {
  saveAll(getAll().filter(n => n.id != id));
  emit();
  return Promise.resolve();
};

export const getUnreadCount = (userId) => {
  const id = String(userId);
  return getAll().filter(n =>
    (n.userId === "all" || String(n.userId) === id) && !n.read
  ).length;
};
