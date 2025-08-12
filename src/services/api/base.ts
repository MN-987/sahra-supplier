import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from 'src/config-global';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3001',
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
        // TODO: Add refresh token logic here when API supports separate tokens
        // Currently API returns single 'token' field, but later will have:
        // 1. Try to refresh using stored refreshToken
        // 2. If refresh fails, then clear tokens and redirect to login
        // const refreshToken = localStorage.getItem('refreshToken');
        // if (refreshToken) {
        //   try {
        //     const response = await authApi.refreshToken(refreshToken);
        //     localStorage.setItem('accessToken', response.data.access_token);
        //     localStorage.setItem('refreshToken', response.data.refresh_token);
        //     // Retry the original request with new token
        //     return apiClient.request(error.config);
        //   } catch (refreshError) {
        //     localStorage.removeItem('accessToken');
        //     localStorage.removeItem('refreshToken');
        //     // Let auth guards handle redirect
        //   }
        // }
        
        // Don't use window.location.href in SPA - let the auth guards handle the redirect
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
