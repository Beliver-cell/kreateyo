import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsApi = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Services API
export const servicesApi = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/services', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  joinZoom: async (id: string) => {
    const response = await api.get(`/business/appointments/${id}/start-zoom`);
    return response.data;
  },
};

// Posts API
export const postsApi = {
  getAll: async () => {
    const response = await api.get('/blog-posts');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/blog-posts', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/blog-posts/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/blog-posts/${id}`);
    return response.data;
  },
};

// Customers API
export const customersApi = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
  getRevenue: async (params: any) => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },
};

// Files API
export const filesApi = {
  getAll: async () => {
    const response = await api.get('/files');
    return response.data;
  },
  upload: async (formData: FormData) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },
};
