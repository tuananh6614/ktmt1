
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import QuizComponent from "@/components/quiz/QuizComponent";
import { Quiz, Course, Chapter } from "@/types/course";

// Mock quiz data
const mockQuiz: Quiz = {
  id: "quiz-001",
  title: "Kiểm tra kiến thức HTML cơ bản",
  questions: [
    {
      id: "q1",
      text: "Thẻ nào được sử dụng để tạo tiêu đề lớn nhất trong HTML?",
      type: "multiple-choice",
      options: ["<h1>", "<h6>", "<heading>", "<title>"],
      correctAnswer: 0
    },
    {
      id: "q2",
      text: "Đâu là cách chính xác để tạo một liên kết trong HTML?",
      type: "multiple-choice",
      options: [
        "<link href='page.html'>Click here</link>",
        "<a href='page.html'>Click here</a>",
        "<a url='page.html'>Click here</a>",
        "<href='page.html'>Click here</href>"
      ],
      correctAnswer: 1
    },
    {
      id: "q3",
      text: "Để chèn một hình ảnh trong HTML, ta sử dụng thẻ nào?",
      type: "multiple-choice",
      options: ["<img>", "<picture>", "<image>", "<src>"],
      correctAnswer: 0
    },
    {
      id: "q4",
      text: "Thuộc tính nào được sử dụng để xác định đường dẫn đến hình ảnh trong thẻ img?",
      type: "multiple-choice",
      options: ["href", "link", "src", "url"],
      correctAnswer: 2
    },
    {
      id: "q5",
      text: "HTML là viết tắt của HyperText Markup Language",
      type: "true-false",
      options: ["Đúng", "Sai"],
      correctAnswer: 0
    }
  ],
  timeLimit: 10, // 10 minutes
  passingScore: 70 // 70%
};

// Mock course data
const mockCourse: Course = {
  id: "course-001",
  title: "Nhập môn lập trình Web",
  description: "Khóa học giúp bạn làm quen với lập trình web cơ bản.",
  image: "https://example.com/image.jpg",
  price: 599000,
  chapters: [
    {
      id: "chapter-001",
      title: "Giới thiệu về HTML",
      description: "Học về cấu trúc cơ bản của HTML và các thẻ quan trọng",
      lessons: [],
      testId: "quiz-001"
    }
  ],
  instructor: {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=12",
    title: "Giảng viên Web Development"
  }
};

const ChapterQuiz = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call with mock data
    const fetchData = async () => {
      try {
        // In a real application, you would fetch quiz data from an API
        // const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/quiz`);
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setCourse(mockCourse);
          const foundChapter = mockCourse.chapters.find(c => c.id === chapterId);
          if (foundChapter) {
            setChapter(foundChapter);
            setQuiz(mockQuiz);
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, chapterId]);

  const handleQuizComplete = (score: number) => {
    setScore(score);
    setCompleted(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dtktmt-blue-medium"></div>
      </div>
    );
  }

  if (!quiz || !course || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài kiểm tra</h1>
        <Link 
          to={`/khoa-hoc/${courseId}/chuong/${chapterId}`} 
          className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại nội dung chương học
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link 
            to={`/khoa-hoc/${courseId}/chuong/${chapterId}`} 
            className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại nội dung chương học
          </Link>
        </div>

        <div className="mb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{chapter.title}</h1>
          <p className="text-gray-600">Kiểm tra kiến thức</p>
        </div>

        {completed ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8 my-8">
            <div className={`text-6xl font-bold mb-4 ${score >= quiz.passingScore ? "text-green-500" : "text-red-500"}`}>
              {score}%
            </div>
            
            <h2 className="text-xl font-semibold mb-4">
              {score >= quiz.passingScore 
                ? "Chúc mừng! Bạn đã hoàn thành bài kiểm tra" 
                : "Bạn chưa đạt điểm đủ để qua bài kiểm tra"}
            </h2>
            
            <p className="mb-6 text-gray-600">
              {score >= quiz.passingScore
                ? "Bạn đã nắm vững kiến thức của chương này. Hãy tiếp tục với chương tiếp theo!"
                : `Bạn cần đạt tối thiểu ${quiz.passingScore}% để hoàn thành bài kiểm tra. Hãy xem lại bài học và thử lại!`}
            </p>
            
            <div className="space-y-3">
              {score >= quiz.passingScore ? (
                <>
                  <button 
                    onClick={() => navigate(`/khoa-hoc/${courseId}`)}
                    className="w-full bg-dtktmt-blue-medium text-white py-2 px-4 rounded-lg hover:bg-dtktmt-blue-dark transition-colors"
                  >
                    Quay lại khóa học
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="w-full bg-dtktmt-blue-medium text-white py-2 px-4 rounded-lg hover:bg-dtktmt-blue-dark transition-colors"
                  >
                    Làm lại bài kiểm tra
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/khoa-hoc/${courseId}/chuong/${chapterId}`)}
                    className="w-full bg-white text-dtktmt-blue-medium border border-dtktmt-blue-medium py-2 px-4 rounded-lg hover:bg-dtktmt-blue-light transition-colors"
                  >
                    Xem lại bài học
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <QuizComponent quiz={quiz} onComplete={handleQuizComplete} />
        )}
      </div>
    </div>
  );
};

export default ChapterQuiz;
