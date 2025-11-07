import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const customerApi = axios.create({
  baseURL: `${API_BASE}/api/customer`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
customerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const customerAuth = {
  login: async (credentials: { email: string; password: string; businessId: string }) => {
    const response = await customerApi.post('/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    businessId: string;
    businessType: string;
  }) => {
    const response = await customerApi.post('/auth/signup', userData);
    return response.data;
  },
  
  verifyEmail: async (token: string) => {
    const response = await customerApi.post('/auth/verify-email', { token });
    return response.data;
  },
  
  forgotPassword: async (email: string, businessId: string) => {
    const response = await customerApi.post('/auth/forgot-password', { email, businessId });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await customerApi.post('/auth/reset-password', { token, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await customerApi.get('/auth/me');
    return response.data;
  },
};

// Services dashboard endpoints
export const servicesApi = {
  getDashboard: async () => {
    const response = await customerApi.get('/dashboard/services');
    return response.data;
  },
  
  joinZoomMeeting: async (appointmentId: string) => {
    const response = await customerApi.get(`/dashboard/appointments/${appointmentId}/join-zoom`);
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await customerApi.put('/dashboard/profile', data);
    return response.data;
  },
};

// E-commerce dashboard endpoints
export const ecommerceApi = {
  getDashboard: async () => {
    const response = await customerApi.get('/dashboard/ecommerce');
    return response.data;
  },
  
  getOrders: async () => {
    const response = await customerApi.get('/orders');
    return response.data;
  },
  
  updateCart: async (cart: any[]) => {
    const response = await customerApi.put('/cart', { cart });
    return response.data;
  },
};
