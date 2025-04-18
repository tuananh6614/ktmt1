import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Key, School, Mail, Phone, User, Camera, LogOut } from "lucide-react";
import { toast } from "sonner";
import StatsSection from "./StatsSection";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutConfirmDialog from "./LogoutConfirmDialog";

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
  const [newName, setNewName] = useState(user.name);
  const [newSchool, setNewSchool] = useState(user.school);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/profile/update', {
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

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/profile/change-password', {
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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập upload
        toast.success("Đã cập nhật ảnh đại diện");
      };

      reader.onerror = () => {
        toast.error("Có lỗi xảy ra khi đọc file");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-r from-dtktmt-blue-medium via-dtktmt-purple-medium to-dtktmt-pink-medium">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 flex items-end space-x-4">
          <div className="relative group">
            <div 
              onClick={handleAvatarClick}
              className="relative w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl || user.image} />
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
          </div>
          
          <div className="flex-1 text-white">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              {user.name}
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                {user.role}
              </span>
            </h1>
            <p className="text-white/80 text-sm">Tham gia từ: {user.joined}</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              {isEditingProfile ? (
                <><X size={16} className="mr-2" /> Hủy</>
              ) : (
                <><Edit2 size={16} className="mr-2" /> Chỉnh sửa</>
              )}
            </Button>
            {isEditingProfile && (
              <Button 
                className="bg-dtktmt-blue-dark hover:bg-dtktmt-blue-dark/90 text-white"
                onClick={handleSaveProfile}
              >
                <Save size={16} className="mr-2" /> Lưu
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4 bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h2>
          
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                value={user.email}
                disabled
                className="pl-10 bg-gray-50 border-gray-200 text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                value={user.phone}
                disabled
                className="pl-10 bg-gray-50 border-gray-200 text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              {isEditingProfile ? (
                <Input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên mới"
                  className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light text-sm"
                />
              ) : (
                <Input 
                  value={user.name}
                  disabled
                  className="pl-10 bg-gray-50 border-gray-200 text-sm"
                />
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <School className="h-4 w-4 text-gray-400" />
              </div>
              {isEditingProfile ? (
                <Input 
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  placeholder="Nhập tên trường"
                  className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light text-sm"
                />
              ) : (
                <Input 
                  value={user.school || 'Chưa cập nhật'}
                  disabled
                  className="pl-10 bg-gray-50 border-gray-200 text-sm"
                />
              )}
            </div>

            {!isEditingPassword ? (
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm hover:bg-dtktmt-blue-light/10"
                onClick={() => setIsEditingPassword(true)}
              >
                <Key size={16} className="mr-2" /> Đổi mật khẩu
              </Button>
            ) : (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-gray-200 focus:border-dtktmt-blue-medium text-sm"
                />
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-gray-200 focus:border-dtktmt-blue-medium text-sm"
                />
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
                    className="flex-1 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark text-sm"
                  >
                    <Save size={16} className="mr-2" /> Lưu mật khẩu
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    className="text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <X size={16} className="mr-2" /> Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <StatsSection stats={user.stats} />
      </div>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default ProfileHeader;
