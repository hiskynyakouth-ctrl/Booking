// reviewService.js — mock reviews stored in localStorage

const KEY = "mock_reviews";
const getAll = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const saveAll = (r) => localStorage.setItem(KEY, JSON.stringify(r));

export const getReviews = (businessId) =>
  Promise.resolve(getAll().filter(r => r.businessId === businessId));

export const addReview = ({ userId, userName, businessId, rating, comment }) => {
  const review = {
    id:         Date.now(),
    userId, userName, businessId, rating, comment,
    createdAt:  new Date().toISOString(),
  };
  saveAll([review, ...getAll()]);
  return Promise.resolve(review);
};

export const deleteReview = (id) => {
  saveAll(getAll().filter(r => r.id !== id));
  return Promise.resolve();
};

export const getAverageRating = (businessId) => {
  const reviews = getAll().filter(r => r.businessId === businessId);
  if (!reviews.length) return 0;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
};
