import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import DocumentCard from "@/components/DocumentCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TestResults from "@/components/profile/TestResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Star } from "lucide-react";
import { toast } from "sonner";

const API_URL = 'http://localhost:3000/api';

interface UserData {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  school?: string;
  role?: string;
  status?: string;
  created_at?: string;
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
  
  const myCourses = [
    {
      id: "1",
      title: "Vi điều khiển STM32",
      description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao",
      image: "/placeholder.svg",
      lessons: 24,
      duration: "12 tuần",
      level: "Trung cấp",
      progress: 75,
    },
    {
      id: "2",
      title: "Điện tử số",
      description: "Tổng quan về kỹ thuật điện tử số và thiết kế mạch",
      image: "/placeholder.svg",
      lessons: 18,
      duration: "8 tuần",
      level: "Cơ bản",
      progress: 100,
    },
    {
      id: "3",
      title: "Xử lý tín hiệu số",
      description: "Các phương pháp xử lý tín hiệu số trong thực tế",
      image: "/placeholder.svg",
      lessons: 30,
      duration: "16 tuần",
      level: "Nâng cao",
      progress: 35,
    },
  ];
  
  const myDocuments = [
    {
      id: "1",
      title: "Cấu trúc máy tính",
      description: "Tài liệu về kiến trúc và tổ chức máy tính",
      image: "/placeholder.svg",
      price: 150000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
    {
      id: "2",
      title: "Tài liệu thực hành VHDL",
      description: "Bộ bài tập và giải pháp cho VHDL",
      image: "/placeholder.svg",
      price: 180000,
      fileType: "docx",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
    {
      id: "3",
      title: "Vi điều khiển ARM Cortex-M4",
      description: "Tài liệu tham khảo cho lập trình ARM Cortex-M4",
      image: "/placeholder.svg",
      price: 200000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
  ];

  const testResults = [
    {
      id: "1",
      title: "Kiểm tra Vi điều khiển STM32",
      date: "20/05/2023",
      score: 95,
      total: 100,
    },
    {
      id: "2",
      title: "Kiểm tra Điện tử số - Chương 1",
      date: "15/02/2023",
      score: 88,
      total: 100,
    },
    {
      id: "3",
      title: "Kiểm tra Điện tử số - Chương 2",
      date: "02/03/2023",
      score: 75,
      total: 100,
    },
  ];

  const handleProfileUpdate = (updatedUser: any) => {
    if (profileUser) {
      setProfileUser({
        ...profileUser,
        name: updatedUser.full_name,
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
          image: "/placeholder.svg",
          joined: new Date(userData.created_at || Date.now()).toLocaleDateString('vi-VN'),
          stats: {
            coursesCompleted: 0,
            coursesInProgress: 0,
            documentsPurchased: 0,
            avgScore: 0,
          }
        });

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
              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có khóa học nào</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
                  <button 
                    onClick={() => navigate('/khoa-hoc')} 
                    className="px-4 py-2 bg-dtktmt-blue-medium text-white rounded-lg"
                  >
                    Khám phá khóa học
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="documents">
              {myDocuments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myDocuments.map((document) => (
                    <DocumentCard key={document.id} {...document} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có tài liệu nào</h3>
                  <p className="text-gray-500 mb-4">Bạn chưa mua tài liệu nào</p>
                  <button 
                    onClick={() => navigate('/tai-lieu')} 
                    className="px-4 py-2 bg-dtktmt-blue-medium text-white rounded-lg"
                  >
                    Khám phá tài liệu
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tests">
              <TestResults results={testResults} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default ProfilePage;
