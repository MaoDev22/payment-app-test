import apiClient from 'utils/axios';

export const validateToken = async () => {
  try {
    const response = await apiClient.post('/auth/validate-token');
    return response.data;
  } catch (error) {
    throw error;
  }
};
