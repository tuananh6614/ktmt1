import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import NavBar from "@/components/componentsforpages/NavBar";
import { API_BASE_URL } from "@/config/config";
import { Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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

interface UserExam {
  id: number;
  exam_id: number;
  user_id: number;
  attempt_count: number;
  score: number | null;
}

interface Exam {
  id: number;
  course_id: number;
  chapter_id: number | null;
  title: string;
  time_limit: number;
  total_questions: number;
}

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const testType = searchParams.get('type') || 'final'; // 'chapter' or 'final'
  const chapterId = searchParams.get('chapter');
  
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testTitle, setTestTitle] = useState<string>('');
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [examId, setExamId] = useState<number | null>(null);
  const [examData, setExamData] = useState<Exam | null>(null);

  // Fetch exam information (from exams table)
  useEffect(() => {
    const fetchExamInfo = async () => {
      try {
        // Get the user token
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Vui lòng đăng nhập để làm bài kiểm tra");
          navigate('/login');
          return;
        }

        const timestamp = new Date().getTime();
        let url = `${API_BASE_URL}/api/exams?course_id=${courseId}&_t=${timestamp}`;
        if (testType === 'chapter' && chapterId) {
          url += `&chapter_id=${chapterId}`;
        } else {
          url += '&is_final=true';
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải thông tin bài kiểm tra');
        }

        const examData = await response.json();
        
        if (!examData || (Array.isArray(examData) && examData.length === 0)) {
          toast.error("Không tìm thấy bài kiểm tra");
          navigate(`/khoa-hoc/${courseId}/noi-dung`);
          return;
        }
        
        // If it returns an array, take the first item
        const exam = Array.isArray(examData) ? examData[0] : examData;
        
        // Set the exam ID and exam data
        setExamId(exam.id);
        setExamData(exam);
        
        // Set time limit from exam data (converting minutes to seconds)
        setTimeLeft(exam.time_limit * 60);
        
        // Create user exam entry
        await createUserExam(exam.id);
        
        // Set test title based on the exam data
        setTestTitle(exam.title || (testType === 'final' ? 'Bài kiểm tra cuối khóa' : 'Bài kiểm tra chương'));
        
      } catch (error) {
        console.error("Error fetching exam info:", error);
        toast.error("Có lỗi xảy ra khi tải bài kiểm tra");
        navigate(`/khoa-hoc/${courseId}/noi-dung`);
      }
    };

    fetchExamInfo();
  }, [courseId, testType, chapterId, navigate]);

  // Create user exam entry and initialize question set
  const createUserExam = async (examId: number) => {
    try {
      setIsInitializing(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Vui lòng đăng nhập để làm bài kiểm tra");
        navigate('/login');
        return;
      }

      console.log("Đang tạo bài kiểm tra cho exam_id:", examId);
      console.log("Loại bài kiểm tra:", testType, "Course ID:", courseId, "Chapter ID:", chapterId);

      const timestamp = new Date().getTime();
      // Create a new user exam entry
      const createResponse = await fetch(`${API_BASE_URL}/api/user-exams?_t=${timestamp}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          exam_id: examId,
          course_id: courseId
        })
      });

      let responseData: any = {};
      
      try {
        // Attempt to parse response as JSON regardless of success/failure
        responseData = await createResponse.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
      
      if (!createResponse.ok) {
        console.error("API Error:", responseData);
        const errorMessage = responseData.message || responseData.details || 'Không thể tạo bài kiểm tra';
        throw new Error(errorMessage);
      }

      console.log("Tạo bài kiểm tra thành công:", responseData);
      setUserExamId(responseData.id);
      toast.success(`Đã tạo bài kiểm tra với ${responseData.questions_count} câu hỏi`);
      
      // After creating user exam, set initializing to false
      setIsInitializing(false);
    } catch (error) {
      console.error("Error creating user exam:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi khởi tạo bài kiểm tra", {
        duration: 5000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate(`/khoa-hoc/${courseId}/noi-dung`);
      }, 3000);
    }
  };

  // Fetch chapter title if needed
  useEffect(() => {
    if (testType === 'chapter' && chapterId) {
      const timestamp = new Date().getTime();
      fetch(`${API_BASE_URL}/api/chapters/${chapterId}?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(res => res.json())
        .then(data => {
          setChapterTitle(data.title);
          if (!testTitle) {
            setTestTitle(`Bài kiểm tra: ${data.title}`);
          }
        })
        .catch(err => console.error("Error fetching chapter:", err));
    } else if (!testTitle) {
      // Default title for final test
      setTestTitle("Bài kiểm tra cuối khóa");
    }
  }, [testType, chapterId, testTitle]);

  // Query for questions based on the user exam id
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["exam-questions", userExamId],
    queryFn: async () => {
      if (!userExamId) return [];
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Unauthorized");
      
      const response = await fetch(`${API_BASE_URL}/api/user-exams/${userExamId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      return response.json();
    },
    enabled: !!userExamId && !isInitializing // Only run query when userExamId is available
  });

  // Đếm ngược thời gian
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
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
    
    try {
      // Tính điểm
      let correctCount = 0;
      questions?.forEach(question => {
        if (selectedAnswers[question.id] === question.correct_answer) {
          correctCount++;
        }
      });

      const score = questions ? (correctCount / questions.length) * 10 : 0;
      
      // Submit answers and score to server
      if (userExamId) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Unauthorized");
        
        await fetch(`${API_BASE_URL}/api/user-exams/${userExamId}/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            answers: selectedAnswers,
            score: score
          })
        });
      }

      // Chuyển đến trang kết quả với query parameter cho loại bài kiểm tra
      navigate(`/khoa-hoc/${courseId}/ket-qua`, {
        state: {
          score,
          totalQuestions: questions?.length || 0,
          correctAnswers: correctCount,
          answers: selectedAnswers,
          testType,
          chapterId,
          userExamId
        }
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Có lỗi xảy ra khi nộp bài kiểm tra");
    }
  };

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Đang khởi tạo bài kiểm tra...</span>
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
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Không tìm thấy câu hỏi cho bài thi này. 
              {testType === 'chapter' ? ' Vui lòng kiểm tra lại ID chương.' : ''}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
          </div>
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
          <h1 className="text-xl font-bold mb-3">{testTitle}</h1>
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