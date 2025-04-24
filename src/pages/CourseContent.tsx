import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, BookOpen, PlayCircle, FileText, ChevronLeft } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/config";

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: 'text' | 'video';
  content: string;
}

interface Lesson {
  id: number;
  title: string;
  lesson_order: number;
  pages: Page[];
}

interface Chapter {
  id: number;
  title: string;
  chapter_order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
}

const CourseContent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  // Thêm useEffect để xử lý smooth scroll
  useEffect(() => {
    // Thêm CSS scroll-behavior: smooth vào html
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup khi component unmount
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Lấy tham số từ URL
  const searchParams = new URLSearchParams(window.location.search);
  const chapterFromUrl = Number(searchParams.get('chapter'));
  const lessonFromUrl = Number(searchParams.get('lesson'));
  const pageFromUrl = Number(searchParams.get('page'));

  // Lấy cấu trúc khóa học và xử lý tham số từ URL
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem nội dung khóa học");
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/structure`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải nội dung khóa học');
        }

        const data = await response.json();
        
        // Tải pages cho tất cả các bài học
        const courseWithPages = await loadPagesForAllLessons(data, token);
        setCourse(courseWithPages);
        
        // Xử lý tham số từ URL
        if (chapterFromUrl && lessonFromUrl) {
          setSelectedChapter(chapterFromUrl);
          setSelectedLesson(lessonFromUrl);
          
          // Tìm lesson và page tương ứng
          const chapter = courseWithPages.chapters.find(c => c.id === chapterFromUrl);
          const lesson = chapter?.lessons.find(l => l.id === lessonFromUrl);
          
          if (lesson && lesson.pages) {
            if (pageFromUrl) {
              const page = lesson.pages.find(p => p.page_number === pageFromUrl);
              setSelectedPage(page || lesson.pages[0]);
            } else {
              setSelectedPage(lesson.pages[0]);
            }
          }
        } else if (data.chapters && data.chapters.length > 0) {
          // Nếu không có tham số, chọn chương và bài học đầu tiên
          const firstChapter = data.chapters[0];
          setSelectedChapter(firstChapter.id);
          
          if (firstChapter.lessons && firstChapter.lessons.length > 0) {
            const firstLesson = firstChapter.lessons[0];
            setSelectedLesson(firstLesson.id);
            if (firstLesson.pages && firstLesson.pages.length > 0) {
              setSelectedPage(firstLesson.pages[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Có lỗi xảy ra khi tải nội dung khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, navigate, chapterFromUrl, lessonFromUrl, pageFromUrl]);

  // Hàm để tải pages cho tất cả các bài học
  const loadPagesForAllLessons = async (courseData: Course, token: string) => {
    const updatedChapters = await Promise.all(
      courseData.chapters.map(async (chapter) => {
        const updatedLessons = await Promise.all(
          chapter.lessons.map(async (lesson) => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/lessons/${lesson.id}/pages`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              });

              if (!response.ok) {
                throw new Error(`Không thể tải trang cho bài học ${lesson.id}`);
              }

              const pages = await response.json();
              return { ...lesson, pages };
            } catch (error) {
              console.error(`Error loading pages for lesson ${lesson.id}:`, error);
              return { ...lesson, pages: [] };
            }
          })
        );

        return { ...chapter, lessons: updatedLessons };
      })
    );

    return { ...courseData, chapters: updatedChapters };
  };

  // Cập nhật URL và state khi chọn bài học mới
  const handleLessonClick = (chapterId: number, lessonId: number) => {
    const chapter = course?.chapters.find(c => c.id === chapterId);
    const lesson = chapter?.lessons.find(l => l.id === lessonId);
    
    setSelectedChapter(chapterId);
    setSelectedLesson(lessonId);
    
    if (lesson && lesson.pages && lesson.pages.length > 0) {
      setSelectedPage(lesson.pages[0]);
      updateUrl(chapterId, lessonId, lesson.pages[0].page_number);
    }
  };

  // Cập nhật URL khi chọn trang mới
  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
    if (selectedChapter && selectedLesson) {
      updateUrl(selectedChapter, selectedLesson, page.page_number);
    }
  };

  // Hàm lấy danh sách trang của bài học hiện tại
  const getCurrentLessonPages = () => {
    const chapter = course?.chapters.find(c => c.id === selectedChapter);
    const lesson = chapter?.lessons.find(l => l.id === selectedLesson);
    return lesson?.pages || [];
  };

  // Cập nhật URL khi chọn bài học hoặc trang mới
  const updateUrl = (chapterId: number, lessonId: number, pageNumber: number) => {
    const newUrl = `/khoa-hoc/${courseId}/noi-dung?chapter=${chapterId}&lesson=${lessonId}&page=${pageNumber}`;
    navigate(newUrl, { replace: true });
  };

  const renderPageContent = (page: Page) => {
    if (!page) return null;

    if (page.page_type === 'text') {
      return (
        <div 
          className="prose prose-lg max-w-none prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      );
    } else if (page.page_type === 'video') {
      try {
        const videoData = JSON.parse(page.content);
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{videoData.title}</h2>
            <div className="aspect-video">
              <iframe
                src={videoData.videoUrl}
                className="w-full h-full rounded-xl"
                allowFullScreen
                title={videoData.title}
              />
            </div>
          </div>
        );
      } catch (e) {
        return <div className="text-red-500">Lỗi: Không thể hiển thị video</div>;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-dtktmt-blue-medium border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-dtktmt-blue-dark">Đang tải nội dung khóa học...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{error || 'Không tìm thấy khóa học'}</p>
            <Button onClick={() => navigate('/khoa-hoc')}>Quay lại danh sách khóa học</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container py-8">
        {/* Nút quay lại */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại danh sách khóa học
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Danh sách nội dung - Sticky */}
          <div className="md:col-span-1">
            <div 
              className="sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] transition-all duration-200 ease-in-out"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#E2E8F0 #F8FAFC'
              }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 transition-shadow hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6">{course?.title}</h2>
                <Accordion 
                  type="single" 
                  defaultValue={`chapter-${selectedChapter}`}
                  className="w-full"
                >
                  {course?.chapters.map((chapter) => (
                    <AccordionItem 
                      key={chapter.id} 
                      value={`chapter-${chapter.id}`}
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4 transition-colors hover:bg-gray-50 rounded-lg px-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{chapter.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {chapter.lessons.map((lesson) => (
                            <li key={lesson.id}>
                              <Button
                                variant={selectedLesson === lesson.id ? "default" : "ghost"}
                                className="w-full justify-start text-left transition-colors hover:bg-gray-50"
                                onClick={() => handleLessonClick(chapter.id, lesson.id)}
                              >
                                {lesson.title}
                              </Button>
                              {selectedLesson === lesson.id && lesson.pages && lesson.pages.length > 0 && (
                                <ul className="pl-4 mt-2 space-y-1">
                                  {lesson.pages.map((page) => (
                                    <li key={page.id}>
                                      <Button
                                        variant={selectedPage?.id === page.id ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full justify-start text-sm transition-colors hover:bg-gray-50"
                                        onClick={() => handlePageClick(page)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {page.page_type === 'video' ? (
                                            <PlayCircle className="h-4 w-4" />
                                          ) : (
                                            <FileText className="h-4 w-4" />
                                          )}
                                          <span>Trang {page.page_number}</span>
                                        </div>
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Main content - Nội dung bài học */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 transition-shadow hover:shadow-xl">
              {selectedPage ? (
                <div className="space-y-6">
                  {renderPageContent(selectedPage)}
                  
                  {/* Điều hướng trang */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    {getCurrentLessonPages().findIndex(p => p.id === selectedPage.id) > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = getCurrentLessonPages().findIndex(p => p.id === selectedPage.id);
                          const prevPage = getCurrentLessonPages()[currentIndex - 1];
                          if (prevPage) {
                            handlePageClick(prevPage);
                            // Cuộn lên đầu trang khi chuyển trang
                            window.scrollTo({ top: 0 });
                          }
                        }}
                        className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trang trước
                      </Button>
                    )}
                    
                    {getCurrentLessonPages().findIndex(p => p.id === selectedPage.id) < getCurrentLessonPages().length - 1 && (
                      <Button
                        onClick={() => {
                          const currentIndex = getCurrentLessonPages().findIndex(p => p.id === selectedPage.id);
                          const nextPage = getCurrentLessonPages()[currentIndex + 1];
                          if (nextPage) {
                            handlePageClick(nextPage);
                            // Cuộn lên đầu trang khi chuyển trang
                            window.scrollTo({ top: 0 });
                          }
                        }}
                        className="flex items-center gap-2 ml-auto hover:bg-dtktmt-blue-dark transition-colors"
                      >
                        Trang tiếp theo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Vui lòng chọn một bài học để xem nội dung</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseContent; 