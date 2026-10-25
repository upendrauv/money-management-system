import axiosClient from './axiosClient';

export const incomeApi = {
  getAll: (params) => axiosClient.get('/incomes', { params }),
  getById: (id) => axiosClient.get(`/incomes/${id}`),
  create: (data) => axiosClient.post('/incomes', data),
  update: (id, data) => axiosClient.put(`/incomes/${id}`, data),
  delete: (id) => axiosClient.delete(`/incomes/${id}`),
};

