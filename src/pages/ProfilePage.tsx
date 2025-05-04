import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/componentsforpages/NavBar";
import Footer from "@/components/componentsforpages/Footer";
import ChatBox from "@/components/componentsforpages/ChatBox";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsSection from "@/components/profile/StatsSection";
import TestResults from "@/components/profile/TestResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Star, Clock, Award } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/config";
import { Button } from "@/components/ui/button";

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

interface EnrolledCourse {
  id: number;
  course_id: number;
  title: string;
  description: string;
  thumbnail: string;
  progress_percent: number;
  status: string;
  enrolled_date: string;
}

interface TestResult {
  id: number;
  exam_id: number;
  user_id: number;
  attempt_count: number;
  score: number;
  completed_at: string;
  created_at: string;
  title?: string;
  date?: string;
  total?: number;
  passed?: boolean;
  course_title?: string;
  chapter_id?: number | null;
  exam_title?: string;
  course_id?: number;
}

interface PurchasedDocument {
  id: number;
  title: string;
  description: string;
  price: number;
  file_path: string;
  category_name: string;
  purchase_date: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingTestResults, setIsLoadingTestResults] = useState(true);
  const [purchasedDocuments, setPurchasedDocuments] = useState<PurchasedDocument[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

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
        setIsLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_URL}/profile?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
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
          image: userData.avatar_url ? `${API_BASE_URL}${userData.avatar_url}` : "/placeholder.svg",
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
          image: userData.avatar_url ? `${API_BASE_URL}${userData.avatar_url}` : "/placeholder.svg"
        }));

      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Có lỗi xảy ra khi tải thông tin người dùng");
        
        if (error instanceof Error && error.message === 'Failed to fetch profile') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Fetch các khóa học đã đăng ký
  useEffect(() => {
    let isMounted = true;
    let isRequesting = false;
    
    const fetchEnrolledCourses = async () => {
      // Nếu đang gọi API thì không gọi lại
      if (isRequesting) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        isRequesting = true;
        setIsLoadingCourses(true);
        
        console.log('Đang tải danh sách khóa học đã đăng ký');
        
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/api/enrollments?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const courses = await response.json();
        console.log(`Đã nhận được ${courses.length} khóa học đã đăng ký`);
        
        if (isMounted) {
          setEnrolledCourses(courses);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        if (isMounted) {
          toast.error("Có lỗi xảy ra khi tải danh sách khóa học");
        }
      } finally {
        isRequesting = false;
        if (isMounted) {
          setIsLoadingCourses(false);
        }
      }
    };

    if (!isLoading && profileUser) {
      fetchEnrolledCourses();
    }
    
    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [isLoading, profileUser]);

  // Fetch các tài liệu đã mua
  useEffect(() => {
    let isMounted = true;
    let isRequesting = false;
    
    const fetchPurchasedDocuments = async () => {
      // Nếu đang gọi API thì không gọi lại
      if (isRequesting) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        isRequesting = true;
        setIsLoadingDocuments(true);
        
        console.log('Đang tải danh sách tài liệu đã mua');
        
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/api/purchased-documents?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch purchased documents');
        }

        const documents = await response.json();
        console.log(`Đã nhận được ${documents.length} tài liệu đã mua`);
        
        if (isMounted) {
          setPurchasedDocuments(documents);
          
          // Nếu có profileUser và số lượng tài liệu đã thay đổi, cập nhật stats
          if (profileUser && profileUser.stats.documentsPurchased !== documents.length) {
            setProfileUser(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                stats: {
                  ...prev.stats,
                  documentsPurchased: documents.length
                }
              };
            });
          }
        }
      } catch (error) {
        console.error('Error fetching purchased documents:', error);
        if (isMounted) {
          toast.error("Có lỗi xảy ra khi tải danh sách tài liệu đã mua");
        }
      } finally {
        isRequesting = false;
        if (isMounted) {
          setIsLoadingDocuments(false);
        }
      }
    };

    if (!isLoading && profileUser) {
      fetchPurchasedDocuments();
    }
    
    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [isLoading, profileUser]);

  // Fetch kết quả các bài kiểm tra
  useEffect(() => {
    let isMounted = true;
    let isRequesting = false;
    
    const fetchTestResults = async () => {
      const token = localStorage.getItem('token');
      if (!token || isRequesting) return;

      try {
        // Đánh dấu đang request
        isRequesting = true;
        setIsLoadingTestResults(true);
        
        // Lấy tất cả kết quả bài kiểm tra
        const timestamp = new Date().getTime();
        console.log("Bắt đầu gọi API kết quả kiểm tra");
        
        const response = await fetch(`${API_BASE_URL}/api/user-exam-results?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch test results');
        }

        const examResults = await response.json();
        
        // Kiểm tra kết quả nhận được
        console.log(`Đã nhận được ${examResults.length} kết quả kiểm tra`);
        
        // Chỉ tiếp tục xử lý nếu component vẫn được mount
        if (isMounted) {
          // Chuyển đổi sang định dạng TestResult
          const formattedResults = examResults.map((result: any) => ({
            ...result,
            title: result.exam_title,
            date: new Date(result.completed_at || result.created_at).toLocaleDateString('vi-VN'),
            total: 100, // Thường tính theo thang điểm 100
            passed: (result.score || 0) >= 70, // Pass nếu đạt 70% trở lên
          }));

          setTestResults(formattedResults);

          // Tính số liệu thống kê chỉ khi có profileUser
          if (profileUser) {
            calculateStats(formattedResults, examResults);
          }
        }
      } catch (error) {
        console.error('Error fetching test results:', error);
        if (isMounted) {
          toast.error("Có lỗi xảy ra khi tải kết quả kiểm tra");
        }
      } finally {
        isRequesting = false;
        if (isMounted) {
          setIsLoadingTestResults(false);
        }
      }
    };
    
    // Hàm tính toán thống kê từ kết quả
    const calculateStats = (formattedResults: TestResult[], examResults: any[]) => {
      if (!profileUser) return;
      
      if (formattedResults.length > 0) {
        const totalScore = formattedResults.reduce((sum, result) => sum + result.score, 0);
        const avgScore = Math.round(totalScore / formattedResults.length);
        
        // Tính số khóa học đã hoàn thành dựa trên bài kiểm tra cuối khóa
        const completedCourses = new Set();
        const inProgressCourses = new Set();
        
        // Phân loại khóa học đã hoàn thành và đang học
        examResults.forEach((result: any) => {
          if (result.chapter_id === null && result.score >= 70) {
            // Bài kiểm tra cuối khóa và đạt điểm pass
            completedCourses.add(result.course_id);
          } else if (result.chapter_id !== null) {
            // Bài kiểm tra chương
            inProgressCourses.add(result.course_id);
          }
        });
        
        // Loại bỏ các khóa học đã hoàn thành ra khỏi danh sách đang học
        inProgressCourses.forEach(courseId => {
          if (completedCourses.has(courseId)) {
            inProgressCourses.delete(courseId);
          }
        });

        // Chỉ cập nhật khi có sự thay đổi thống kê
        if (profileUser.stats.avgScore !== avgScore || 
            profileUser.stats.coursesCompleted !== completedCourses.size || 
            profileUser.stats.coursesInProgress !== inProgressCourses.size) {
          
          setProfileUser(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              stats: {
                ...prev.stats,
                coursesCompleted: completedCourses.size,
                coursesInProgress: inProgressCourses.size,
                avgScore: avgScore
              }
            };
          });
        }
      }
    };

    if (!isLoading && profileUser) {
      fetchTestResults();
    }
    
    // Cleanup function để tránh memory leak và update state khi component unmount
    return () => {
      isMounted = false;
    };
  }, [isLoading, profileUser]);

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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-dtktmt-blue-light/30 flex items-center justify-center mb-2">
                <BookOpen size={20} className="text-dtktmt-blue-dark" />
              </div>
              <p className="text-2xl font-semibold text-dtktmt-blue-dark">{profileUser.stats.coursesCompleted}</p>
              <p className="text-xs text-gray-500">Khóa học đã hoàn thành</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-dtktmt-pink-light/30 flex items-center justify-center mb-2">
                <Clock size={20} className="text-dtktmt-pink-dark" />
              </div>
              <p className="text-2xl font-semibold text-dtktmt-pink-dark">{profileUser.stats.coursesInProgress}</p>
              <p className="text-xs text-gray-500">Khóa học đang học</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-dtktmt-purple-light/30 flex items-center justify-center mb-2">
                <FileText size={20} className="text-dtktmt-purple-medium" />
              </div>
              <p className="text-2xl font-semibold text-dtktmt-purple-medium">{profileUser.stats.documentsPurchased}</p>
              <p className="text-xs text-gray-500">Tài liệu đã mua</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-dtktmt-yellow/30 flex items-center justify-center mb-2">
                <Award size={20} className="text-dtktmt-blue-dark" />
              </div>
              <p className="text-2xl font-semibold text-dtktmt-blue-dark">{profileUser.stats.avgScore}</p>
              <p className="text-xs text-gray-500">Điểm trung bình</p>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
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
                {isLoadingCourses ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    <p className="text-dtktmt-blue-dark">Đang tải danh sách khóa học...</p>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có khóa học nào</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img 
                          src={course.thumbnail.startsWith('/') ? `${API_BASE_URL}${course.thumbnail}` : course.thumbnail} 
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-dtktmt-blue-medium h-2.5 rounded-full" 
                                style={{ width: `${course.progress_percent || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 ml-2">{course.progress_percent || 0}%</span>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Đăng ký: {new Date(course.enrolled_date).toLocaleDateString('vi-VN')}
                            </span>
                            <Button 
                              onClick={() => navigate(`/khoa-hoc/${course.course_id}`)}
                              className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark text-white"
                            >
                              Tiếp tục học
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents">
                {isLoadingDocuments ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    <p className="text-dtktmt-blue-dark">Đang tải danh sách tài liệu...</p>
                  </div>
                ) : purchasedDocuments.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có tài liệu nào</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa mua tài liệu nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedDocuments.map((document) => (
                      <div key={document.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                          <div className="bg-dtktmt-blue-light/20 p-4 rounded-lg mb-4 flex justify-center">
                            <FileText size={48} className="text-dtktmt-blue-medium" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{document.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span className="bg-dtktmt-blue-light/30 text-dtktmt-blue-dark px-2 py-1 rounded">
                              {document.category_name}
                            </span>
                            <span className="ml-2">
                              Mua ngày: {new Date(document.purchase_date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <Button 
                            onClick={() => window.open(`${API_BASE_URL}/api/documents/download/${document.id}`, '_blank')}
                            className="w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark text-white"
                          >
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tests">
                {isLoadingTestResults ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    <p className="text-dtktmt-blue-dark">Đang tải kết quả kiểm tra...</p>
                  </div>
                ) : testResults.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <Star size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có kết quả kiểm tra</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa thực hiện bài kiểm tra nào</p>
                  </div>
                ) : (
                  <TestResults results={testResults} />
                )}
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