import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Book, Clock, CheckCircle, ChevronRight, ChevronDown, Users, Award, PlayCircle, FileText, Lock, Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/config";
import QuestionBank from "@/components/QuestionBank";

// Định nghĩa interface cho dữ liệu
interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: 'text' | 'video' | 'other';
  content: string;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  lesson_order: number;
  created_at: string;
  updated_at: string;
  pages?: Page[];
}

interface Chapter {
  id: number;
  course_id: number;
  title: string;
  chapter_order: number;
  created_at: string;
  updated_at: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
}

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<{
    chapterId: number;
    lessonId: number;
    pageNumber: number;
  } | null>(null);

  // Lấy dữ liệu khóa học bao gồm chương và bài học
  useEffect(() => {
    const fetchCourseStructure = async () => {
      try {
        setLoading(true);
        const apiUrl = `${API_BASE_URL}/api/courses/${courseId}/structure`;
        console.log(`Đang tải cấu trúc khóa học từ: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Không thể tải thông tin khóa học: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Đã nhận dữ liệu khóa học:", data);
        
        // Kiểm tra nếu không có chapters hoặc mảng rỗng
        if (!data.chapters || data.chapters.length === 0) {
          console.warn("Cảnh báo: Khóa học không có chương nào");
        } else {
          // Tải thông tin trang cho mỗi bài học
          for (const chapter of data.chapters) {
            if (chapter.lessons && chapter.lessons.length > 0) {
              for (const lesson of chapter.lessons) {
                try {
                  console.log(`Đang tải trang cho bài học: ${lesson.id}`);
                  const pagesUrl = `${API_BASE_URL}/api/lessons/${lesson.id}/pages`;
                  
                  const pagesResponse = await fetch(pagesUrl, {
                    headers: {
                      'Accept': 'application/json',
                      'Cache-Control': 'no-cache'
                    }
                  });
                  
                  if (!pagesResponse.ok) {
                    console.error(`Lỗi khi tải trang cho bài học ${lesson.id}: ${pagesResponse.status} ${pagesResponse.statusText}`);
                    continue;
                  }
                  
                  const pagesData = await pagesResponse.json();
                  console.log(`Đã nhận dữ liệu trang cho bài học ${lesson.id}:`, pagesData);
                  lesson.pages = pagesData;
                } catch (pageErr) {
                  console.error(`Lỗi khi tải trang cho bài học ${lesson.id}:`, pageErr);
                }
              }
            }
          }
        }
        
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải thông tin khóa học:", err);
        setError(`Không thể tải thông tin khóa học: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
    const checkEnrollment = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsEnrolled(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrollments');
        }

        const enrollments = await response.json();
        setIsEnrolled(enrollments.some(e => e.course_id === parseInt(courseId || '0')));
      } catch (error) {
        console.error('Error checking enrollment:', error);
        setIsEnrolled(false);
      }
    };
    
    fetchCourseStructure();
    checkEnrollment();
  }, [courseId]);

  // Thêm useEffect để lấy tiến độ học tập
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/enrollments/progress?course_id=${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentProgress(data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    if (isEnrolled) {
      fetchProgress();
    }
  }, [courseId, isEnrolled]);

  // Tính tổng số bài học
  const totalLessons = course?.chapters.reduce((total, chapter) => {
    return total + chapter.lessons.length;
  }, 0) || 0;

  // Đăng ký học
  const handleEnroll = async () => {
    setEnrolling(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: courseId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      setIsEnrolled(true);
      toast.success("Đăng ký khóa học thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      toast.error(error.message || "Đăng ký khóa học thất bại. Vui lòng thử lại sau!");
    } finally {
      setEnrolling(false);
    }
  };

  // Sửa lại hàm startLearning
  const startLearning = () => {
    if (!course?.chapters.length) return;

    if (currentProgress) {
      // Nếu có tiến độ học tập, điều hướng đến bài học đang học dở
      navigate(`/khoa-hoc/${courseId}/noi-dung?chapter=${currentProgress.chapterId}&lesson=${currentProgress.lessonId}&page=${currentProgress.pageNumber}`);
    } else {
      // Nếu chưa có tiến độ, bắt đầu từ bài đầu tiên
      const firstChapter = course.chapters[0];
      if (firstChapter.lessons.length > 0) {
        navigate(`/khoa-hoc/${courseId}/noi-dung?chapter=${firstChapter.id}&lesson=${firstChapter.lessons[0].id}&page=1`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        {loading ? (
          <div className="container py-12">
            <CourseSkeleton />
          </div>
        ) : error ? (
          <div className="container py-12">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate(-1)} variant="outline">Quay lại</Button>
          </div>
        ) : course ? (
          <>
            {/* Banner khóa học */}
            <div className="bg-gradient-to-r from-dtktmt-blue-dark to-dtktmt-purple-dark text-white py-16">
              <div className="container">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-2">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-bold mb-4"
                    >
                      {course.title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-white/80 mb-6"
                    >
                      {course.description}
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-4 mb-6"
                    >
                      <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                        <Book className="mr-2 h-4 w-4" />
                        <span>{totalLessons} bài học</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>500+ học viên</span>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {isEnrolled ? (
                        <Button 
                          onClick={startLearning}
                          className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Tiếp tục học
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleEnroll}
                          disabled={enrolling}
                          className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                          {enrolling ? "Đang đăng ký..." : "Đăng ký học ngay"}
                        </Button>
                      )}
                    </motion.div>
                  </div>
                  <div className="md:col-span-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <img 
                        src={course.thumbnail || "/placeholder.svg"} 
                        alt={course.title} 
                        className="w-full h-64 object-cover"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="container py-12">
              <Tabs defaultValue="noi-dung" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="noi-dung">Nội dung khóa học</TabsTrigger>
                  <TabsTrigger value="cau-hoi">Ngân hàng câu hỏi</TabsTrigger>
                </TabsList>
                
                <TabsContent value="noi-dung" className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>

                      {course.chapters && course.chapters.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {course.chapters.map((chapter, index) => (
                            <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                              <AccordionTrigger className="text-left py-4 hover:bg-dtktmt-blue-light/10 px-4 rounded-lg">
                                <div className="flex items-center">
                                  <div className="bg-dtktmt-blue-medium text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{chapter.title}</h3>
                                    <p className="text-sm text-gray-500">{chapter.lessons.length} bài học</p>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-16 pr-4">
                                <ul className="space-y-3 py-2">
                                  {chapter.lessons.map((lesson, lessonIndex) => (
                                    <li key={lesson.id} className="border-b border-gray-100 last:border-0 pb-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                          {isEnrolled ? (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0 rounded-full"
                                              onClick={() => navigate(`/khoa-hoc/${courseId}/noi-dung?chapter=${chapter.id}&lesson=${lesson.id}&page=1`)}
                                            >
                                              <PlayCircle className="h-5 w-5 text-dtktmt-blue-medium" />
                                            </Button>
                                          ) : (
                                            <Lock className="h-4 w-4 text-gray-400 ml-1.5" />
                                          )}
                                          <span className="text-sm font-semibold">{lesson.title}</span>
                                        </div>
                                        
                                      </div>
                                      
                                      {/* Danh sách các trang trong bài học */}
                                      {lesson.pages && lesson.pages.length > 0 && (
                                        <div className="ml-11 mt-2">
                                          <div className="border-l-2 border-gray-200 pl-4 space-y-2">
                                            {lesson.pages.map((page) => (
                                              <div key={page.id} className="flex items-center gap-2 text-xs text-gray-600">
                                                {page.page_type === 'video' ? (
                                                  <PlayCircle className="h-3.5 w-3.5 text-dtktmt-blue-light" />
                                                ) : page.page_type === 'text' ? (
                                                  <FileText className="h-3.5 w-3.5 text-dtktmt-blue-light" />
                                                ) : (
                                                  <FileText className="h-3.5 w-3.5 text-dtktmt-blue-light" />
                                                )}
                                                <span>
                                                  Trang {page.page_number}: {page.content.substring(0, 40)}
                                                  {page.content.length > 40 ? '...' : ''}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <p className="text-gray-500">Khóa học này chưa có nội dung. Vui lòng quay lại sau.</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-1">
                      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Tổng số bài học</span>
                            <span className="font-medium">{totalLessons} bài</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Cấp độ</span>
                            <span className="font-medium">Cơ bản</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Ngôn ngữ</span>
                            <span className="font-medium">Tiếng Việt</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Chứng chỉ</span>
                            <span className="font-medium flex items-center text-dtktmt-blue-medium">
                              <Award className="h-4 w-4 mr-1" />
                              <span>Có</span>
                            </span>
                          </div>
                        </div>
                        
                        {isEnrolled ? (
                          <Button 
                            onClick={startLearning}
                            className="w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Tiếp tục học
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="w-full bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white"
                          >
                            {enrolling ? "Đang đăng ký..." : "Đăng ký học ngay"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cau-hoi">
                  <QuestionBank />
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : null}
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

// Skeleton loading
const CourseSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-14 w-40" />
        </div>
        <div className="md:col-span-1">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-64" />
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-20 w-full" />
          ))}
        </div>
        <div className="md:col-span-1">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage; 