import axiosClient from './axiosClient';

export const billApi = {
  getAll: (params) => axiosClient.get('/bills', { params }),
  getById: (id) => axiosClient.get(`/bills/${id}`),
  create: (data) => axiosClient.post('/bills', data),
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),
  markAsPaid: (id, paidDate) => axiosClient.patch(`/bills/${id}/pay`, null, { params: { paidDate } }),
  markAsPending: (id) => axiosClient.patch(`/bills/${id}/pending`),
  delete: (id) => axiosClient.delete(`/bills/${id}`),
};

