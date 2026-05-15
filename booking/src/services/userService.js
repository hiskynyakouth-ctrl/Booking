// userService.js — reads from the same mock_users key as authService

const KEY = "mock_users";

export const getUsers = () => JSON.parse(localStorage.getItem(KEY) || "[]");

export const getAllUsers = getUsers;

export const persistUsers = (users) => localStorage.setItem(KEY, JSON.stringify(users));

export const createUser = (user) => {
  const all = getUsers();
  const colors = ["#22c55e","#3b82f6","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316"];
  const newUser = {
    ...user,
    id:       Date.now(),
    initials: user.name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "U",
    color:    colors[Math.floor(Math.random()*colors.length)],
    joined:   new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
    orders:   0, spent:0, last:"Just now",
  };
  persistUsers([newUser, ...all]);
  return newUser;
};

export const updateUser = (id, changes) => {
  persistUsers(getUsers().map(u => (u.id===id||u.id===String(id)) ? {...u,...changes} : u));
};

export const deleteUser = (id) => persistUsers(getUsers().filter(u => u.id!==id && u.id!==String(id)));

export const getUserById = (id) => getUsers().find(u => u.id===id || u.id===String(id));
