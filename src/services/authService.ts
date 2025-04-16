import api from './api';
import { toast } from 'sonner';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  school: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  full_name?: string;
  phone_number?: string;
  school?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  school: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'banned';
}

const authService = {
  // Đăng ký tài khoản mới
  register: async (userData: RegisterData) => {
    console.log('🔄 Đang gửi yêu cầu đăng ký:', userData.email);
    try {
      const response = await api.post('/users/register', userData);
      console.log('✅ Đăng ký thành công:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng ký:', error);
      const errorMsg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(errorMsg);
      throw error;
    }
  },

  // Đăng nhập
  login: async (loginData: LoginData) => {
    console.log('🔄 Đang gửi yêu cầu đăng nhập:', loginData.email);
    try {
      const response = await api.post('/users/login', loginData);
      const { token, user } = response.data;
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Đăng nhập thành công:', user.email);
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng nhập:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    const response = await api.get('/users/logout');
    
    // Xoá token và thông tin user khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response.data;
  },

  // Lấy thông tin user đang đăng nhập
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Cập nhật thông tin user
  updateUserDetails: async (userData: UpdateUserData) => {
    const response = await api.put('/users/updatedetails', userData);
    
    // Cập nhật thông tin user trong localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
    }
    
    return response.data;
  },

  // Đổi mật khẩu
  updatePassword: async (passwordData: UpdatePasswordData) => {
    const response = await api.put('/users/updatepassword', passwordData);
    return response.data;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Lấy thông tin user từ localStorage
  getStoredUser: (): User | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }
};

export default authService;
