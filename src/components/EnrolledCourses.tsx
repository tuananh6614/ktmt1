import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bookmark, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/config/config";

interface CourseData {
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
  description?: string;
  total_chapters?: number;
  completed_chapters?: number;
  last_activity?: string;
}

interface EnrolledCoursesProps {
  courses: CourseData[];
}

const EnrolledCourses = ({ courses }: EnrolledCoursesProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Tính toán thông tin thống kê về khóa học
  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.progress === 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    notStarted: courses.filter(c => c.progress === 0).length,
    avgProgress: courses.length > 0 
      ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) 
      : 0
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-400";
    if (progress < 70) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };
  
  if (courses.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="mb-4">
          <BookOpen size={48} className="mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Bạn chưa đăng ký khóa học nào</h3>
        <p className="text-gray-500 mb-5 max-w-md mx-auto">
          Khám phá các khóa học chất lượng và bắt đầu hành trình học tập của bạn ngay hôm nay.
        </p>
        <Button onClick={() => navigate('/khoa-hoc')} className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark">
          Khám phá khóa học
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thống kê khóa học */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/60">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-dtktmt-blue-light/30 flex items-center justify-center mb-2">
              <BookOpen size={20} className="text-dtktmt-blue-medium" />
            </div>
            <span className="text-2xl font-bold">{stats.total}</span>
            <span className="text-sm text-gray-500">Tổng số khóa học</span>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <span className="text-2xl font-bold">{stats.completed}</span>
            <span className="text-sm text-gray-500">Đã hoàn thành</span>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <span className="text-2xl font-bold">{stats.inProgress}</span>
            <span className="text-sm text-gray-500">Đang học</span>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-dtktmt-blue-light/20 flex items-center justify-center mb-2">
              <Bookmark size={20} className="text-dtktmt-blue-medium" />
            </div>
            <span className="text-2xl font-bold">{stats.avgProgress}%</span>
            <span className="text-sm text-gray-500">Tiến độ trung bình</span>
          </CardContent>
        </Card>
      </div>
      
      {/* Điều khiển chế độ xem */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Khóa học đã đăng ký</h3>
        <div className="flex space-x-2">
          <Button 
            variant={view === "grid" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("grid")}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </Button>
          <Button 
            variant={view === "list" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("list")}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Hiển thị khóa học - Chế độ lưới */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={course.course_image || `${API_BASE_URL}/placeholder-course.jpg`} 
                  alt={course.course_title} 
                  className="w-full h-40 object-cover"
                />
                {course.progress === 100 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Hoàn thành
                  </div>
                )}
                {course.progress > 0 && course.progress < 100 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Đang học
                  </div>
                )}
                {course.progress === 0 && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Chưa bắt đầu
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14">
                  {course.course_title}
                </h4>
                <div className="mt-2 mb-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress 
                    value={course.progress} 
                    className="h-2" 
                    style={{color: getProgressColor(course.progress)}}
                  />
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    <span>Bắt đầu: {new Date(course.start_date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  {course.completed_chapters !== undefined && course.total_chapters !== undefined && (
                    <div className="flex items-center mt-1">
                      <BookOpen size={14} className="mr-1 text-gray-400" />
                      <span>{course.completed_chapters}/{course.total_chapters} chương</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => navigate(`/khoa-hoc/${course.course_id}`)}
                  className="w-full"
                >
                  {course.progress === 0 ? "Bắt đầu học" : "Tiếp tục học"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Hiển thị khóa học - Chế độ danh sách */}
      {view === "list" && (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-28 sm:h-auto">
                  <img 
                    src={course.course_image || `${API_BASE_URL}/placeholder-course.jpg`} 
                    alt={course.course_title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {course.course_title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {course.description || "Không có mô tả"}
                      </p>
                    </div>
                    
                    {course.progress === 100 && (
                      <div className="mb-2 sm:mb-0 self-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 size={12} className="mr-1" />
                          Hoàn thành
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 mb-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tiến độ</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress 
                      value={course.progress} 
                      className="h-2" 
                      style={{color: getProgressColor(course.progress)}}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3">
                    <div className="text-sm text-gray-500 flex space-x-4">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        <span>{getTimeAgo(course.start_date)}</span>
                      </div>
                      
                      {course.completed_chapters !== undefined && course.total_chapters !== undefined && (
                        <div className="flex items-center">
                          <BookOpen size={14} className="mr-1 text-gray-400" />
                          <span>{course.completed_chapters}/{course.total_chapters} chương</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/khoa-hoc/${course.course_id}`)}
                      size="sm"
                      className="mt-2 sm:mt-0"
                    >
                      {course.progress === 0 ? "Bắt đầu học" : "Tiếp tục học"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses; 