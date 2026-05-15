// chatService.js — shared chat store for admin ↔ customer messaging
// All conversations stored under "mock_chats" so both sides share the same data

const KEY = "mock_chats";

const getData = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{"conversations":[],"messages":{}}');
  } catch {
    return { conversations: [], messages: {} };
  }
};
const saveData = (d) => localStorage.setItem(KEY, JSON.stringify(d));
const emit = () => window.dispatchEvent(new Event("chat-updated"));

// ── Conversation helpers ──────────────────────────────────────────────────────

export const getChatData = () => getData();
export const getAdminConversations = () => getData().conversations;
export const getContacts = () => getData().conversations;

export const getMessages = (conversationId) =>
  (getData().messages || {})[String(conversationId)] || [];
export const getChats = (conversationId) => getMessages(conversationId);

export const getTotalUnread = () =>
  getAdminConversations().reduce((s, c) => s + (c.unread || 0), 0);

// ── Customer sends message to admin ──────────────────────────────────────────
// Creates or updates a conversation thread keyed by userId
export const userSendMessage = (userId, userName, text) => {
  const d = getData();
  const existing = d.conversations.find(c => c.userId === String(userId));
  const convId = existing ? existing.id : Date.now();

  if (!existing) {
    const initials = userName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];
    d.conversations.unshift({
      id: convId,
      userId: String(userId),
      userName,
      name: userName,
      initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      online: true,
      lastMsg: text,
      last: text,
      time: "Now",
      unread: 1,
    });
  } else {
    d.conversations = d.conversations.map(c =>
      c.id === convId
        ? { ...c, lastMsg: text, last: text, time: "Now", unread: (c.unread || 0) + 1 }
        : c
    );
  }

  const key = String(convId);
  const msg = {
    id: Date.now(),
    from: "user",
    fromId: String(userId),
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    createdAt: new Date().toISOString(),
  };
  d.messages[key] = [...(d.messages[key] || []), msg];
  saveData(d);
  emit();
  return convId;
};

// ── Admin sends message to a user ─────────────────────────────────────────────
export const sendMessageToUser = (conversationId, text) => {
  const d = getData();
  const key = String(conversationId);
  const msg = {
    id: Date.now(),
    from: "admin",
    fromId: "admin",
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    createdAt: new Date().toISOString(),
  };
  d.messages[key] = [...(d.messages[key] || []), msg];
  // Update last message, clear admin unread
  d.conversations = d.conversations.map(c =>
    c.id === conversationId
      ? { ...c, lastMsg: text, last: text, time: "Now", unread: 0, hasAdminReply: true }
      : c
  );
  saveData(d);
  emit();
  return msg;
};

// Generic send (used internally)
export const sendMessage = (conversationId, text, from = "admin") => {
  if (from === "admin") return sendMessageToUser(conversationId, text);
  return null;
};

// ── Utility ───────────────────────────────────────────────────────────────────
export const markConversationRead = (conversationId) => {
  const d = getData();
  d.conversations = d.conversations.map(c =>
    c.id === conversationId ? { ...c, unread: 0 } : c
  );
  saveData(d);
  emit();
};

export const deleteMessage = (conversationId, messageId) => {
  const d = getData();
  const key = String(conversationId);
  d.messages[key] = (d.messages[key] || []).filter(m => m.id !== messageId);
  saveData(d);
  emit();
};

export const clearChat = (conversationId) => {
  const d = getData();
  d.messages[String(conversationId)] = [];
  saveData(d);
  emit();
};

export const deleteConversation = (conversationId) => {
  const d = getData();
  d.conversations = d.conversations.filter(c => c.id !== conversationId);
  delete d.messages[String(conversationId)];
  saveData(d);
  emit();
};
