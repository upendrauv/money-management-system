import axiosClient from './axiosClient';

export const expenseApi = {
  getAll: (params) => axiosClient.get('/expenses', { params }),
  getById: (id) => axiosClient.get(`/expenses/${id}`),
  create: (data) => axiosClient.post('/expenses', data),
  update: (id, data) => axiosClient.put(`/expenses/${id}`, data),
  delete: (id) => axiosClient.delete(`/expenses/${id}`),
};

