
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { User, LoginData, RegisterData, UpdateUserData, UpdatePasswordData } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  updatePassword: (data: UpdatePasswordData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      if (isAuthenticated && !user) {
        try {
          console.log('🔍 Đang kiểm tra thông tin người dùng từ token...');
          const { data } = await authService.getCurrentUser();
          setUser(data);
          console.log('✅ Đã lấy thông tin người dùng thành công');
        } catch (error) {
          console.error('❌ Token không hợp lệ hoặc hết hạn', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      console.log('🔄 AuthContext: Đang đăng nhập...', data);
      const response = await authService.login(data);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      console.error('❌ AuthContext: Lỗi đăng nhập', error);
      // Toast đã được xử lý trong authService
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      console.log('🔄 AuthContext: Đang gửi yêu cầu đăng ký', data);
      await authService.register(data);
      console.log('✅ AuthContext: Đăng ký thành công');
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      console.error('❌ AuthContext: Lỗi đăng ký', error);
      // Toast đã được xử lý trong authService
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    setIsLoading(true);
    try {
      await authService.updateUserDetails(data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      // Toast đã được xử lý trong authService
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (data: UpdatePasswordData) => {
    setIsLoading(true);
    try {
      await authService.updatePassword(data);
    } catch (error: any) {
      // Toast đã được xử lý trong authService
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
