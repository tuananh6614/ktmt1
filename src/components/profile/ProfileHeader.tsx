import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Key, School, Mail, Phone, User, Camera, LogOut, ChevronDown, ChevronUp, MoreHorizontal, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutConfirmDialog from "./LogoutConfirmDialog";
import { API_BASE_URL } from "@/config/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: string;
    email: string;
    phone: string;
    school: string;
    image: string;
    joined: string;
    stats: {
      coursesCompleted: number;
      coursesInProgress: number;
      documentsPurchased: number;
      avgScore: number;
    };
  };
  onProfileUpdate?: (updatedUser: any) => void;
}

const ProfileHeader = ({ user, onProfileUpdate }: ProfileHeaderProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newSchool, setNewSchool] = useState(user.school);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Đánh giá độ mạnh của mật khẩu
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength += 1;
      if (/[A-Z]/.test(newPassword)) strength += 1;
      if (/[0-9]/.test(newPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.epulearn.xyz/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          full_name: newName,
          school: newSchool
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi cập nhật thông tin');
      }

      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          full_name: newName,
          school: newSchool
        }));
      }

      toast.success("Đã cập nhật thông tin!");
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật thông tin. Vui lòng thử lại!");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordStrength < 3) {
      toast.warning("Mật khẩu không đủ mạnh! Hãy sử dụng ít nhất 8 ký tự, chữ hoa, số và ký tự đặc biệt.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.epulearn.xyz/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi đổi mật khẩu');
      }

      toast.success("Đã đổi mật khẩu thành công!");
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : "Không thể đổi mật khẩu. Vui lòng thử lại!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Đăng xuất thành công!");
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const getFullAvatarUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Tạo URL tạm thời cho preview
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
      
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu lỗi, quay lại ảnh cũ
        setAvatarUrl(user.image);
        throw new Error(data.error || 'Lỗi cập nhật ảnh đại diện');
      }

      // Cập nhật avatar URL với URL đầy đủ
      const fullAvatarUrl = `${API_BASE_URL}${data.avatar_url}`;
      setAvatarUrl(fullAvatarUrl);
      
      // Cập nhật localStorage và trigger sự kiện storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const newUserData = {
          ...userData,
          avatar_url: data.avatar_url,
          image: fullAvatarUrl
        };
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        // Trigger storage event để NavBar cập nhật
        window.dispatchEvent(new Event('storage'));
      }

      // Cập nhật props user
      if (onProfileUpdate) {
        onProfileUpdate({
          ...user,
          image: fullAvatarUrl
        });
      }

      toast.success("Đã cập nhật ảnh đại diện!");

      // Xóa URL tạm thời
      URL.revokeObjectURL(tempUrl);
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-r from-dtktmt-blue-medium via-dtktmt-purple-medium to-dtktmt-pink-medium shadow-lg">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 flex items-end space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="relative group" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    onClick={handleAvatarClick}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-white shadow-xl overflow-hidden cursor-pointer"
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage src={getFullAvatarUrl(avatarUrl)} />
                      <AvatarFallback className="bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-blue-dark text-white text-2xl font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="text-white w-6 h-6" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nhấn để thay đổi ảnh đại diện</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-1 text-white">
            <h1 className="text-xl sm:text-2xl font-bold mb-0 sm:mb-1 flex items-center gap-2">
              {user.name}
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full backdrop-blur-sm">
                {user.role}
              </span>
            </h1>
            <p className="text-white/80 text-xs sm:text-sm flex items-center gap-1">
              <CalendarDays size={12} /> Tham gia từ: {user.joined}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  <Edit2 size={14} className="mr-2" />
                  Chỉnh sửa thông tin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditingPassword(true)}>
                  <Key size={14} className="mr-2" />
                  Đổi mật khẩu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowLogoutDialog(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut size={14} className="mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chi tiết thông tin cá nhân - chỉ hiển thị khi nhấn vào nút mở rộng */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <Card className="p-4 space-y-4 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
                {isEditingProfile ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nhập tên mới"
                        className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light text-sm"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        value={newSchool}
                        onChange={(e) => setNewSchool(e.target.value)}
                        placeholder="Nhập tên trường"
                        className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="bg-dtktmt-blue-dark hover:bg-dtktmt-blue-dark/90 text-white"
                        onClick={handleSaveProfile}
                        size="sm"
                      >
                        <Save size={14} className="mr-2" /> Lưu
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        size="sm"
                      >
                        <X size={14} className="mr-2" /> Hủy
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Email</span>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Số điện thoại</span>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm">{user.phone || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Trường/Cơ quan</span>
                      <div className="flex items-center">
                        <School className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm">{user.school || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Phần đổi mật khẩu */}
                <AnimatePresence>
                  {isEditingPassword && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4"
                    >
                      <Input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border-gray-200 focus:border-dtktmt-blue-medium text-sm"
                      />
                      <div className="space-y-1">
                        <Input
                          type="password"
                          placeholder="Mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border-gray-200 focus:border-dtktmt-blue-medium text-sm"
                        />
                        {newPassword && (
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full ${
                                passwordStrength === 0 ? 'bg-red-500 w-1/4' :
                                passwordStrength === 1 ? 'bg-orange-500 w-2/4' :
                                passwordStrength === 2 ? 'bg-yellow-500 w-3/4' :
                                'bg-green-500 w-full'
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                      <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="border-gray-200 focus:border-dtktmt-blue-medium text-sm"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="default"
                          onClick={handleChangePassword}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark text-sm"
                        >
                          <Save size={14} className="mr-2" /> Lưu mật khẩu
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                          }}
                          size="sm"
                          className="text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <X size={14} className="mr-2" /> Hủy
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default ProfileHeader;
