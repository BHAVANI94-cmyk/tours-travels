// src/services/api.js
// All API calls to the backend. Import these in your components instead of calling fetch directly.

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

// ─── Helper ───────────────────────────────────────────────
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("tourismUser") || "{}");
  return user.token || "";
};

const headers = (isJson = true) => ({
  ...(isJson && { "Content-Type": "application/json" }),
  Authorization: `Bearer ${getToken()}`,
});

const request = async (method, path, body = null) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request("POST", "/auth/register", body),
  login: (body) => request("POST", "/auth/login", body),
  getMe: () => request("GET", "/auth/me"),
  updateProfile: (body) => request("PATCH", "/auth/update-profile", body),
};

// ─── PLACES ───────────────────────────────────────────────
export const placesAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/places?${q}`);
  },
  getOne: (id) => request("GET", `/places/${id}`),
  create: (body) => request("POST", "/places", body),
  update: (id, body) => request("PATCH", `/places/${id}`, body),
  delete: (id) => request("DELETE", `/places/${id}`),
  getMy: () => request("GET", "/places/seller/my"),
};

// ─── HOTELS ───────────────────────────────────────────────
export const hotelsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/hotels?${q}`);
  },
  getOne: (id) => request("GET", `/hotels/${id}`),
  create: (body) => request("POST", "/hotels", body),
  delete: (id) => request("DELETE", `/hotels/${id}`),
  getMy: () => request("GET", "/hotels/seller/my"),
};

// ─── RESTAURANTS ──────────────────────────────────────────
export const restaurantsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/restaurants?${q}`);
  },
  create: (body) => request("POST", "/restaurants", body),
  delete: (id) => request("DELETE", `/restaurants/${id}`),
  getMy: () => request("GET", "/restaurants/seller/my"),
};

// ─── REELS ────────────────────────────────────────────────
export const reelsAPI = {
  getAll: () => request("GET", "/reels"),
  create: (body) => request("POST", "/reels", body),
  like: (id) => request("POST", `/reels/${id}/like`),
  save: (id) => request("POST", `/reels/${id}/save`),
  delete: (id) => request("DELETE", `/reels/${id}`),
  getMy: () => request("GET", "/reels/seller/my"),
};

// ─── BOOKINGS ─────────────────────────────────────────────
export const bookingsAPI = {
  create: (body) => request("POST", "/bookings/add", body),
  getMy: () => request("GET", "/bookings"),
  cancel: (id) => request("PATCH", `/bookings/${id}/cancel`),
  getSellerBookings: () => request("GET", "/bookings/seller"),
};

// ─── OFFERS ───────────────────────────────────────────────
export const offersAPI = {
  getAll: () => request("GET", "/offers"),
  create: (body) => request("POST", "/offers/add", body),
};

// ─── WISHLIST ─────────────────────────────────────────────
export const wishlistAPI = {
  add: (body) => request("POST", "/wishlist/add", body),
  get: (userId) => request("GET", `/wishlist/${userId}`),
  delete: (id) => request("DELETE", `/wishlist/${id}`),
};

// ─── PAYMENT ──────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (body) => request("POST", "/payment/order", body),
  verifyPayment: (body) => request("POST", "/payment/verify", body),
};

// ─── AI PLANNER ───────────────────────────────────────────
export const plannerAPI = {
  generate: (body) => request("POST", "/ai/ask", body),
};

// ─── ADMIN ────────────────────────────────────────────────
export const adminAPI = {
  getAnalytics: () => request("GET", "/admin/analytics"),
  getUsers: () => request("GET", "/admin/users"),
  changeUserRole: (id, role) => request("PATCH", `/admin/users/${id}/role`, { role }),
  approveSeller: (id) => request("PATCH", `/admin/users/${id}/approve`),
  deleteUser: (id) => request("DELETE", `/admin/users/${id}`),
  getBookings: () => request("GET", "/admin/bookings"),
  cancelBooking: (id) => request("PATCH", `/admin/bookings/${id}/cancel`),
  deleteBooking: (id) => request("DELETE", `/admin/bookings/${id}`),
};
