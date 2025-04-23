
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Quiz, Question } from "@/types/course";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const QuizComponent = ({ quiz, onComplete }: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setIsSubmitted(true);
    onComplete(score);
    
    if (score >= quiz.passingScore) {
      toast.success(`Chúc mừng! Bạn đã đạt ${score}%`);
    } else {
      toast.error(`Bạn đã đạt ${score}%. Cần ${quiz.passingScore}% để đạt`);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <span className="text-sm text-gray-500">
            Câu {currentQuestion + 1}/{quiz.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{question.text}</div>

        <RadioGroup
          value={answers[currentQuestion]?.toString()}
          onValueChange={(value) => handleAnswer(parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Câu trước
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            disabled={answers.length !== quiz.questions.length || isSubmitted}
            className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
          >
            Nộp bài
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
          >
            Câu tiếp
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;
