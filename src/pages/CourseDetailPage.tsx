
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { ChapterList } from "@/components/course/ChapterList";
import { LessonContent } from "@/components/course/LessonContent";
import { CourseHeader } from "@/components/course/CourseHeader";
import { Separator } from "@/components/ui/separator";
import { CourseProgress } from "@/components/course/CourseProgress";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Dữ liệu mẫu để hiển thị - trong thực tế sẽ lấy từ API dựa vào courseId
  const courseData = {
    id: courseId || "1",
    title: "Vi điều khiển STM32",
    description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao với nhiều bài tập thực hành.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    totalLessons: 24,
    completedLessons: 6,
    duration: "20 giờ",
    instructor: "TS. Nguyễn Văn A",
    rating: 4.9,
    ratingCount: 125,
    chapters: [
      {
        id: "c1",
        title: "Giới thiệu về vi điều khiển STM32",
        description: "Tìm hiểu cơ bản về kiến trúc và tính năng của STM32",
        progress: 100,
        lessons: [
          {
            id: "l1c1",
            title: "Tổng quan về dòng STM32",
            duration: "15 phút",
            completed: true,
          },
          {
            id: "l2c1",
            title: "Kiến trúc ARM Cortex-M",
            duration: "25 phút",
            completed: true,
          },
          {
            id: "l3c1",
            title: "Các công cụ phát triển cho STM32",
            duration: "20 phút",
            completed: true,
          }
        ],
        quiz: {
          id: "q1",
          title: "Kiểm tra kiến thức Chương 1",
          questionCount: 10,
          timeLimit: 15, // phút
          completed: true,
          score: 9,
        }
      },
      {
        id: "c2",
        title: "Lập trình GPIO với STM32",
        description: "Học cách điều khiển các chân input/output trên STM32",
        progress: 50,
        lessons: [
          {
            id: "l1c2",
            title: "Cấu trúc và đặc điểm của GPIO",
            duration: "20 phút",
            completed: true,
          },
          {
            id: "l2c2",
            title: "Cấu hình GPIO làm ngõ ra",
            duration: "25 phút",
            completed: true,
          },
          {
            id: "l3c2",
            title: "Đọc tín hiệu đầu vào từ GPIO",
            duration: "30 phút",
            completed: false,
          }
        ],
        quiz: {
          id: "q2",
          title: "Kiểm tra kiến thức Chương 2",
          questionCount: 8,
          timeLimit: 10, // phút
          completed: false,
        }
      },
      {
        id: "c3",
        title: "Ngắt (Interrupt) trong STM32",
        description: "Tìm hiểu và ứng dụng cơ chế ngắt để xử lý sự kiện",
        progress: 0,
        lessons: [
          {
            id: "l1c3",
            title: "Nguyên lý hoạt động của ngắt",
            duration: "15 phút",
            completed: false,
          },
          {
            id: "l2c3",
            title: "Cấu hình và sử dụng ngắt ngoài",
            duration: "30 phút",
            completed: false,
          },
          {
            id: "l3c3",
            title: "Quản lý ưu tiên ngắt",
            duration: "25 phút",
            completed: false,
          }
        ],
        quiz: {
          id: "q3",
          title: "Kiểm tra kiến thức Chương 3",
          questionCount: 10,
          timeLimit: 15, // phút
          completed: false,
        }
      }
    ],
    finalQuiz: {
      id: "fq1",
      title: "Kiểm tra tổng kết khóa học",
      questionCount: 30,
      timeLimit: 45, // phút
      completed: false,
    }
  };

  // Tìm bài học đầu tiên của chương được chọn nếu chưa chọn bài học
  const handleChapterClick = (chapterId: string) => {
    setActiveChapterId(chapterId);
    if (chapterId !== activeChapterId) {
      const chapter = courseData.chapters.find(c => c.id === chapterId);
      if (chapter && chapter.lessons.length > 0) {
        setActiveLessonId(chapter.lessons[0].id);
      }
    }
    setShowQuiz(false);
  };

  // Hiển thị nội dung bài học khi chọn
  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setShowQuiz(false);
  };

  // Hiển thị bài kiểm tra của chương
  const handleShowChapterQuiz = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setActiveLessonId(null);
    setShowQuiz(true);
  };

  // Hiển thị bài kiểm tra cuối khóa
  const handleShowFinalQuiz = () => {
    setActiveChapterId(null);
    setActiveLessonId(null);
    setShowQuiz(true);
  };

  // Tính tỷ lệ hoàn thành khóa học
  const overallProgress = Math.round(
    (courseData.completedLessons / courseData.totalLessons) * 100
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CourseHeader
              title={courseData.title}
              description={courseData.description}
              image={courseData.image}
              instructor={courseData.instructor}
              rating={courseData.rating}
              ratingCount={courseData.ratingCount}
              duration={courseData.duration}
            />

            <div className="mt-6">
              <CourseProgress
                progress={overallProgress}
                completedLessons={courseData.completedLessons}
                totalLessons={courseData.totalLessons}
              />
            </div>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <ChapterList
                    chapters={courseData.chapters}
                    activeChapterId={activeChapterId}
                    activeLessonId={activeLessonId}
                    onChapterClick={handleChapterClick}
                    onLessonClick={handleLessonClick}
                    onShowQuiz={handleShowChapterQuiz}
                  />
                  
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={handleShowFinalQuiz}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Bài kiểm tra tổng kết
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white rounded-2xl shadow-lg p-6 min-h-[600px]"
                >
                  <LessonContent
                    courseData={courseData}
                    activeChapterId={activeChapterId}
                    activeLessonId={activeLessonId}
                    showQuiz={showQuiz}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default CourseDetailPage;
