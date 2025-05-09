import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X, LogIn, Home, Book, FileText, Info, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LogoutConfirmDialog from "@/components/profile/LogoutConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/config/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserData {
  id: number;
  email: string;
  full_name: string;
  role?: string;
  image?: string;
}

// Thêm custom hook để theo dõi localStorage
const useLocalStorage = (key: string) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return value;
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const storedUser = useLocalStorage('user');
  const [user, setUser] = useState<UserData | null>(storedUser);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { title: "Trang chủ", path: "/", icon: <Home size={18} /> },
    { title: "Khóa học", path: "/khoa-hoc", icon: <Book size={18} /> },
    { title: "Tài liệu", path: "/tai-lieu", icon: <FileText size={18} /> },
    { title: "Giới thiệu", path: "/gioi-thieu", icon: <Info size={18} /> },
  ];

  // Cập nhật user state khi storedUser thay đổi
  useEffect(() => {
    if (storedUser && typeof storedUser === 'object' && storedUser.id) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, [storedUser]);

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-dtktmt-blue-medium text-white" : "text-dtktmt-blue-dark hover:bg-dtktmt-blue-light";
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    toast.success("Đăng xuất thành công!");
    navigate('/');
    setShowLogoutDialog(false);
  };

  const getFullAvatarUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] rounded-full p-2.5 group-hover:shadow-xl group-hover:shadow-blue-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full group-hover:before:animate-[shimmer_1.5s_ease-in-out_infinite] before:transition-transform after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-br after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:animate-pulse-soft relative z-10"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" className="group-hover:stroke-[#FFE29F]"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" className="group-hover:stroke-[#FFA99F]"></path>
                </svg>
              </div>
              <span className="font-montserrat font-bold text-xl bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] bg-[length:200%_100%] group-hover:bg-[length:200%_100%] group-hover:animate-[gradient-slide_3s_linear_infinite] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#8B5CF6] after:to-[#0EA5E9] after:scale-x-0 after:origin-right after:transition-transform after:duration-500 group-hover:after:scale-x-100 after:hover:origin-left group-hover:drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)]">
                DT&KTMT1
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" className="relative hover:bg-transparent">
              <Bell size={20} className="text-dtktmt-blue-medium" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-dtktmt-pink-medium rounded-full"></span>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-dtktmt-blue-medium transition-all">
                    <AvatarImage src={getFullAvatarUrl(user.image)} />
                    <AvatarFallback className="bg-dtktmt-blue-light text-white">
                      {user.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button 
                  onClick={() => setShowLogoutDialog(true)}
                  className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark flex items-center gap-1">
                  <LogIn size={16} />
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" className="relative hover:bg-transparent">
              <Bell size={20} className="text-dtktmt-blue-medium" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-dtktmt-pink-medium rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg rounded-b-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center justify-between">
                <Link 
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium"
                >
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-dtktmt-blue-medium transition-all">
                    <AvatarImage src={getFullAvatarUrl(user.image)} />
                    <AvatarFallback className="bg-dtktmt-blue-light text-white">
                      {user.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>Trang cá nhân</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutDialog(true);
                  }}
                  className="px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 bg-dtktmt-blue-medium text-white"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 bg-dtktmt-blue-medium text-white"
              >
                <LogIn size={18} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hộp thoại xác nhận đăng xuất */}
      <LogoutConfirmDialog 
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default NavBar;
