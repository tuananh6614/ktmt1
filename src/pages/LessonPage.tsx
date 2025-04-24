import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X, Home, BookOpen } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/config";

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
  pages: Page[];
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

const LessonPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Lấy cấu trúc khóa học
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem bài học");
          navigate('/login');
          return;
        }

        // Lấy thông tin bài học
        const lessonResponse = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!lessonResponse.ok) {
          if (lessonResponse.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn");
            navigate('/login');
            return;
          }
          if (lessonResponse.status === 404) {
            toast.error("Không tìm thấy bài học");
            navigate(`/khoa-hoc/${courseId}`);
            return;
          }
          throw new Error('Không thể tải nội dung bài học');
        }

        const lessonData = await lessonResponse.json();
        if (!lessonData.pages || lessonData.pages.length === 0) {
          toast.error("Bài học này chưa có nội dung");
          navigate(`/khoa-hoc/${courseId}`);
          return;
        }

        setPages(lessonData.pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast.error("Có lỗi xảy ra khi tải bài học");
        navigate(`/khoa-hoc/${courseId}`);
      }
    };

    fetchLesson();
  }, [courseId, lessonId, navigate]);
  
  // Cập nhật tiến độ khi chuyển trang
  useEffect(() => {
    if (pages.length > 0) {
      setProgress(((currentPageIndex + 1) / pages.length) * 100);
    }
  }, [currentPageIndex, pages.length]);
  
  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setCurrentPage(pages[currentPageIndex + 1]);
      // Thêm animation scroll lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Đã đến trang cuối của bài học hiện tại, chuyển sang bài học tiếp theo
      const nextLesson = getNextLesson();
      if (nextLesson) {
        navigate(`/hoc-tap/${courseId}/bai-hoc/${nextLesson.id}`);
      } else {
        toast.success("Bạn đã hoàn thành khóa học!");
        // Cập nhật tiến độ hoàn thành khóa học
      }
    }
  };
  
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setCurrentPage(pages[currentPageIndex - 1]);
      // Thêm animation scroll lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Đã ở trang đầu tiên của bài học hiện tại, quay lại bài học trước đó
      const prevLesson = getPrevLesson();
      if (prevLesson) {
        navigate(`/hoc-tap/${courseId}/bai-hoc/${prevLesson.id}`);
      }
    }
  };
  
  // Lấy bài học tiếp theo trong chương trình học
  const getNextLesson = (): Lesson | null => {
    if (!course || !currentLesson) return null;
    
    let foundCurrentLesson = false;
    
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (foundCurrentLesson) {
          return lesson;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrentLesson = true;
        }
      }
    }
    
    return null;
  };
  
  // Lấy bài học trước đó trong chương trình học
  const getPrevLesson = (): Lesson | null => {
    if (!course || !currentLesson) return null;
    
    let prevLesson: Lesson | null = null;
    
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === currentLesson.id) {
          return prevLesson;
        }
        prevLesson = lesson;
      }
    }
    
    return null;
  };
  
  // Render nội dung trang học tập dựa vào page_type
  const renderPageContent = () => {
    if (!currentPage) return null;
    
    switch (currentPage.page_type) {
      case 'text':
        return (
          <div 
            className="prose prose-lg max-w-none prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: currentPage.content }}
          />
        );
      case 'video':
        try {
          const videoData = JSON.parse(currentPage.content);
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{videoData.title}</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={videoData.videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  title={videoData.title}
                ></iframe>
              </div>
            </div>
          );
        } catch (e) {
          return <div className="text-red-500">Lỗi khi hiển thị video. Nội dung không đúng định dạng.</div>;
        }
      default:
        return <div>Loại nội dung không được hỗ trợ.</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-dtktmt-blue-dark">Đang tải bài học...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentLesson || !currentLesson.pages.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Không tìm thấy nội dung bài học</p>
            <Button onClick={() => navigate(`/khoa-hoc/${courseId}`)}>
              Quay lại khóa học
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPageData = currentLesson.pages[currentPageIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out pt-16 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:z-0`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dtktmt-blue-dark">Mục lục</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setShowSidebar(false)}
              >
                <X />
              </Button>
            </div>
            
            {course ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate(`/khoa-hoc/${courseId}`)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Tổng quan khóa học</span>
                </Button>
                
                <Separator />
                
                <div className="space-y-4">
                  {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-500 px-2">{chapter.title}</h3>
                      <ul className="space-y-1">
                        {chapter.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            <Button
                              variant={currentLesson?.id === lesson.id ? "default" : "ghost"}
                              className={`w-full justify-start text-sm h-auto py-2 ${
                                currentLesson?.id === lesson.id
                                  ? "bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                                  : ""
                              }`}
                              onClick={() => navigate(`/hoc-tap/${courseId}/bai-hoc/${lesson.id}`)}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              <span className="text-left">{lesson.title}</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-72">
          {/* Mobile toggle */}
          <div className="md:hidden fixed bottom-4 left-4 z-40">
            <Button 
              onClick={() => setShowSidebar(!showSidebar)} 
              className="rounded-full h-12 w-12 shadow-lg bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
            >
              <Menu />
            </Button>
          </div>
          
          {/* Content */}
          <div className="container py-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dtktmt-blue-dark">
                  {currentLesson?.title}
                </h1>
                <div className="text-sm text-gray-500">
                  Trang {currentPageIndex + 1}/{pages.length}
                </div>
              </div>
              
              <Progress value={progress} className="mb-8" />
              
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                {renderPageContent()}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0 && !getPrevLesson()}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trang trước
                </Button>
                
                <Button
                  onClick={handleNextPage}
                  className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark flex items-center gap-2"
                >
                  Trang tiếp theo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LessonPage; 