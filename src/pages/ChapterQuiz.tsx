
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const ChapterQuiz = () => {
  const { courseId, chapterId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions: Question[] = [
    {
      id: "1",
      question: "Điện trở được đo bằng đơn vị nào?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctAnswer: 2
    },
    {
      id: "2",
      question: "Dòng điện được đo bằng đơn vị nào?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctAnswer: 1
    }
  ];

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (selectedAnswers.length !== questions.length) {
      toast.error("Vui lòng trả lời tất cả câu hỏi!");
      return;
    }

    const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const score = (correctAnswers / questions.length) * 100;
    setIsSubmitted(true);
    
    if (score >= 80) {
      toast.success(`Chúc mừng! Bạn đã đạt ${score}% câu trả lời đúng`);
    } else {
      toast.error(`Bạn cần ôn tập lại! Điểm số: ${score}%`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Bài kiểm tra kiến thức</h1>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <Card key={question.id} className={isSubmitted ? 
                (selectedAnswers[questionIndex] === question.correctAnswer ? 'border-green-500' : 'border-red-500') 
                : ''
              }>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {questionIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedAnswers[questionIndex] === optionIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-400'
                        } ${
                          isSubmitted && optionIndex === question.correctAnswer
                            ? 'bg-green-50 border-green-500'
                            : ''
                        }`}
                        onClick={() => handleSelectAnswer(questionIndex, optionIndex)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Đã nộp bài' : 'Nộp bài'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChapterQuiz;
