import apiClient from 'utils/axios';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
