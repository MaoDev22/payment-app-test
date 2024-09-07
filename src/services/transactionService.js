import apiClient from 'utils/axios';

export const createTransaction = async (payload) => {
  try {
    const response = await apiClient.post('/transactions', payload);

    return response.data;
  } catch (error) {
    throw error;
  }
};
