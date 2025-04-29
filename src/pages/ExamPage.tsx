import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import NavBar from "@/components/NavBar";
import { API_BASE_URL } from "@/config/config";
import { Clock } from "lucide-react";

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

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 phút
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["exam-questions", courseId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/questions/${courseId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Tính điểm
    let correctCount = 0;
    questions?.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });

    const score = questions ? (correctCount / questions.length) * 10 : 0;

    // TODO: Gửi kết quả lên server
    
    // Chuyển đến trang kết quả
    navigate(`/khoa-hoc/${courseId}/ket-qua`, {
      state: {
        score,
        totalQuestions: questions?.length || 0,
        correctAnswers: correctCount,
        answers: selectedAnswers
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertDescription>Không tìm thấy câu hỏi cho bài thi này</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const progress = (Object.keys(selectedAnswers).length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">
                Thời gian còn lại: {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Đã làm: {Object.keys(selectedAnswers).length}/{questions.length}
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  Câu {index + 1}: {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswers[question.id]}
                  onValueChange={(value) => handleAnswerSelect(question.id, value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                      <RadioGroupItem value="A" id={`${question.id}-A`} />
                      <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-A`}>
                        {question.option_a}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                      <RadioGroupItem value="B" id={`${question.id}-B`} />
                      <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-B`}>
                        {question.option_b}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                      <RadioGroupItem value="C" id={`${question.id}-C`} />
                      <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-C`}>
                        {question.option_c}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                      <RadioGroupItem value="D" id={`${question.id}-D`} />
                      <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-D`}>
                        {question.option_d}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage; 