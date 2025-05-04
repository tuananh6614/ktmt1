// Configuration for API endpoints
const isProdHostname = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' && 
                     !window.location.port;

// API URL configuration based on environment
export const API_URL = isProdHostname
  ? 'https://api.epulearn.xyz/api'
  : 'http://localhost:3000/api';

export default API_URL; 