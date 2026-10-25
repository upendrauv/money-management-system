import axiosClient from './axiosClient';

export const budgetApi = {
  getAll: (params) => axiosClient.get('/budgets', { params }),
  setBudget: (data) => axiosClient.post('/budgets', data),
  delete: (id) => axiosClient.delete(`/budgets/${id}`),
};

