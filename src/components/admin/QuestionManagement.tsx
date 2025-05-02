import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadCloud, InfoIcon, FileText, Loader2 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
}

interface Chapter {
  id: number;
  course_id: number;
  title: string;
  chapter_order: number;
}

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

interface GroupedQuestions {
  [courseId: string]: {
    course: Course;
    chapters: {
      [chapterId: string]: {
        chapter: Chapter;
        questions: Question[];
      }
    }
  }
}

interface QuestionFormData {
  id?: number;
  chapter_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface AIQuestionBatch {
  id: string;
  questions: Question[];
  status: 'processing' | 'completed' | 'error';
  message?: string;
}

const API_URL = 'http://localhost:3000/api';

const QuestionManagement = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<1 | 2>(1);
  const [processedQuestions, setProcessedQuestions] = useState<Question[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormData: QuestionFormData = {
    chapter_id: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A"
  };

  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);

  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách khóa học');
      }
      return response.json();
    }
  });

  const { data: allQuestions, isLoading: isLoadingQuestions, refetch: refetchQuestions } = useQuery<Question[]>({
    queryKey: ['admin-questions', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/${selectedCourse}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách câu hỏi');
      }
      
      return response.json();
    },
    enabled: !!selectedCourse
  });

  const { data: chapters, isLoading: isLoadingChapters } = useQuery<Chapter[]>({
    queryKey: ['admin-chapters', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/courses/${selectedCourse}/chapters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách chương');
      }
      
      return response.json();
    },
    enabled: !!selectedCourse
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: QuestionFormData) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể thêm câu hỏi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Thêm câu hỏi thành công');
      setIsAddDialogOpen(false);
      setFormData(initialFormData);
      queryClient.invalidateQueries({ queryKey: ['admin-questions', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (questionData: QuestionFormData) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/${questionData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật câu hỏi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Cập nhật câu hỏi thành công');
      setIsEditDialogOpen(false);
      setCurrentQuestion(null);
      queryClient.invalidateQueries({ queryKey: ['admin-questions', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: number) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa câu hỏi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Xóa câu hỏi thành công');
      setIsDeleteDialogOpen(false);
      setCurrentQuestion(null);
      queryClient.invalidateQueries({ queryKey: ['admin-questions', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const uploadExamFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/upload-exam`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xử lý tài liệu đề thi');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setProcessingStatus('completed');
      setProcessedQuestions(data.questions || []);
      setUploadStep(2);
      toast.success('Đã xử lý tài liệu đề thi thành công');
    },
    onError: (error) => {
      setProcessingStatus('error');
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const saveAIQuestionsMutation = useMutation({
    mutationFn: async (questions: Question[]) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions, chapterId: formData.chapter_id })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể lưu danh sách câu hỏi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Đã lưu các câu hỏi thành công');
      setIsAIAssistantOpen(false);
      setSelectedFile(null);
      setProcessedQuestions([]);
      setUploadStep(1);
      setProcessingStatus('idle');
      queryClient.invalidateQueries({ queryKey: ['admin-questions', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  useEffect(() => {
    if (selectedCourse && courses && chapters && allQuestions) {
      const selectedCourseData = courses.find(c => c.id === parseInt(selectedCourse));
      
      if (!selectedCourseData) return;
      
      const newGroupedQuestions: GroupedQuestions = {
        [selectedCourse]: {
          course: selectedCourseData,
          chapters: {}
        }
      };
      
      chapters.forEach(chapter => {
        newGroupedQuestions[selectedCourse].chapters[chapter.id] = {
          chapter,
          questions: []
        };
      });
      
      allQuestions.forEach(question => {
        const chapterId = question.chapter_id.toString();
        if (newGroupedQuestions[selectedCourse].chapters[chapterId]) {
          newGroupedQuestions[selectedCourse].chapters[chapterId].questions.push(question);
        }
      });
      
      setGroupedQuestions(newGroupedQuestions);
    }
  }, [selectedCourse, courses, chapters, allQuestions]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleAddSampleQuestions = async () => {
    if (!selectedCourse) {
      toast.error("Vui lòng chọn khóa học trước");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/${selectedCourse}/seed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể thêm câu hỏi mẫu');
      }

      const result = await response.json();
      toast.success(result.message || 'Đã thêm câu hỏi mẫu thành công');
      
      refetchQuestions();
    } catch (error) {
      console.error('Lỗi khi thêm câu hỏi mẫu:', error);
      toast.error('Lỗi khi thêm câu hỏi mẫu');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, correct_answer: value }));
  };

  const handleAddQuestion = () => {
    setFormData({
      ...initialFormData,
      chapter_id: chapters && chapters.length > 0 ? chapters[0].id.toString() : ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setFormData({
      id: question.id,
      chapter_id: question.chapter_id.toString(),
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const submitAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestionMutation.mutate(formData);
  };

  const submitEditQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuestionMutation.mutate(formData);
  };

  const confirmDeleteQuestion = () => {
    if (currentQuestion) {
      deleteQuestionMutation.mutate(currentQuestion.id);
    }
  };

  const handleOpenAIAssistant = () => {
    if (!selectedCourse) {
      toast.error('Vui lòng chọn khóa học trước');
      return;
    }
    setIsAIAssistantOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.pdf')) {
        toast.error('Vui lòng chọn file Word (.doc, .docx) hoặc PDF (.pdf)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCourse || !formData.chapter_id) {
      toast.error('Vui lòng chọn file, khóa học và chương');
      return;
    }

    try {
      setIsUploading(true);
      setProcessingStatus('processing');
      
      const formDataToSend = new FormData();
      formDataToSend.append('examFile', selectedFile);
      formDataToSend.append('courseId', selectedCourse);
      formDataToSend.append('chapterId', formData.chapter_id);
      
      uploadExamFileMutation.mutate(formDataToSend);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Lỗi khi tải lên file');
      setProcessingStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProcessedQuestions = () => {
    if (processedQuestions.length === 0) {
      toast.error('Không có câu hỏi nào để lưu');
      return;
    }

    if (!formData.chapter_id) {
      toast.error('Vui lòng chọn chương cho câu hỏi');
      return;
    }

    const questionsWithChapter = processedQuestions.map(q => ({
      ...q,
      chapter_id: parseInt(formData.chapter_id)
    }));

    saveAIQuestionsMutation.mutate(questionsWithChapter);
  };

  const handleResetAIAssistant = () => {
    setSelectedFile(null);
    setProcessedQuestions([]);
    setUploadStep(1);
    setProcessingStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading = isLoadingCourses || isLoadingQuestions || isLoadingChapters;
  const isSubmitting = addQuestionMutation.isPending || updateQuestionMutation.isPending || deleteQuestionMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý ngân hàng câu hỏi</h2>
        <div className="flex gap-4">
          <Button 
            onClick={handleOpenAIAssistant} 
            disabled={!selectedCourse || isSubmitting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Trợ lý EduAI
          </Button>
          
          <Button onClick={handleAddQuestion} disabled={!selectedCourse || isSubmitting}>
            Thêm câu hỏi mới
          </Button>
        </div>
      </div>

      <div className="w-full md:w-1/3 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chọn khóa học
        </label>
        <Select 
          value={selectedCourse} 
          onValueChange={handleCourseChange}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn khóa học" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="bg-white rounded-lg shadow">
          {Object.keys(groupedQuestions).length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {Object.values(groupedQuestions[selectedCourse]?.chapters || {}).map(({ chapter, questions }) => (
                <AccordionItem key={chapter.id} value={chapter.id.toString()}>
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">   
                        <span>{chapter.title}</span>
                      </div>
                      <Badge variant="secondary">
                        {questions.length} câu hỏi
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-4">
                      {questions.length > 0 ? (
                        questions.map((question) => (
                          <Card key={question.id} className="border border-gray-200">
                            <CardContent className="pt-6">
                              <div className="flex justify-between mb-4">
                                <h4 className="font-medium text-lg">{question.question_text}</h4>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                    disabled={isSubmitting}
                                  >
                                    Sửa
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question)}
                                    disabled={isSubmitting}
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className={`flex items-center space-x-2 p-2 rounded ${question.correct_answer === 'A' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                  <span className="font-medium">A.</span>
                                  <span>{question.option_a}</span>
                                  {question.correct_answer === 'A' && (
                                    <Badge className="ml-auto" variant="success">Đáp án đúng</Badge>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-2 p-2 rounded ${question.correct_answer === 'B' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                  <span className="font-medium">B.</span>
                                  <span>{question.option_b}</span>
                                  {question.correct_answer === 'B' && (
                                    <Badge className="ml-auto" variant="success">Đáp án đúng</Badge>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-2 p-2 rounded ${question.correct_answer === 'C' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                  <span className="font-medium">C.</span>
                                  <span>{question.option_c}</span>
                                  {question.correct_answer === 'C' && (
                                    <Badge className="ml-auto" variant="success">Đáp án đúng</Badge>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-2 p-2 rounded ${question.correct_answer === 'D' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                  <span className="font-medium">D.</span>
                                  <span>{question.option_d}</span>
                                  {question.correct_answer === 'D' && (
                                    <Badge className="ml-auto" variant="success">Đáp án đúng</Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Chương này chưa có câu hỏi nào.
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {selectedCourse ? "Khóa học này chưa có câu hỏi nào." : "Vui lòng chọn khóa học."}
            </div>
          )}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitAddQuestion}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter_id" className="text-right">
                  Chương
                </Label>
                <Select
                  name="chapter_id"
                  value={formData.chapter_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapter_id: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn chương" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question_text" className="text-right">
                  Câu hỏi
                </Label>
                <Input
                  id="question_text"
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_a" className="text-right">
                  Đáp án A
                </Label>
                <Input
                  id="option_a"
                  name="option_a"
                  value={formData.option_a}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_b" className="text-right">
                  Đáp án B
                </Label>
                <Input
                  id="option_b"
                  name="option_b"
                  value={formData.option_b}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_c" className="text-right">
                  Đáp án C
                </Label>
                <Input
                  id="option_c"
                  name="option_c"
                  value={formData.option_c}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_d" className="text-right">
                  Đáp án D
                </Label>
                <Input
                  id="option_d"
                  name="option_d"
                  value={formData.option_d}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Đáp án đúng
                </Label>
                <RadioGroup
                  value={formData.correct_answer}
                  onValueChange={handleRadioChange}
                  className="col-span-3 flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A" id="correct_a" />
                    <Label htmlFor="correct_a">A</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="B" id="correct_b" />
                    <Label htmlFor="correct_b">B</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="correct_c" />
                    <Label htmlFor="correct_c">C</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="D" id="correct_d" />
                    <Label htmlFor="correct_d">D</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !formData.chapter_id}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu câu hỏi'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sửa câu hỏi</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEditQuestion}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter_id" className="text-right">
                  Chương
                </Label>
                <Select
                  name="chapter_id"
                  value={formData.chapter_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapter_id: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn chương" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        Chương {chapter.chapter_order}: {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question_text" className="text-right">
                  Câu hỏi
                </Label>
                <Input
                  id="question_text"
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_a" className="text-right">
                  Đáp án A
                </Label>
                <Input
                  id="option_a"
                  name="option_a"
                  value={formData.option_a}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_b" className="text-right">
                  Đáp án B
                </Label>
                <Input
                  id="option_b"
                  name="option_b"
                  value={formData.option_b}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_c" className="text-right">
                  Đáp án C
                </Label>
                <Input
                  id="option_c"
                  name="option_c"
                  value={formData.option_c}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="option_d" className="text-right">
                  Đáp án D
                </Label>
                <Input
                  id="option_d"
                  name="option_d"
                  value={formData.option_d}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Đáp án đúng
                </Label>
                <RadioGroup
                  value={formData.correct_answer}
                  onValueChange={handleRadioChange}
                  className="col-span-3 flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A" id="edit_correct_a" />
                    <Label htmlFor="edit_correct_a">A</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="B" id="edit_correct_b" />
                    <Label htmlFor="edit_correct_b">B</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="edit_correct_c" />
                    <Label htmlFor="edit_correct_c">C</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="D" id="edit_correct_d" />
                    <Label htmlFor="edit_correct_d">D</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteQuestion} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Trợ lý EduAI</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" disabled={uploadStep !== 1}>
                1. Upload tài liệu đề thi
              </TabsTrigger>
              <TabsTrigger value="review" disabled={uploadStep !== 2}>
                2. Duyệt kết quả
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 mb-4">
                <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-700">Hướng dẫn</h4>
                  <p className="text-blue-600 text-sm">Vui lòng đánh dấu * gạch chân, tô màu cho đáp án đúng.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="chapter_id" className="text-right">
                  Chương
                </Label>
                <Select
                  name="chapter_id"
                  value={formData.chapter_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapter_id: value }))}
                  disabled={isUploading}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn chương" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center items-center w-full border-2 border-dashed border-gray-300 rounded-lg p-8 mt-4">
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <UploadCloud className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload tài liệu đề thi</h3>
                    <p className="text-sm text-gray-500">Hỗ trợ định dạng tài liệu Word, PDF</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="examFile"
                    className="sr-only"
                    accept=".doc,.docx,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mr-2"
                  >
                    Chọn tài liệu
                  </Button>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-800">
                      Đã chọn: {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAIAssistantOpen(false)}
                  disabled={isUploading}
                >
                  Hủy
                </Button>
                <Button 
                  type="button" 
                  onClick={handleFileUpload}
                  disabled={!selectedFile || !formData.chapter_id || isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Tiếp tục</span>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-4 mt-4">
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2">Kết quả xử lý</h3>
                <p className="text-sm text-gray-600">
                  Hệ thống đã trích xuất {processedQuestions.length} câu hỏi. Vui lòng kiểm tra và sửa nếu cần.
                </p>
              </div>
              
              <div className="max-h-80 overflow-y-auto border rounded-lg p-4">
                {processedQuestions.length > 0 ? (
                  <div className="space-y-6">
                    {processedQuestions.map((question, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="font-medium mb-2">Câu hỏi {index + 1}: {question.question_text}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-green-50' : 'bg-gray-50'}`}>
                            A. {question.option_a}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-green-50' : 'bg-gray-50'}`}>
                            B. {question.option_b}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-green-50' : 'bg-gray-50'}`}>
                            C. {question.option_c}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-green-50' : 'bg-gray-50'}`}>
                            D. {question.option_d}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    {processingStatus === 'processing' ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-2" />
                        <p>Đang xử lý tài liệu, vui lòng đợi...</p>
                      </div>
                    ) : processingStatus === 'error' ? (
                      <p>Có lỗi xảy ra khi xử lý tài liệu.</p>
                    ) : (
                      <p>Không có câu hỏi nào được trích xuất.</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleResetAIAssistant}
                >
                  Thử lại
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveProcessedQuestions}
                  disabled={processedQuestions.length === 0}
                >
                  Lưu tất cả câu hỏi
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement; 