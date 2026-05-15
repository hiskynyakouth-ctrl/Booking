// mailService.js — no sample data, starts fresh

const KEY = "mock_emails";

export const getEmails = (folder = "Inbox") => {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]");
  if (folder === "Starred") return all.filter(e => e.starred);
  if (folder === "Sent")    return all.filter(e => e.folder === "Sent");
  if (folder === "Drafts")  return all.filter(e => e.folder === "Drafts");
  if (folder === "Trash")   return all.filter(e => e.folder === "Trash");
  return all.filter(e => e.folder === "Inbox" || !e.folder);
};

export const sendEmail = ({ to, subject, body }) => {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]");
  const sent = { id:Date.now(), from:"Admin", email:"admin@thiyang.com", to, subject, preview:body.slice(0,80), date:"Now", starred:false, unread:false, dot:null, folder:"Sent", body };
  localStorage.setItem(KEY, JSON.stringify([sent, ...all]));
  return sent;
};

export const toggleStar = (id) => {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]").map(e => e.id===id ? {...e,starred:!e.starred} : e);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const markRead = (id) => {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]").map(e => e.id===id ? {...e,unread:false} : e);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const deleteEmail = (id) => {
  localStorage.setItem(KEY, JSON.stringify(JSON.parse(localStorage.getItem(KEY) || "[]").filter(e => e.id !== id)));
};

export const getUnreadCount = () =>
  JSON.parse(localStorage.getItem(KEY) || "[]").filter(e => e.unread && (e.folder==="Inbox"||!e.folder)).length;
