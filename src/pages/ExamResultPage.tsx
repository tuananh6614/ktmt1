import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award, AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "@/config/config";

const ExamResultPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [chapterTitle, setChapterTitle] = useState('');
  
  // Get result data from location state
  const resultData = location.state || {};
  const { 
    score = 0, 
    totalQuestions = 0, 
    correctAnswers = 0,
    testType = 'final',
    chapterId = null
  } = resultData;
  
  // Calculate percentage
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = percentage >= 70; // Passing score is 70%
  
  // Fetch chapter title if it's a chapter test
  useEffect(() => {
    if (testType === 'chapter' && chapterId) {
      fetch(`${API_BASE_URL}/api/chapters/${chapterId}`)
        .then(res => res.json())
        .then(data => {
          setChapterTitle(data.title);
        })
        .catch(err => console.error("Error fetching chapter:", err));
    }
  }, [testType, chapterId]);
  
  // If no result data, redirect to course page
  if (!resultData.score && !resultData.totalQuestions) {
    navigate(`/khoa-hoc/${courseId}`);
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {testType === 'chapter' 
              ? `Kết quả kiểm tra chương: ${chapterTitle}` 
              : 'Kết quả kiểm tra cuối khóa'}
          </h1>
          
          <Card className="mb-8 border-t-8 border-t-blue-500 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Điểm số của bạn</CardTitle>
              <CardDescription>
                {passed 
                  ? 'Chúc mừng! Bạn đã hoàn thành bài kiểm tra.'
                  : 'Bạn cần đạt ít nhất 70% để hoàn thành bài kiểm tra.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-5xl font-bold mb-2">{score.toFixed(1)}/10</div>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {passed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">Đạt</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-600 font-medium">Chưa đạt</span>
                    </>
                  )}
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-3 mb-2" 
                  color={passed ? "bg-green-500" : "bg-red-500"}
                />
                
                <div className="text-gray-500 text-sm">
                  Đúng {correctAnswers}/{totalQuestions} câu ({percentage}%)
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Final test certificate section */}
          {testType === 'final' && passed && (
            <Card className="mb-8 border border-green-100 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-700">Chứng chỉ khóa học</h3>
                    <p className="text-green-600">Bạn đã đủ điều kiện nhận chứng chỉ khóa học</p>
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Xem và tải chứng chỉ
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Not passed warning */}
          {!passed && (
            <Card className="mb-8 border border-orange-100 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-bold text-orange-700">Chưa đạt yêu cầu</h3>
                    <p className="text-orange-600">
                      {testType === 'chapter' 
                        ? 'Bạn có thể xem lại nội dung chương và thử lại.'
                        : 'Bạn cần đạt ít nhất 70% để nhận chứng chỉ khóa học.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            {testType === 'chapter' ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/khoa-hoc/${courseId}/noi-dung?chapter=${chapterId}`)}
                >
                  Quay lại chương
                </Button>
                <Button 
                  onClick={() => navigate(`/khoa-hoc/${courseId}/thi?type=chapter&chapter=${chapterId}`)}
                >
                  Làm lại bài kiểm tra
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/khoa-hoc/${courseId}/noi-dung`)}
                >
                  Quay lại khóa học
                </Button>
                {!passed && (
                  <Button 
                    onClick={() => navigate(`/khoa-hoc/${courseId}/thi?type=final`)}
                  >
                    Làm lại bài kiểm tra
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExamResultPage; 