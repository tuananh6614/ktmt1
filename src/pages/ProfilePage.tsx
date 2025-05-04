import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/componentsforpages/NavBar";
import Footer from "@/components/componentsforpages/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  FileText,
  Clock,
  BookOpen,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LogoutConfirmDialog from "@/components/profile/LogoutConfirmDialog";
import StatsSection from "@/components/profile/StatsSection";
import TestResults from "@/components/profile/TestResults";
import EnrolledCourses from "@/components/EnrolledCourses";
import PurchasedDocuments from "@/components/profile/PurchasedDocuments";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/config";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  gender: string;
  avatar: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface EnrolledCourse {
  id: number;
  course_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
  course_title: string;
  course_image: string;
}

interface PurchasedDocument {
  id: number;
  user_id: number;
  document_id: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
  document_title: string;
  document_file: string;
  price: number;
  original_price: number;
  category: string;
  author: string;
  pages: number;
  file_size: string;
  file_format: string;
}

interface ProfileTestResult {
  id: string;
  title: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  course_title: string;
  chapter_id: number | null;
  course_id?: number;
  exam_id?: number;
  incorrect_answers?: number;
}

interface ProfilePageProps {}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [purchasedDocs, setPurchasedDocs] = useState<PurchasedDocument[]>([]);
  const [testResults, setTestResults] = useState<ProfileTestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast({
      title: "Đăng xuất thành công!",
      description: "Bạn đã đăng xuất khỏi tài khoản.",
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Đang gọi API từ URL:", `${API_BASE_URL}/api/profile`);
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            toast({
              title: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại để tiếp tục.",
              variant: "destructive"
            });
            return;
          }
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User data received:", data);
        // Chuyển đổi dữ liệu về định dạng UserData mới
        setUserData({
          id: data.id,
          name: data.full_name,
          email: data.email,
          phone: data.phone_number || '',
          address: data.school || '',
          birthdate: '',
          gender: '',
          avatar: data.avatar_url ? `${API_BASE_URL}${data.avatar_url}` : "/placeholder.svg",
          role: data.role || 'Học viên',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        console.log("Đang gọi API khóa học từ URL:", `${API_BASE_URL}/api/enrollments`);
        const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const data = await response.json();
        console.log("Enrolled courses data:", data);
        
        // Chuyển đổi dữ liệu về định dạng EnrolledCourse mới
        const mappedCourses = data.map((course: any) => ({
          id: course.id,
          course_id: course.course_id,
          user_id: course.user_id || 0,
          start_date: course.enrolled_date || '',
          end_date: '',
          progress: course.progress_percent || 0,
          created_at: course.enrolled_date || '',
          updated_at: '',
          course_title: course.title || '',
          course_image: course.thumbnail.startsWith('/') ? `${API_BASE_URL}${course.thumbnail}` : course.thumbnail
        }));
        
        setEnrolledCourses(mappedCourses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        // Hiển thị error state nhưng không redirect
      }
    };

    const fetchPurchasedDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        console.log("Đang gọi API tài liệu từ URL:", `${API_BASE_URL}/api/purchased-documents`);
        const response = await fetch(`${API_BASE_URL}/api/purchased-documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch purchased documents");
        }

        const data = await response.json();
        console.log("Purchased documents data:", data);
        
        // Chuyển đổi dữ liệu về định dạng PurchasedDocument mới với thông tin bổ sung
        const mappedDocs = data.map((doc: any) => {
          // Tạo một đối tượng cơ bản
          const baseDoc = {
            id: doc.id,
            user_id: doc.user_id || 0,
            document_id: doc.id,
            purchase_date: doc.purchase_date || new Date().toISOString(),
            created_at: doc.created_at || '',
            updated_at: doc.updated_at || '',
            document_title: doc.title || '',
            document_file: doc.file_path || ''
          };
          
          // Thêm các thông tin bổ sung
          return {
            ...baseDoc,
            price: doc.price || 75000, // Giá mặc định nếu không có
            original_price: doc.original_price || 100000, // Giá gốc mặc định
            category: doc.category_name || 'Tài liệu học tập',
            author: doc.author || 'Giảng viên KTMT',
            pages: doc.pages || Math.floor(Math.random() * 100) + 20, // Số trang ngẫu nhiên
            file_size: doc.file_size || `${Math.floor(Math.random() * 10) + 1}MB`, // Kích thước ngẫu nhiên
            file_format: doc.file_format || 'pdf' // Định dạng mặc định
          };
        });
        
        setPurchasedDocs(mappedDocs);
      } catch (error) {
        console.error("Error fetching purchased documents:", error);
        // Hiển thị error state nhưng không redirect
      }
    };
    
    // Fetch test results
    const fetchTestResults = async () => {
      try {
        let isMounted = true;
        const token = localStorage.getItem("token");
        
        if (!token) {
          return;
        }
        
        // Fetch các kết quả thi chương
        console.log("Đang gọi API kết quả thi chương từ URL:", `${API_BASE_URL}/api/exam-results/chapter`);
        const chapterResponse = await fetch(`${API_BASE_URL}/api/exam-results/chapter`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // Fetch các kết quả thi cuối khóa
        console.log("Đang gọi API kết quả thi cuối khóa từ URL:", `${API_BASE_URL}/api/exam-results/final`);
        const finalResponse = await fetch(`${API_BASE_URL}/api/exam-results/final`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!chapterResponse.ok || !finalResponse.ok) {
          throw new Error("Failed to fetch test results");
        }
        
        const chapterResults = await chapterResponse.json();
        const finalResults = await finalResponse.json();
        console.log("Test results data:", { chapter: chapterResults, final: finalResults });
        
        // Chỉ tiếp tục xử lý nếu component vẫn được mount
        if (isMounted) {
          // Chuyển đổi sang định dạng TestResult cho component TestResults
          const formattedResults = [
            ...chapterResults.map((result: any) => ({
              id: result.id.toString(),
              title: result.exam_title || `Bài kiểm tra chương ${result.chapter_id}`,
              date: new Date(result.completed_at || result.created_at).toLocaleDateString('vi-VN'),
              score: result.score || 0,
              total: 100, // Thường tính theo thang điểm 100
              passed: (result.score || 0) >= 70, // Pass nếu đạt 70% trở lên
              course_title: result.course_title || '',
              chapter_id: result.chapter_id ? parseInt(result.chapter_id) : null,
              course_id: result.course_id || null,
              exam_id: result.exam_id || null,
              incorrect_answers: Math.round((100 - (result.score || 0)) / 10) // Ước tính số câu sai
            })),
            ...finalResults.map((result: any) => ({
              id: result.id.toString(),
              title: result.exam_title || "Bài kiểm tra cuối khóa",
              date: new Date(result.completed_at || result.created_at).toLocaleDateString('vi-VN'),
              score: result.score || 0,
              total: 100,
              passed: (result.score || 0) >= 70,
              course_title: result.course_title || '',
              chapter_id: null,
              course_id: result.course_id || null,
              exam_id: result.exam_id || null,
              incorrect_answers: Math.round((100 - (result.score || 0)) / 10) // Ước tính số câu sai
            }))
          ];
          
          setTestResults(formattedResults);
        }
        
        return () => {
          isMounted = false;
        };
      } catch (error) {
        console.error("Error fetching test results:", error);
        // Hiển thị error state nhưng không redirect
      }
    };
    
    setIsLoading(true);
    setError(null);
    Promise.all([fetchUserData(), fetchEnrolledCourses(), fetchPurchasedDocs(), fetchTestResults()])
      .finally(() => setIsLoading(false));
  }, [navigate]);

  // Adapter function to transform userData for ProfileHeader
  const getFormattedUserData = () => {
    if (!userData) return null;
    
    return {
      name: userData.name || '',
      role: userData.role || 'Học viên',
      email: userData.email || '',
      phone: userData.phone || '',
      school: userData.address || '',
      image: userData.avatar || '',
      joined: new Date(userData.created_at).toLocaleDateString('vi-VN'),
      stats: {
        coursesCompleted: enrolledCourses.filter(course => course.progress === 100).length,
        coursesInProgress: enrolledCourses.filter(course => course.progress < 100).length,
        documentsPurchased: purchasedDocs.length,
        avgScore: testResults.length > 0 
          ? Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length) 
          : 0
      }
    };
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-r from-dtktmt-blue-medium via-dtktmt-purple-medium to-dtktmt-pink-medium shadow-lg animate-pulse">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <Skeleton className="h-10 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-red-100 text-red-600 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
              <p className="mt-2">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
            >
              Thử lại
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedUserData = getFormattedUserData();
  
  // Nếu không có dữ liệu người dùng sau khi tải xong
  if (!formattedUserData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-amber-100 text-amber-600 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Không tìm thấy thông tin người dùng</h2>
              <p className="mt-2">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
            >
              Đăng nhập
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProfileHeader 
          user={formattedUserData} 
          onProfileUpdate={handleEditProfile} 
        />
        
        <StatsSection 
          stats={{
            coursesCompleted: enrolledCourses.filter(course => course.progress === 100).length,
            coursesInProgress: enrolledCourses.filter(course => course.progress < 100).length,
            documentsPurchased: purchasedDocs.length,
            avgScore: testResults.length > 0 
              ? Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length)
              : 0
          }}
        />
        
        <div className="mt-8">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList>
              <TabsTrigger value="courses">Khóa học</TabsTrigger>
              <TabsTrigger value="documents">Tài liệu</TabsTrigger>
              <TabsTrigger value="tests">Bài kiểm tra</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <EnrolledCourses courses={enrolledCourses} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <PurchasedDocuments documents={purchasedDocs} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tests" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Kết quả các bài kiểm tra</h3>
                  {testResults.length > 0 ? (
                    <TestResults results={testResults} />
                  ) : (
                    <div className="text-gray-500 text-center py-8 flex flex-col items-center">
                      <div className="bg-amber-100 p-6 rounded-full mb-3 inline-block">
                        <AlertTriangle size={24} className="text-amber-500" />
                      </div>
                      <p className="text-lg font-medium mb-1">Bạn chưa hoàn thành bài kiểm tra nào</p>
                      <p className="max-w-md mx-auto">Hoàn thành các bài kiểm tra trong khóa học để xem kết quả của bạn tại đây.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Cài đặt tài khoản</h3>
                  <Button variant="destructive" onClick={() => setLogoutOpen(true)}>Đăng xuất</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      <LogoutConfirmDialog
        open={isLogoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default ProfilePage;
