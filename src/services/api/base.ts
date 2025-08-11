import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HOST_API } from 'src/config-global';

// Create axios instance
export const apiClient = axios.create({
  baseURL: HOST_API || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Handle validation errors
      if (status === 422 && data.errors) {
        const errorMessage = Object.values(data.errors).flat().join(', ');
        return Promise.reject(new Error(errorMessage));
      }

      // Handle other server errors
      const message = data?.message || `Server error: ${status}`;
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      // Network error
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Other errors
    return Promise.reject(new Error(error.message || 'Something went wrong'));
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => apiClient.get(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config),
};

export default api;
