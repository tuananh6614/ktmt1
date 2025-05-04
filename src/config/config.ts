
// Lấy hostname từ URL hiện tại
const currentHostname = window.location.hostname;
const API_PORT = '3000';

// Hỗ trợ cả môi trường development và production
export const API_BASE_URL = currentHostname === 'localhost' 
  ? `http://localhost:${API_PORT}`  // Khi chạy cục bộ
  : `http://${currentHostname}:${API_PORT}`; // Khi chạy trên môi trường khác

console.log('API URL đang sử dụng:', API_BASE_URL);
