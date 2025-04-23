
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Book, GraduationCap, Video } from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  title: string;
  duration: string;
  progress: number;
  type: 'video' | 'quiz' | 'reading';
  isLocked: boolean;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(30);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'not-enrolled' | 'enrolled' | 'completed'>('not-enrolled');

  const chapters: Chapter[] = [
    {
      id: "1",
      title: "Giới thiệu về Điện tử cơ bản",
      duration: "45 phút",
      progress: 100,
      type: 'video',
      isLocked: false
    },
    {
      id: "2",
      title: "Các thành phần điện tử",
      duration: "60 phút",
      progress: 50,
      type: 'reading',
      isLocked: false
    },
    {
      id: "3",
      title: "Bài kiểm tra kiến thức",
      duration: "30 phút",
      progress: 0,
      type: 'quiz',
      isLocked: true
    },
  ];

  const handleEnroll = () => {
    setEnrollmentStatus('enrolled');
    toast.success("Đăng ký khóa học thành công!");
  };

  const handleStartChapter = (chapter: Chapter) => {
    if (chapter.isLocked) {
      toast.error("Bạn cần hoàn thành các bài học trước để mở khóa nội dung này!");
      return;
    }
    // Implement navigation to chapter content
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Course Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h1 className="text-3xl font-bold mb-4">Khóa học Điện tử cơ bản</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>12 giờ học</span>
              </div>
              <div className="flex items-center gap-2">
                <Book size={20} />
                <span>24 bài học</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={20} />
                <span>Cấp chứng chỉ</span>
              </div>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm">
              <span>{progress}% hoàn thành</span>
              <span>7/24 bài học</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nội dung khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-4 border rounded-lg ${
                          chapter.isLocked ? 'opacity-60' : 'hover:border-blue-500'
                        } transition-all cursor-pointer`}
                        onClick={() => handleStartChapter(chapter)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {chapter.type === 'video' && <Video size={20} className="text-blue-500" />}
                            {chapter.type === 'quiz' && <GraduationCap size={20} className="text-purple-500" />}
                            {chapter.type === 'reading' && <Book size={20} className="text-green-500" />}
                            <h3 className="font-medium">{chapter.title}</h3>
                          </div>
                          <span className="text-sm text-gray-500">{chapter.duration}</span>
                        </div>
                        <Progress value={chapter.progress} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Đăng ký khóa học</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Học phí</span>
                      <span className="text-2xl font-bold text-blue-600">Miễn phí</span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={handleEnroll}
                        disabled={enrollmentStatus !== 'not-enrolled'}
                      >
                        {enrollmentStatus === 'not-enrolled' ? 'Đăng ký ngay' : 'Đã đăng ký'}
                      </Button>
                      {enrollmentStatus === 'enrolled' && (
                        <p className="text-sm text-center text-gray-500">
                          Bạn đã đăng ký thành công khóa học này
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
