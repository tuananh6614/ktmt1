
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Circle, PlayCircle, FileText } from "lucide-react";
import { Course, Chapter, Lesson, Page } from "@/types/course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration
const mockCourse: Course = {
  id: "course-001",
  title: "Nhập môn lập trình Web",
  description: "Khóa học giúp bạn làm quen với lập trình web cơ bản, HTML, CSS và JavaScript.",
  image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
  price: 599000,
  chapters: [
    {
      id: "chapter-001",
      title: "Giới thiệu về HTML",
      description: "Học về cấu trúc cơ bản của HTML và các thẻ quan trọng",
      duration: "2 giờ",
      progress: 50,
      lessons: [
        {
          id: "lesson-001",
          title: "Cấu trúc HTML cơ bản",
          description: "Tìm hiểu về cấu trúc trang HTML và các thẻ cơ bản",
          duration: "30 phút",
          completed: true,
          pages: [
            {
              id: "page-001",
              type: "video",
              content: "https://example.com/video1.mp4",
              duration: "15 phút"
            },
            {
              id: "page-002",
              type: "text",
              content: "<h2>HTML Cơ bản</h2><p>HTML (HyperText Markup Language) là ngôn ngữ đánh dấu tiêu chuẩn để tạo và cấu trúc các trang và ứng dụng web. HTML định nghĩa cấu trúc và nội dung của trang web thông qua một loạt các phần tử và thẻ.</p><h3>Cấu trúc cơ bản</h3><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n    &lt;title&gt;Tiêu đề trang&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n    &lt;h1&gt;Đây là tiêu đề&lt;/h1&gt;\n    &lt;p&gt;Đây là đoạn văn.&lt;/p&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>"
            }
          ]
        },
        {
          id: "lesson-002",
          title: "Các thẻ HTML quan trọng",
          description: "Học về các thẻ HTML phổ biến và cách sử dụng chúng",
          duration: "45 phút",
          completed: false,
          pages: [
            {
              id: "page-003",
              type: "video",
              content: "https://example.com/video2.mp4",
              duration: "20 phút"
            }
          ]
        }
      ],
      testId: "quiz-001"
    }
  ],
  instructor: {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=12",
    title: "Giảng viên Web Development"
  }
};

const ChapterDetail = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with mock data
    const fetchData = async () => {
      try {
        // In a real application, you would fetch from an API
        // const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`);
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setCourse(mockCourse);
          const foundChapter = mockCourse.chapters.find(c => c.id === chapterId);
          if (foundChapter) {
            setChapter(foundChapter);
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, chapterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dtktmt-blue-medium"></div>
      </div>
    );
  }

  if (!course || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy thông tin chương học</h1>
        <Link 
          to={`/khoa-hoc/${courseId}`} 
          className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chi tiết khóa học
        </Link>
      </div>
    );
  }

  const currentLesson = chapter.lessons[currentLessonIndex];
  const currentPage = currentLesson?.pages[currentPageIndex];

  const handleNextPage = () => {
    if (currentPageIndex < currentLesson.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentLessonIndex < chapter.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLesson = chapter.lessons[currentLessonIndex - 1];
      setCurrentPageIndex(prevLesson.pages.length - 1);
    }
  };

  const renderPageContent = (page: Page) => {
    switch (page.type) {
      case "video":
        return (
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <PlayCircle className="mx-auto mb-2 h-16 w-16" />
              <p>Video đang được tải...</p>
              <p className="text-sm text-gray-300">({page.duration})</p>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        );
      case "quiz":
        return (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Câu hỏi nhanh</h3>
            <p className="mb-4">{page.content}</p>
            <Button>Trả lời</Button>
          </div>
        );
      default:
        return <div>Không hỗ trợ định dạng này</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Link 
              to={`/khoa-hoc/${courseId}`} 
              className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại chi tiết khóa học
            </Link>
            
            {chapter.testId && (
              <Link 
                to={`/khoa-hoc/${courseId}/chuong/${chapterId}/kiem-tra`}
                className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
              >
                Làm bài kiểm tra
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson sidebar */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden order-2 lg:order-1">
            <div className="p-4 bg-dtktmt-blue-light">
              <h2 className="font-bold text-lg">{chapter.title}</h2>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={chapter.progress} className="h-2 flex-grow" />
                <span className="text-sm font-medium">{chapter.progress}%</span>
              </div>
            </div>
            <div className="p-2">
              {chapter.lessons.map((lesson, index) => (
                <div key={lesson.id} className="mb-2">
                  <button
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setCurrentPageIndex(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2 ${
                      currentLessonIndex === index ? "bg-blue-50 text-dtktmt-blue-dark" : "hover:bg-gray-100"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-xs text-gray-500">{lesson.duration}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                    <span className="text-sm text-gray-500">{currentLesson.duration}</span>
                  </div>
                  <Separator className="my-4" />
                  
                  {/* Page content */}
                  <div className="my-6">
                    {renderPageContent(currentPage)}
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevPage}
                      disabled={currentLessonIndex === 0 && currentPageIndex === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Trang trước
                    </Button>
                    
                    <Button
                      onClick={handleNextPage}
                      disabled={currentLessonIndex === chapter.lessons.length - 1 && 
                              currentPageIndex === currentLesson.pages.length - 1}
                      className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                    >
                      Trang tiếp
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
