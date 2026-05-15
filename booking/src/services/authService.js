// authService.js
// Flip to true only when the backend server is running
const USE_BACKEND = false;

const API       = "http://localhost:5000/api";
const TOKEN_KEY = "token";
const ME_KEY    = "mock_me";
const USERS_KEY = "mock_users";

// ── Mock helpers ──────────────────────────────────────────────────────────────
const getUsers  = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

const mockRegister = (name, email, password, role = "customer", phone = "") => {
  try {
    const users = getUsers();
    if (users.find(u => u.email === email))
      return Promise.reject({ response: { data: { message: "Email already registered. Try logging in instead." } } });
    if (!name || !email || !password)
      return Promise.reject({ response: { data: { message: "Name, email and password are required." } } });
    const isFirst = users.length === 0;
    const user = {
      id: Date.now(), name, email, phone, password,
      role: isFirst ? "admin" : role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    saveUsers([...users, user]);
    const token = btoa(JSON.stringify({ id: user.id, email }));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ME_KEY, JSON.stringify(user));
    return Promise.resolve({ data: { token, user } });
  } catch (e) {
    return Promise.reject({ response: { data: { message: "Registration error: " + e.message } } });
  }
};

const mockLogin = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u && u.email === email && u.password === password);
  if (!user)
    return Promise.reject({ response: { data: { message: "Invalid email or password." } } });
  const updatedUser = { ...user, lastLogin: new Date().toISOString() };
  saveUsers(users.map(u => u && u.id === user.id ? updatedUser : u));
  const token = btoa(JSON.stringify({ id: user.id, email }));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ME_KEY, JSON.stringify(updatedUser));
  return Promise.resolve({ data: { token, user: updatedUser } });
};

// ── Public API ────────────────────────────────────────────────────────────────
export const register = (name, email, password, role = "customer", phone = "") => {
  if (!USE_BACKEND) return mockRegister(name, email, password, role, phone);
  return import("axios").then(({ default: axios }) => {
    const api = axios.create({ baseURL: API });
    return api.post("/auth/register", { name, email, password, role, phone })
      .then(res => { localStorage.setItem(TOKEN_KEY, res.data.token); localStorage.setItem(ME_KEY, JSON.stringify(res.data.user)); return res; })
      .catch(err => {
        if (err.code === "ERR_NETWORK" || err.code === "ERR_CONNECTION_REFUSED")
          return mockRegister(name, email, password, role, phone);
        throw err;
      });
  });
};

export const login = (email, password) => {
  if (!USE_BACKEND) return mockLogin(email, password);
  return import("axios").then(({ default: axios }) => {
    const api = axios.create({ baseURL: API });
    return api.post("/auth/login", { email, password })
      .then(res => { localStorage.setItem(TOKEN_KEY, res.data.token); localStorage.setItem(ME_KEY, JSON.stringify(res.data.user)); return res; })
      .catch(err => {
        if (err.code === "ERR_NETWORK" || err.code === "ERR_CONNECTION_REFUSED")
          return mockLogin(email, password);
        throw err;
      });
  });
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ME_KEY);
};

export const getMe = () => {
  // Always use localStorage when backend is off
  const me = localStorage.getItem(ME_KEY);
  if (!USE_BACKEND || !me) {
    return me
      ? Promise.resolve({ data: { user: JSON.parse(me) } })
      : Promise.reject(new Error("Not logged in"));
  }
  return import("axios").then(({ default: axios }) => {
    const api = axios.create({ baseURL: API });
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return api.get("/auth/me").catch(() => {
      return me
        ? { data: { user: JSON.parse(me) } }
        : Promise.reject(new Error("Not logged in"));
    });
  });
};

export const getAllUsers = () => getUsers();

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    const me = JSON.parse(localStorage.getItem(ME_KEY) || "{}");
    if (me.id === userId) {
      localStorage.setItem(ME_KEY, JSON.stringify(users[index]));
    }
  }
};
