// Lấy hostname từ URL hiện tại
const currentHostname = window.location.hostname;
const API_PORT = '3000';

export const API_BASE_URL = `http://${currentHostname}:${API_PORT}`; 