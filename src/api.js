import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('pet-app-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload) => http.post('/auth/register', payload);
export const loginUser = (payload) => http.post('/auth/login', payload);
export const verifyEmail = (token) => http.get(`/auth/verify-email?token=${token}`);
export const forgotPassword = (payload) => http.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => http.post('/auth/reset-password', payload);
export const fetchListings = (params) => http.get('/listings', { params });
export const fetchListingById = (id) => http.get(`/listings/${id}`);
export const createListing = (payload) => http.post('/listings', payload);
export const updateListing = (id, payload) => http.put(`/listings/${id}`, payload);
export const deleteListing = (id) => http.delete(`/listings/${id}`);
export const getMatches = (id) => http.get(`/listings/${id}/matches`);
export const uploadImage = (formData) => http.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const fetchInbox = () => http.get('/messages/inbox');
export const sendMessage = (payload) => http.post('/messages', payload);
export const markMessageRead = (id) => http.put(`/messages/${id}/read`);
export const fetchProfile = () => http.get('/auth/me');
export const updateProfile = (payload) => http.put('/auth/profile', payload);
export const changePassword = (payload) => http.put('/auth/change-password', payload);
export const verifyPassword = (payload) => http.post('/auth/verify-password', payload);
export const toggleFavorite = (id) => http.post(`/auth/favorites/${id}`);
export const fetchFavorites = () => http.get('/auth/favorites');
export const submitVerification = (payload) => http.post('/verification', payload);
export const fetchVerificationStatus = () => http.get('/verification/status');

// Admin Endpoints
export const fetchAdminStats = () => http.get('/admin/stats');
export const fetchAdminUsers = () => http.get('/admin/users');
export const verifyNGO = (id) => http.patch(`/admin/users/${id}/verify-ngo`);
export const deleteUser = (id) => http.delete(`/admin/users/${id}`);
export const fetchAdminListings = () => http.get('/admin/listings');
export const fetchAdminDonations = () => http.get('/admin/donations');
export const fetchMyDonations = () => http.get('/donations/my');
export const submitDonation = (payload) => http.post('/donations', payload);
export const toggleFlagListing = (id) => http.patch(`/admin/listings/${id}/flag`);
export const deleteListingAdmin = (id) => http.delete(`/admin/listings/${id}`);
