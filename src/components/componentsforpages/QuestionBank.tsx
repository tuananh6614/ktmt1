import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config/config";
import { Clock, BookOpen, AlertTriangle, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  chapter_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const QuestionBank = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  // Log để debug
  useEffect(() => {
    console.log('QuestionBank mounted, courseId:', courseId);
    console.log('API URL:', `${API_BASE_URL}/api/questions/${courseId}`);
  }, [courseId]);

  const { data: questions, isLoading, isError } = useQuery<Question[]>({
    queryKey: ["questions", courseId],
    queryFn: async () => {
      try {
        console.log('Fetching questions for course ID:', courseId);
        
        // Lấy token xác thực từ localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setAuthError(true);
          throw new Error('Vui lòng đăng nhập để xem ngân hàng câu hỏi');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/questions/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          throw new Error('Vui lòng đăng nhập để xem ngân hàng câu hỏi');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`${response.status}: ${errorText || "Network response was not ok"}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${data?.length || 0} questions`);
        return data;
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải câu hỏi');
        throw error;
      }
    },
    retry: 1,
  });

  const handleStartExam = () => {
    // Chuyển đến trang thi với ID khóa học
    navigate(`/khoa-hoc/${courseId}/thi`);
  };
  
  const handleLogin = () => {
    // Lưu đường dẫn hiện tại để quay lại sau khi đăng nhập
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3">Đang tải ngân hàng câu hỏi...</p>
      </div>
    );
  }
  
  if (authError) {
    return (
      <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="flex justify-center mb-4">
          <Lock className="h-12 w-12 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-yellow-800">Vui lòng đăng nhập</h3>
        <p className="text-yellow-600 mt-2">Bạn cần đăng nhập để xem ngân hàng câu hỏi</p>
        <Button 
          variant="default" 
          className="mt-4 bg-yellow-500 hover:bg-yellow-600"
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-800">Không thể tải ngân hàng câu hỏi</h3>
        <p className="text-red-600 mt-2">{error || "Vui lòng thử lại sau."}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium">Chưa có câu hỏi cho khóa học này</h3>
        <p className="text-gray-500 mt-2">Giáo viên đang cập nhật ngân hàng câu hỏi. Vui lòng quay lại sau.</p>
      </div>
    );
  }

  // Chỉ hiển thị 3 câu hỏi đầu tiên cho phần xem trước
  const previewQuestions = questions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Phần thông tin đề thi */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Ngân hàng câu hỏi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>Tổng số câu hỏi: {questions.length}</span>
          </div>
          <div>
            <Badge variant="secondary">Trắc nghiệm</Badge>
          </div>
        </div>
      </div>

      {/* Phần xem trước câu hỏi */}
      <div className="space-y-4">
        <div className="grid gap-4">
          {previewQuestions.map((question, index) => (
            <Card key={question.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  Câu {index + 1}: {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-2 rounded bg-gray-50">
                    <span className="font-medium">A.</span>
                    <span>{question.option_a}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded bg-gray-50">
                    <span className="font-medium">B.</span>
                    <span>{question.option_b}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded bg-gray-50">
                    <span className="font-medium">C.</span>
                    <span>{question.option_c}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded bg-gray-50">
                    <span className="font-medium">D.</span>
                    <span>{question.option_d}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length > 3 && (
          <div className="text-center text-gray-500 mt-4">
            ... và {questions.length - 3} câu hỏi khác
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank; 