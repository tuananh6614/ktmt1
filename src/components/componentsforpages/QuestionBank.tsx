import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config/config";
import { Clock, BookOpen } from "lucide-react";

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

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["questions", courseId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/questions/${courseId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const handleStartExam = () => {
    // Chuyển đến trang thi với ID khóa học
    navigate(`/khoa-hoc/${courseId}/thi`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Chưa có câu hỏi cho khóa học này</h3>
        <p className="text-gray-500 mt-2">Vui lòng quay lại sau.</p>
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