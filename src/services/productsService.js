import apiClient from 'utils/axios';

export const filterProducts = async (searchText) => {
  try {
    const response = await apiClient.post('/products/filter-products', { searchText });

    return response.data;
  } catch (error) {
    throw error;
  }
};
