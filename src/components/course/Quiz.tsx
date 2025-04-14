
import { useState } from "react";
import { HelpCircle, Timer, Award, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface QuizProps {
  quiz: {
    id: string;
    title: string;
    questionCount: number;
    timeLimit: number;
    completed?: boolean;
    score?: number;
  };
}

export const Quiz = ({ quiz }: QuizProps) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // seconds

  // Dữ liệu mẫu - trong thực tế sẽ lấy từ API
  const questions = [
    {
      id: 1,
      text: "Vi điều khiển STM32 dựa trên kiến trúc nào?",
      options: [
        "Intel x86",
        "ARM Cortex-M",
        "MIPS",
        "PowerPC",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Trong STM32, GPIO là viết tắt của?",
      options: [
        "General Port Input/Output",
        "General Purpose Input/Output",
        "General Peripheral Input/Output",
        "General Pin Input/Output",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      text: "Hàm HAL_GPIO_TogglePin() trong thư viện HAL của STM32 có chức năng gì?",
      options: [
        "Đọc trạng thái của chân GPIO",
        "Cấu hình chân GPIO",
        "Đảo trạng thái của chân GPIO",
        "Bật/tắt ngắt trên chân GPIO",
      ],
      correctAnswer: 2,
    },
    {
      id: 4,
      text: "Tần số hoạt động tối đa của dòng STM32F4 là bao nhiêu?",
      options: [
        "84 MHz",
        "168 MHz",
        "216 MHz",
        "480 MHz",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      text: "Để kích hoạt clock cho ngoại vi trong STM32, ta sử dụng thanh ghi nào?",
      options: [
        "RCC_APB1ENR",
        "GPIOA_MODER",
        "SYSCFG_EXTICR",
        "NVIC_ISER",
      ],
      correctAnswer: 0,
    },
  ];

  const handleStartQuiz = () => {
    setStarted(true);
    // Trong ứng dụng thực tế, ở đây sẽ có logic bắt đầu đếm thời gian
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Tính điểm
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach((qIndex) => {
      const index = parseInt(qIndex);
      if (selectedAnswers[index] === questions[index].correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100) / 100 * questions.length;
    setScore(finalScore);
    setQuizCompleted(true);
    
    toast({
      title: "Hoàn thành bài kiểm tra!",
      description: `Bạn đạt được ${finalScore}/${questions.length} điểm.`,
      variant: finalScore > questions.length / 2 ? "default" : "destructive",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Nếu bài kiểm tra đã hoàn thành, hiển thị kết quả
  if (quiz.completed || quizCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-10"
      >
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Award size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Bài kiểm tra đã hoàn thành!</h2>
        <p className="text-gray-600 mb-8">
          Bạn đạt được {quiz.score ?? score}/{quiz.questionCount} điểm.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold mb-4">Kết quả chi tiết</h3>
          
          {questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correctAnswer;
            return (
              <div key={question.id} className="mb-4 text-left">
                <div className="flex items-start gap-2">
                  <div className={cn(
                    "mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs",
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  )}>
                    {isCorrect ? "✓" : "✕"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{question.text}</p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">Đáp án của bạn: </span>
                      <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {question.options[selectedAnswers[index] || 0]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-1">
                        <span className="text-gray-500">Đáp án đúng: </span>
                        <span className="text-green-600 font-medium">
                          {question.options[question.correctAnswer]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button
          className="mt-6 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium"
        >
          Quay lại bài học
        </Button>
      </motion.div>
    );
  }

  // Nếu chưa bắt đầu bài kiểm tra, hiển thị màn hình giới thiệu
  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto bg-dtktmt-blue-light/30 rounded-full flex items-center justify-center mb-6">
          <HelpCircle size={32} className="text-dtktmt-blue-dark" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-gray-600 mb-8">
          Kiểm tra kiến thức của bạn về nội dung đã học.
        </p>
        
        <div className="bg-dtktmt-blue-light/10 rounded-xl p-6 max-w-md mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-dtktmt-blue-medium" />
              <span className="font-medium">Số câu hỏi</span>
            </div>
            <span>{quiz.questionCount} câu</span>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Timer size={18} className="text-dtktmt-blue-medium" />
              <span className="font-medium">Thời gian làm bài</span>
            </div>
            <span>{quiz.timeLimit} phút</span>
          </div>
        </div>
        
        <Button
          onClick={handleStartQuiz}
          className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium"
          size="lg"
        >
          Bắt đầu kiểm tra
        </Button>
      </div>
    );
  }

  // Hiển thị câu hỏi
  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion] !== undefined;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">{quiz.title}</h2>
        <div className="bg-dtktmt-blue-light/20 text-dtktmt-blue-dark px-4 py-1 rounded-full flex items-center gap-1">
          <Timer size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">
          Câu hỏi {currentQuestion + 1}/{questions.length}
        </span>
        <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="font-medium text-lg mb-4">
          {currentQuestionData.text}
        </h3>
        
        <div className="space-y-3">
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(currentQuestion, index)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all border",
                selectedAnswers[currentQuestion] === index
                  ? "bg-dtktmt-blue-light/30 border-dtktmt-blue-medium"
                  : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm border",
                  selectedAnswers[currentQuestion] === index
                    ? "bg-dtktmt-blue-medium text-white border-dtktmt-blue-medium"
                    : "border-gray-300"
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Câu trước
        </Button>
        
        {isLastQuestion ? (
          <Button 
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="bg-gradient-to-r from-dtktmt-blue-dark to-dtktmt-purple-medium"
          >
            Nộp bài
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={!hasSelectedAnswer}
            className="flex items-center gap-1 bg-dtktmt-blue-medium"
          >
            Câu tiếp theo
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
