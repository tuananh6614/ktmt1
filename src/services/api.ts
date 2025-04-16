
import axios from 'axios';
import { toast } from 'sonner';

// Sử dụng baseURL phù hợp với môi trường
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Tắt withCredentials để tránh lỗi CORS
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Tăng timeout lên 30 giây
});

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Gửi request đến:', config.baseURL + config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data) {
      console.log('📦 Request data:', JSON.stringify(config.data));
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
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('🚫 API Response error:', error);
    
    // Hiển thị lỗi chi tiết hơn
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Hiển thị thông báo lỗi từ server nếu có
      const errorMessage = error.response.data?.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      toast.error('Yêu cầu bị quá thời gian. Vui lòng kiểm tra kết nối hoặc thử lại sau.');
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc máy chủ đã khởi động chưa.');
    } else {
      console.error('Error setting up request:', error.message);
      toast.error('Lỗi kết nối: ' + error.message);
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
