import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const googleAuth = (data) => API.post('/auth/google', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => API.put(`/auth/reset-password/${token}`, data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getBestSellers = () => API.get('/products/bestsellers');
export const getCategories = () => API.get('/products/categories');
export const getRelatedProducts = (id) => API.get(`/products/${id}/related`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Invoices
export const downloadInvoice = (orderId) => API.get(`/invoices/${orderId}`, { responseType: 'blob' });

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (reviewId, data) => API.put(`/reviews/${reviewId}`, data);
export const getProductReviews = (productId) => API.get(`/reviews/product/${productId}`);
export const getOrderReviews = (orderId) => API.get(`/reviews/order/${orderId}`);
export const getUserReviews = () => API.get('/reviews/user/my-reviews');
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);

// Admin Reviews
export const getAllReviews = () => API.get('/reviews/admin/all');
export const respondToReview = (reviewId, data) => API.put(`/reviews/${reviewId}/respond`, data);
export const toggleReviewReport = (reviewId) => API.put(`/reviews/${reviewId}/toggle-report`);

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`);

// Coupons
export const validateCoupon = (data) => API.post('/coupons/validate', data);

// ═══════════════════════════════════════════
//  ADMIN APIs
// ═══════════════════════════════════════════

// Dashboard & Analytics
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAdminAnalytics = () => API.get('/admin/analytics');

// Admin — Products
export const createAdminProduct = (data) => API.post('/admin/products', data);
export const updateAdminProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteAdminProduct = (id) => API.delete(`/admin/products/${id}`);

// Admin — Orders
export const getAdminOrders = () => API.get('/admin/orders');
export const updateAdminOrderStatus = (id, data) => API.put(`/admin/orders/${id}/status`, data);
export const cancelAdminOrder = (id) => API.put(`/admin/orders/${id}/cancel`);

// Admin — Users
export const getAdminUsers = () => API.get('/admin/users');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const toggleBlockUser = (id) => API.put(`/admin/users/${id}/block`);

// Admin — Coupons
export const getAdminCoupons = () => API.get('/admin/coupons');
export const createAdminCoupon = (data) => API.post('/admin/coupons', data);
export const updateAdminCoupon = (id, data) => API.put(`/admin/coupons/${id}`, data);
export const deleteAdminCoupon = (id) => API.delete(`/admin/coupons/${id}`);

export default API;
