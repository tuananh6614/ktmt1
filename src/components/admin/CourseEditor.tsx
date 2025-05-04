import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChapterList from "./course-editor/ChapterList";
import CourseHeader from "./course-editor/CourseHeader";
import { API_URL } from '../../config/api';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  course_id: number;
  title: string;
  chapter_order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  lesson_order: number;
  pages?: Page[];
}

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: string;
  content: string;
}

const CourseEditor = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/courses/${courseId}/structure`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin khóa học');
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Đã xảy ra lỗi khi tải thông tin khóa học');
      toast.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/courses");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error || 'Không tìm thấy thông tin khóa học'}</p>
          <button 
            onClick={handleGoBack}
            className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={handleGoBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Quay lại danh sách khóa học
      </button>

      <CourseHeader 
        course={course} 
        onCourseUpdated={fetchCourseData} 
      />

      <div className="mt-8">
        <ChapterList 
          courseId={course.id} 
          chapters={course.chapters} 
          onDataChanged={fetchCourseData} 
        />
      </div>
    </div>
  );
};

export default CourseEditor; 