// Import API_URL từ api.ts
import { API_URL } from './api';

// Kiểm tra nếu đang chạy trên môi trường di động
const isMobileApp = window.location.protocol === 'capacitor:' || 
                   window.location.protocol === 'file:' ||
                   /android|ios/.test(navigator.userAgent.toLowerCase());

// Lấy hostname từ URL hiện tại
const currentHostname = window.location.hostname;
const isProdEnvironment = currentHostname !== 'localhost' && 
                          currentHostname !== '127.0.0.1' && 
                          !window.location.port;

// Trong môi trường production hoặc trên thiết bị di động - luôn sử dụng API production
export const API_BASE_URL = `https://api.epulearn.xyz`;

// Loại bỏ tiền tố /api để sử dụng cho URL tài nguyên
export const getFullResourceUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

// Hàm tiện ích để tạo URL API đầy đủ
export const getFullApiUrl = (endpoint: string) => {
  // Đảm bảo endpoint không bắt đầu bằng /api để tránh lặp lại
  const cleanEndpoint = endpoint.startsWith('/api/') 
    ? endpoint.substring(4) 
    : endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`;
      
  return `${API_URL}${cleanEndpoint}`;
}; 