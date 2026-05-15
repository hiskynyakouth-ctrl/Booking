export const isEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone    = (v) => /^\+?[\d\s\-()]{7,15}$/.test(v);
export const isRequired = (v) => v !== null && v !== undefined && String(v).trim() !== "";
export const minLength  = (v, n) => String(v).length >= n;
export const maxLength  = (v, n) => String(v).length <= n;
