
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/transitions.css';

// Xác định loại ứng dụng đang chạy (admin hoặc user)
const appType = process.env.VITE_APP_TYPE || 'user';

// Thêm class để phân biệt giữa admin và user
if (appType === 'admin') {
  document.body.classList.add('admin-app');
} else {
  document.body.classList.add('user-app');
}

console.log(`Starting application in ${appType} mode on port ${appType === 'admin' ? '8081' : '8080'}`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
