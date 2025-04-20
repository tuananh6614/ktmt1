import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Star } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/config";

const API_URL = `${API_BASE_URL}/api`;

interface UserData {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  school?: string;
  role?: string;
  status?: string;
  created_at?: string;
  avatar_url?: string;
}

interface ProfileUser {
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
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);

  const handleProfileUpdate = (updatedUser: any) => {
    if (profileUser) {
      setProfileUser({
        ...profileUser,
        name: updatedUser.full_name,
        school: updatedUser.school || '',
      });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Vui lòng đăng nhập để xem trang này");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData: UserData = await response.json();
        
        setProfileUser({
          name: userData.full_name,
          role: userData.role || 'Học sinh/ sinh viên',
          email: userData.email,
          phone: userData.phone_number || '',
          school: userData.school || '',
          image: userData.avatar_url ? `http://localhost:3000${userData.avatar_url}` : "/placeholder.svg",
          joined: new Date(userData.created_at || Date.now()).toLocaleDateString('vi-VN'),
          stats: {
            coursesCompleted: 0,
            coursesInProgress: 0,
            documentsPurchased: 0,
            avgScore: 0,
          }
        });

        localStorage.setItem('user', JSON.stringify({
          ...userData,
          image: userData.avatar_url ? `http://localhost:3000${userData.avatar_url}` : "/placeholder.svg"
        }));

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Có lỗi xảy ra khi tải thông tin người dùng");
        
        if (error instanceof Error && error.message === 'Failed to fetch profile') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-dtktmt-blue-dark">Đang tải thông tin...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-dtktmt-blue-dark text-xl">Không tìm thấy thông tin người dùng</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-4 px-4 py-2 bg-dtktmt-blue-medium text-white rounded-lg"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader 
            user={profileUser} 
            onProfileUpdate={handleProfileUpdate}
          />

          <div className="mt-12">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="courses" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>Khóa học của tôi</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Tài liệu của tôi</span>
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <Star size={16} />
                  <span>Kết quả kiểm tra</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses">
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có khóa học nào</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có tài liệu nào</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa mua tài liệu nào</p>
                </div>
              </TabsContent>
              
              <TabsContent value="tests">
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <Star size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có kết quả kiểm tra</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa thực hiện bài kiểm tra nào</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default ProfilePage;
