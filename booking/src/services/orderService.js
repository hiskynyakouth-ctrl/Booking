// orderService.js — orders stored in localStorage (no sample data)

const KEY = "mock_orders";

export const getOrders = () => JSON.parse(localStorage.getItem(KEY) || "[]");

export const saveOrders = (orders) => localStorage.setItem(KEY, JSON.stringify(orders));

export const createOrder = (order) => {
  const all = getOrders();
  const newOrder = {
    ...order,
    id:   "ORD-" + Math.floor(7000 + Math.random() * 1000),
    date: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
  };
  saveOrders([newOrder, ...all]);
  return newOrder;
};

export const updateOrder = (id, changes) => {
  saveOrders(getOrders().map(o => o.id === id ? { ...o, ...changes } : o));
};

export const deleteOrder = (id) => saveOrders(getOrders().filter(o => o.id !== id));
