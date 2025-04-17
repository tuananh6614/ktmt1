
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StatsSection from "./StatsSection";

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
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const handleSaveProfile = async () => {
    try {
      // Gọi API để cập nhật tên
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: newName })
      });

      if (!response.ok) throw new Error('Lỗi cập nhật thông tin');

      toast.success("Đã cập nhật thông tin!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
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

      if (!response.ok) throw new Error('Lỗi đổi mật khẩu');

      toast.success("Đã đổi mật khẩu thành công!");
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error("Không thể đổi mật khẩu. Vui lòng thử lại!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="h-48 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium relative">
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-dtktmt-blue-light flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-4 mb-4">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-white/90">{user.role}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? (
              <><X size={16} className="mr-1" /> Hủy</>
            ) : (
              <><Edit2 size={16} className="mr-1" /> Chỉnh sửa</>
            )}
          </Button>
          {isEditingProfile && (
            <Button 
              className="bg-dtktmt-blue-dark hover:bg-dtktmt-blue-dark/80"
              onClick={handleSaveProfile}
            >
              <Save size={16} className="mr-1" /> Lưu
            </Button>
          )}
        </div>
      </div>
      
      <div className="pt-20 pb-6 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Email</label>
              <Input defaultValue={user.email} disabled className="bg-gray-50" />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Số điện thoại</label>
              <Input defaultValue={user.phone} disabled className="bg-gray-50" />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Họ và tên</label>
              {isEditingProfile ? (
                <Input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên mới"
                />
              ) : (
                <Input value={user.name} disabled className="bg-gray-50" />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Mật khẩu</label>
              {!isEditingPassword ? (
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setIsEditingPassword(true)}
                >
                  <Key size={16} className="mr-2" /> Đổi mật khẩu
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="default"
                      onClick={handleChangePassword}
                      className="flex-1"
                    >
                      <Save size={16} className="mr-1" /> Lưu mật khẩu
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                    >
                      <X size={16} className="mr-1" /> Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Ngày tham gia</label>
              <p>{user.joined}</p>
            </div>
          </div>
          
          <StatsSection stats={user.stats} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
