
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, LogOut, X } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: string;
    email: string;
    phone: string;
    school: string;
    image: string;
    joined: string;
  };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="h-48 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium relative">
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
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
              onClick={() => setIsEditingProfile(false)}
            >
              <Save size={16} className="mr-1" /> Lưu
            </Button>
          )}
          <Button variant="destructive">
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
                <p>{user.phone}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-500 block mb-1">Trường/Cơ quan</label>
              {isEditingProfile ? (
                <Input defaultValue={user.school} />
              ) : (
                <p>{user.school}</p>
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
