// Import API_URL từ api.ts
import { API_URL } from './api';

// Lấy hostname từ URL hiện tại
const currentHostname = window.location.hostname;
const isProdEnvironment = currentHostname !== 'localhost' && 
                          currentHostname !== '127.0.0.1' && 
                          !window.location.port;

// Trong môi trường production:
// - Sử dụng protocol HTTPS
// - Sử dụng subdomain api.
// - Không hiển thị port
export const API_BASE_URL = isProdEnvironment
  ? `https://api.${currentHostname.replace('admin.', '')}`
  : `http://${currentHostname}:3000`; 

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