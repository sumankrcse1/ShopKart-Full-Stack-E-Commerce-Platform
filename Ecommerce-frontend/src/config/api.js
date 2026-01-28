import axios from 'axios';

export const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt');
    }

    return Promise.reject(error);
  }
);

export default api;