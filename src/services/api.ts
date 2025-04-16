
import axios from 'axios';
import { toast } from 'sonner';

// Sử dụng đường dẫn tương đối thay vì localhost
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('🚫 Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý các lỗi response
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('🚫 API Response error:', error);
    
    // Hiển thị lỗi chi tiết hơn
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Hiển thị thông báo lỗi từ server nếu có
      const errorMessage = error.response.data?.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
      toast.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } else {
      console.error('Error setting up request:', error.message);
      toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
    }
    
    // Xử lý lỗi 401 - Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chuyển hướng đến trang đăng nhập nếu không phải đang ở đó
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
