import axios from 'axios';

import store, { setAuthToken } from 'store';
import router from 'Router';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  timeout: 55000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response
      && (error.response.status === 401)
      && (error.response.data.path === "/auth/validate-token")
    ) {
        const dispatch = store.dispatch;

        dispatch(setAuthToken(null));
        router.navigate('/login');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
