import api from './api';
import { toast } from 'sonner';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  school?: string;
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

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 giây

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  // Đăng ký tài khoản mới với cơ chế thử lại
  register: async (userData: RegisterData, retry = 0) => {
    console.log('🔄 authService: Đang gửi yêu cầu đăng ký:', userData.email);
    try {
      const response = await api.post('/users/register', userData);
      console.log('✅ Đăng ký thành công:', response.data);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng ký:', error);
      
      // Nếu là lỗi mạng và chưa thử lại quá số lần cho phép
      if ((error.code === 'ECONNABORTED' || !error.response) && retry < MAX_RETRIES) {
        toast.warning(`Đang thử lại kết nối lần ${retry + 1}...`);
        await sleep(RETRY_DELAY);
        return authService.register(userData, retry + 1);
      }
      
      // Xử lý thông báo lỗi
      let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = `Lỗi: ${error.message}`;
      }
      
      toast.error(errorMsg);
      throw error;
    }
  },

  // Đăng nhập với cơ chế thử lại
  login: async (loginData: LoginData, retry = 0) => {
    console.log('🔄 Đang gửi yêu cầu đăng nhập:', loginData.email);
    try {
      const response = await api.post('/users/login', loginData);
      const { token, user } = response.data;
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Đăng nhập thành công:', user.email);
      toast.success('Đăng nhập thành công!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng nhập:', error);
      
      // Nếu là lỗi mạng và chưa thử lại quá số lần cho phép
      if ((error.code === 'ECONNABORTED' || !error.response) && retry < MAX_RETRIES) {
        toast.warning(`Đang thử lại kết nối lần ${retry + 1}...`);
        await sleep(RETRY_DELAY);
        return authService.login(loginData, retry + 1);
      }
      
      // Xử lý thông báo lỗi
      let errorMsg = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message.includes('timeout')) {
        errorMsg = 'Kết nối đến máy chủ quá thời gian. Vui lòng thử lại sau.';
      }
      
      toast.error(errorMsg);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const response = await api.get('/users/logout');
      
      // Xoá token và thông tin user khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success('Đăng xuất thành công!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Lỗi đăng xuất:', error);
      
      // Vẫn xóa thông tin người dùng khỏi localStorage ngay cả khi API lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.error('Có lỗi xảy ra khi đăng xuất!');
      throw error;
    }
  },

  // Lấy thông tin user đang đăng nhập
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi lấy thông tin user:', error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateUserDetails: async (userData: UpdateUserData) => {
    try {
      const response = await api.put('/users/updatedetails', userData);
      
      // Cập nhật thông tin user trong localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
      }
      
      toast.success('Cập nhật thông tin thành công!');
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi cập nhật thông tin:', error);
      toast.error('Cập nhật thông tin thất bại!');
      throw error;
    }
  },

  // Đổi mật khẩu
  updatePassword: async (passwordData: UpdatePasswordData) => {
    try {
      const response = await api.put('/users/updatepassword', passwordData);
      toast.success('Đổi mật khẩu thành công!');
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi đổi mật khẩu:', error);
      toast.error('Đổi mật khẩu thất bại!');
      throw error;
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Lấy thông tin user từ localStorage
  getStoredUser: (): User | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('❌ Lỗi parse user data từ localStorage:', error);
        localStorage.removeItem('user'); // Xóa dữ liệu không hợp lệ
        return null;
      }
    }
    return null;
  }
};

export default authService;
