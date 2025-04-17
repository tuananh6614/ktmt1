
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, LogOut, X } from "lucide-react";
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
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success("Đăng xuất thành công!");
    navigate('/login');
  };
  
  const handleSaveProfile = () => {
    // Tại đây sau này có thể thêm logic để cập nhật thông tin người dùng lên server
    toast.success("Đã lưu thông tin!");
    setIsEditingProfile(false);
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
              <><Edit size={16} className="mr-1" /> Chỉnh sửa</>
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
          <Button 
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-1" /> Đăng xuất
          </Button>
        </div>
      </div>
      
      <div className="pt-20 pb-6 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Email</label>
              {isEditingProfile ? (
                <Input defaultValue={user.email} />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Số điện thoại</label>
              {isEditingProfile ? (
                <Input defaultValue={user.phone} />
              ) : (
                <p>{user.phone || "Chưa cập nhật"}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Trường/Cơ quan</label>
              {isEditingProfile ? (
                <Input defaultValue={user.school} />
              ) : (
                <p>{user.school || "Chưa cập nhật"}</p>
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
