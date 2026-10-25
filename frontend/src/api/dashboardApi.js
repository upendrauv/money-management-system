import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: (params) => axiosClient.get('/dashboard/summary', { params }),
};

