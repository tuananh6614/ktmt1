import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Key, School, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import StatsSection from "./StatsSection";
import { Card } from "@/components/ui/card";

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
  const [newName, setNewName] = useState(user.name);
  const [newSchool, setNewSchool] = useState(user.school);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  return (
    <div className="space-y-8">
      <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-dtktmt-blue-medium via-dtktmt-purple-medium to-dtktmt-pink-medium">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 flex items-end space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-blue-dark flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              {user.name}
              <span className="text-sm px-3 py-1 bg-white/20 rounded-full">
                {user.role}
              </span>
            </h1>
            <p className="text-white/80">Tham gia từ: {user.joined}</p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-lg transition-all duration-300 hover:scale-105"
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
                className="bg-dtktmt-blue-dark hover:bg-dtktmt-blue-dark/90 text-white shadow-lg transition-all duration-300 hover:scale-105"
                onClick={handleSaveProfile}
              >
                <Save size={16} className="mr-2" /> Lưu thay đổi
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6 bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                value={user.email}
                disabled
                className="pl-10 bg-gray-50 border-gray-200"
              />
              <span className="text-xs text-gray-500 mt-1 block">Email không thể thay đổi</span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                value={user.phone}
                disabled
                className="pl-10 bg-gray-50 border-gray-200"
              />
              <span className="text-xs text-gray-500 mt-1 block">Số điện thoại không thể thay đổi</span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              {isEditingProfile ? (
                <Input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên mới"
                  className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light"
                />
              ) : (
                <Input 
                  value={user.name}
                  disabled
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <School className="h-5 w-5 text-gray-400" />
              </div>
              {isEditingProfile ? (
                <Input 
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  placeholder="Nhập tên trường"
                  className="pl-10 border-dtktmt-blue-medium focus:ring-dtktmt-blue-light"
                />
              ) : (
                <Input 
                  value={user.school || 'Chưa cập nhật'}
                  disabled
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              )}
            </div>

            {!isEditingPassword ? (
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-dtktmt-blue-light/10 transition-colors duration-300"
                onClick={() => setIsEditingPassword(true)}
              >
                <Key size={16} className="mr-2" /> Đổi mật khẩu
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-gray-200 focus:border-dtktmt-blue-medium"
                />
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-gray-200 focus:border-dtktmt-blue-medium"
                />
                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="border-gray-200 focus:border-dtktmt-blue-medium"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={handleChangePassword}
                    className="flex-1 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark hover:opacity-90"
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
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
    </div>
  );
};

export default ProfileHeader;
