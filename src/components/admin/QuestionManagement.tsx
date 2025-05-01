import { useState, useEffect } from "react";
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

const API_URL = 'http://localhost:3000/api';

const QuestionManagement = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
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

  // Lấy danh sách khóa học
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

  // Lấy tất cả câu hỏi khi chọn khóa học
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

  // Lấy danh sách chương của khóa học
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

  // Mutation để thêm câu hỏi mới
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

  // Mutation để cập nhật câu hỏi
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

  // Mutation để xóa câu hỏi
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

  // Nhóm câu hỏi theo chương
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
      
      // Khởi tạo cấu trúc cho tất cả các chương
      chapters.forEach(chapter => {
        newGroupedQuestions[selectedCourse].chapters[chapter.id] = {
          chapter,
          questions: []
        };
      });
      
      // Phân loại câu hỏi vào chương tương ứng
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
      
      // Cập nhật lại danh sách câu hỏi
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý ngân hàng câu hỏi</h2>
        <div className="flex gap-4">

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
                        <span className="font-medium">Chương {chapter.chapter_order}:</span>
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

      {/* Dialog thêm câu hỏi mới */}
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

      {/* Dialog sửa câu hỏi */}
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

      {/* Alert dialog xóa câu hỏi */}
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
    </div>
  );
};

export default QuestionManagement; 