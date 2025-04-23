
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseDetailComponent from "@/components/course/CourseDetail";
import { Course } from "@/types/course";
import { ArrowLeft } from "lucide-react";

// Mock data for demonstration
const mockCourse: Course = {
  id: "course-001",
  title: "Nhập môn lập trình Web",
  description: "Khóa học giúp bạn làm quen với lập trình web cơ bản, HTML, CSS và JavaScript. Bạn sẽ học cách xây dựng trang web đơn giản và hiểu được cách thức hoạt động của web.",
  image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
  price: 599000,
  duration: "12 giờ",
  level: "Cơ bản",
  chapters: [
    {
      id: "chapter-001",
      title: "Giới thiệu về HTML",
      description: "Học về cấu trúc cơ bản của HTML và các thẻ quan trọng",
      duration: "2 giờ",
      lessons: [
        {
          id: "lesson-001",
          title: "Cấu trúc HTML cơ bản",
          description: "Tìm hiểu về cấu trúc trang HTML và các thẻ cơ bản",
          duration: "30 phút",
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
              content: "HTML (HyperText Markup Language) là ngôn ngữ đánh dấu tiêu chuẩn để tạo và cấu trúc các trang và ứng dụng web."
            }
          ]
        },
        {
          id: "lesson-002",
          title: "Các thẻ HTML quan trọng",
          description: "Học về các thẻ HTML phổ biến và cách sử dụng chúng",
          duration: "45 phút",
          pages: [
            {
              id: "page-003",
              type: "video",
              content: "https://example.com/video2.mp4",
              duration: "20 phút"
            },
            {
              id: "page-004",
              type: "text",
              content: "Trong bài này, chúng ta sẽ tìm hiểu về các thẻ HTML phổ biến như h1-h6, p, div, span, a, img, và nhiều thẻ khác."
            }
          ]
        }
      ],
      testId: "quiz-001"
    },
    {
      id: "chapter-002",
      title: "CSS Cơ bản",
      description: "Tìm hiểu về CSS và cách tạo kiểu cho trang web",
      duration: "3 giờ",
      lessons: [
        {
          id: "lesson-003",
          title: "Giới thiệu về CSS",
          description: "Học về CSS và cách áp dụng kiểu cho HTML",
          duration: "1 giờ",
          pages: [
            {
              id: "page-005",
              type: "video",
              content: "https://example.com/video3.mp4",
              duration: "25 phút"
            }
          ]
        }
      ]
    }
  ],
  instructor: {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=12",
    title: "Giảng viên Web Development"
  }
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with mock data
    const fetchCourse = async () => {
      try {
        // In a real application, you would fetch from an API
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setCourse(mockCourse);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dtktmt-blue-medium"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy khóa học</h1>
        <Link 
          to="/khoa-hoc" 
          className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/khoa-hoc" 
            className="inline-flex items-center text-dtktmt-blue-medium hover:text-dtktmt-blue-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách khóa học
          </Link>
        </div>
        <CourseDetailComponent course={course} />
      </div>
    </div>
  );
};

export default CourseDetailPage;
