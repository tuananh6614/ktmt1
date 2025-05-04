
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
} from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LogoutConfirmDialog from "@/components/profile/LogoutConfirmDialog";
import StatsSection from "@/components/profile/StatsSection";
import TestResults from "@/components/profile/TestResults";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

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
}

// Đổi tên TestResult thành ProfileTestResult để không xung đột với TestResult từ TestResults.tsx
interface ProfileTestResult {
  id: string;
  title: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  course_title: string;
  chapter_id: number | null;
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

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/enrolled-courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch enrolled courses");
          return;
        }

        const data = await response.json();
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    const fetchPurchasedDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/purchased-documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch purchased documents");
          return;
        }

        const data = await response.json();
        setPurchasedDocs(data);
      } catch (error) {
        console.error("Error fetching purchased documents:", error);
      }
    };
    
    // Fetch test results
    const fetchTestResults = async () => {
      try {
        let isMounted = true;
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        
        // Fetch các kết quả thi chương
        const chapterResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/results/chapter`, {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch các kết quả thi cuối khóa
        const finalResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/results/final`, {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!chapterResponse.ok || !finalResponse.ok) {
          console.error("Failed to fetch test results");
          return;
        }
        
        const chapterResults = await chapterResponse.json();
        const finalResults = await finalResponse.json();
        
        // Chỉ tiếp tục xử lý nếu component vẫn được mount
        if (isMounted) {
          // Chuyển đổi sang định dạng TestResult cho component TestResults
          const formattedResults = [
            ...chapterResults.map((result: any) => ({
              id: result.id.toString(),
              title: result.title || `Bài kiểm tra chương ${result.chapter_id}`,
              date: new Date(result.created_at).toLocaleDateString('vi-VN'),
              score: result.score || 0,
              total: 100, // Thường tính theo thang điểm 100
              passed: (result.score || 0) >= 70, // Pass nếu đạt 70% trở lên
              course_title: result.course_title,
              chapter_id: result.chapter_id ? result.chapter_id : null
            })),
            ...finalResults.map((result: any) => ({
              id: result.id.toString(),
              title: result.title || "Bài kiểm tra cuối khóa",
              date: new Date(result.created_at).toLocaleDateString('vi-VN'),
              score: result.score || 0,
              total: 100,
              passed: (result.score || 0) >= 70,
              course_title: result.course_title,
              chapter_id: null
            }))
          ];
          
          setTestResults(formattedResults);
        }
        
        return () => {
          isMounted = false;
        };
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };
    
    setIsLoading(true);
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
      school: '', // không có trong UserData
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProfileHeader 
          user={getFormattedUserData()} 
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
                  <h3 className="text-xl font-semibold mb-4">Khóa học đã đăng ký</h3>
                  {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                          <img src={course.course_image} alt={course.course_title} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900">{course.course_title}</h4>
                            <p className="text-gray-600">Tiến độ: {course.progress}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Bạn chưa đăng ký khóa học nào.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Tài liệu đã mua</h3>
                  {purchasedDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {purchasedDocs.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900">{doc.document_title}</h4>
                            <p className="text-gray-600">Ngày mua: {new Date(doc.purchase_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Bạn chưa mua tài liệu nào.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tests" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Kết quả bài kiểm tra</h3>
                  {testResults.length > 0 ? (
                    <TestResults results={testResults} />
                  ) : (
                    <p className="text-gray-500 text-center py-8">Bạn chưa hoàn thành bài kiểm tra nào.</p>
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
