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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Clock, FileText, Users, CheckCircle2 } from "lucide-react";
import { API_URL } from '../../config/api';

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

interface Exam {
  id: number;
  course_id: number;
  chapter_id: number | null;
  title: string;
  time_limit: number;
  total_questions: number;
  created_at?: string;
}

interface ExamFormData {
  id?: number;
  course_id: string;
  chapter_id?: string | null;
  title: string;
  time_limit: number;
  total_questions: number;
}

interface UserExam {
  id: number;
  exam_id: number;
  user_id: number;
  attempt_count: number;
  score: number | null;
  created_at: string;
  completed_at: string | null;
  exam_title: string;
  course_title: string;
  user_email?: string;
  user_name?: string;
}

const ExamManagement = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("course-exams");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  
  const initialFormData: ExamFormData = {
    course_id: "",
    chapter_id: null,
    title: "",
    time_limit: 30,
    total_questions: 10,
  };

  const [formData, setFormData] = useState<ExamFormData>(initialFormData);

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

  // Lấy danh sách bài thi của khóa học
  const { data: exams, isLoading: isLoadingExams, refetch: refetchExams } = useQuery<Exam[]>({
    queryKey: ['admin-exams', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/exams?course_id=${selectedCourse}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách bài thi');
      }
      
      return response.json();
    },
    enabled: !!selectedCourse
  });

  // Lấy danh sách kết quả bài thi
  const { data: examResults, isLoading: isLoadingResults, refetch: refetchResults } = useQuery<UserExam[]>({
    queryKey: ['admin-exam-results', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/exam-results?course_id=${selectedCourse}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách kết quả bài thi');
      }
      
      return response.json();
    },
    enabled: !!selectedCourse
  });

  // Mutation để thêm bài thi mới
  const addExamMutation = useMutation({
    mutationFn: async (examData: ExamFormData) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/exams`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(examData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể thêm bài thi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Thêm bài thi thành công');
      setIsAddDialogOpen(false);
      setFormData({...initialFormData, course_id: selectedCourse});
      queryClient.invalidateQueries({ queryKey: ['admin-exams', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  // Mutation để cập nhật bài thi
  const updateExamMutation = useMutation({
    mutationFn: async (examData: ExamFormData) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/exams/${examData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(examData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật bài thi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Cập nhật bài thi thành công');
      setIsEditDialogOpen(false);
      setCurrentExam(null);
      queryClient.invalidateQueries({ queryKey: ['admin-exams', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  // Mutation để xóa bài thi
  const deleteExamMutation = useMutation({
    mutationFn: async (examId: number) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa bài thi');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Xóa bài thi thành công');
      setIsDeleteDialogOpen(false);
      setCurrentExam(null);
      queryClient.invalidateQueries({ queryKey: ['admin-exams', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setFormData(prev => ({ ...prev, course_id: courseId, chapter_id: null }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho dữ liệu số
    if (name === 'time_limit' || name === 'total_questions') {
      const numericValue = parseInt(value);
      if (!isNaN(numericValue)) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChapterChange = (value: string) => {
    // Nếu chọn "Bài thi cuối khóa", chapter_id sẽ là null
    const chapterId = value === "final" ? null : value;
    setFormData(prev => ({ ...prev, chapter_id: chapterId }));
  };

  const handleAddExam = () => {
    setFormData({
      ...initialFormData,
      course_id: selectedCourse
    });
    setIsAddDialogOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setCurrentExam(exam);
    setFormData({
      id: exam.id,
      course_id: exam.course_id.toString(),
      chapter_id: exam.chapter_id ? exam.chapter_id.toString() : null,
      title: exam.title,
      time_limit: exam.time_limit,
      total_questions: exam.total_questions
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteExam = (exam: Exam) => {
    setCurrentExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const submitAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    addExamMutation.mutate(formData);
  };

  const submitEditExam = (e: React.FormEvent) => {
    e.preventDefault();
    updateExamMutation.mutate(formData);
  };

  const confirmDeleteExam = () => {
    if (currentExam) {
      deleteExamMutation.mutate(currentExam.id);
    }
  };

  // Lọc bài thi theo loại (bài thi chương hoặc bài thi cuối khóa)
  const chapterExams = exams?.filter(exam => exam.chapter_id !== null) || [];
  const finalExams = exams?.filter(exam => exam.chapter_id === null) || [];

  const isLoading = isLoadingCourses || isLoadingChapters || isLoadingExams || isLoadingResults;
  const isSubmitting = addExamMutation.isPending || updateExamMutation.isPending || deleteExamMutation.isPending;

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
        <h2 className="text-2xl font-bold">Quản lý bài thi</h2>
        <Button 
          onClick={handleAddExam} 
          disabled={!selectedCourse || isSubmitting}
        >
          Thêm bài thi mới
        </Button>
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
        <Tabs defaultValue="course-exams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="course-exams">Danh sách bài thi</TabsTrigger>
            <TabsTrigger value="exam-results">Kết quả bài thi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="course-exams" className="mt-6">
            <div className="space-y-6">
              {/* Bài thi chương */}
              <Card>
                <CardHeader>
                  <CardTitle>Bài thi theo chương</CardTitle>
                  <CardDescription>
                    Các bài kiểm tra theo từng chương của khóa học
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {chapterExams.length > 0 ? (
                    <div className="space-y-4">
                      {chapterExams.map((exam) => {
                        const chapter = chapters?.find(c => c.id === exam.chapter_id);
                        return (
                          <div 
                            key={exam.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div>
                              <h3 className="font-medium">{exam.title}</h3>
                              <div className="text-sm text-gray-500 mt-1">
                                {chapter ? `Chương ${chapter.chapter_order}: ${chapter.title}` : 'Chương không xác định'}
                              </div>
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{exam.time_limit} phút</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <FileText className="h-4 w-4" />
                                  <span>{exam.total_questions} câu hỏi</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditExam(exam)}
                                disabled={isSubmitting}
                              >
                                Sửa
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteExam(exam)}
                                disabled={isSubmitting}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có bài thi nào cho các chương của khóa học này.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bài thi cuối khóa */}
              <Card>
                <CardHeader>
                  <CardTitle>Bài thi cuối khóa</CardTitle>
                  <CardDescription>
                    Bài kiểm tra tổng hợp cuối khóa học
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {finalExams.length > 0 ? (
                    <div className="space-y-4">
                      {finalExams.map((exam) => (
                        <div 
                          key={exam.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="font-medium">{exam.title}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              <Badge>Bài thi cuối khóa</Badge>
                            </div>
                            <div className="flex gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{exam.time_limit} phút</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FileText className="h-4 w-4" />
                                <span>{exam.total_questions} câu hỏi</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditExam(exam)}
                              disabled={isSubmitting}
                            >
                              Sửa
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteExam(exam)}
                              disabled={isSubmitting}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có bài thi cuối khóa nào cho khóa học này.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="exam-results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả bài thi của học viên</CardTitle>
                <CardDescription>
                  Danh sách kết quả làm bài của học viên theo từng bài thi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {examResults && examResults.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài thi</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm số</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian làm bài</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {examResults.map((result) => (
                          <tr key={result.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium">{result.user_name || 'Người dùng'}</div>
                              <div className="text-sm text-gray-500">{result.user_email || 'N/A'}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium">{result.exam_title}</div>
                              <div className="text-sm text-gray-500">{result.course_title}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {result.score !== null ? (
                                <div className="font-medium">{result.score}/100</div>
                              ) : (
                                <div className="text-sm text-gray-500">Chưa hoàn thành</div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm">
                                {new Date(result.created_at).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(result.created_at).toLocaleTimeString('vi-VN')}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {result.completed_at ? (
                                <Badge variant="success" className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Đã hoàn thành
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Đang làm</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có kết quả bài thi nào cho khóa học này.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialog thêm bài thi mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm bài thi mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitAddExam}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter_id" className="text-right">
                  Loại bài thi
                </Label>
                <Select
                  value={formData.chapter_id === null ? "final" : formData.chapter_id}
                  onValueChange={handleChapterChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại bài thi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="final">Bài thi cuối khóa</SelectItem>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        Bài thi chương {chapter.chapter_order}: {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Tiêu đề
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time_limit" className="text-right">
                  Thời gian (phút)
                </Label>
                <Input
                  id="time_limit"
                  name="time_limit"
                  type="number"
                  min="1"
                  max="180"
                  value={formData.time_limit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_questions" className="text-right">
                  Số câu hỏi
                </Label>
                <Input
                  id="total_questions"
                  name="total_questions"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.total_questions}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !formData.title}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu bài thi'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog sửa bài thi */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sửa bài thi</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEditExam}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter_id" className="text-right">
                  Loại bài thi
                </Label>
                <Select
                  value={formData.chapter_id === null ? "final" : formData.chapter_id}
                  onValueChange={handleChapterChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại bài thi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="final">Bài thi cuối khóa</SelectItem>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        Bài thi chương {chapter.chapter_order}: {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Tiêu đề
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time_limit" className="text-right">
                  Thời gian (phút)
                </Label>
                <Input
                  id="time_limit"
                  name="time_limit"
                  type="number"
                  min="1"
                  max="180"
                  value={formData.time_limit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_questions" className="text-right">
                  Số câu hỏi
                </Label>
                <Input
                  id="total_questions"
                  name="total_questions"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.total_questions}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
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

      {/* Alert dialog xóa bài thi */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài thi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài thi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteExam} 
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

export default ExamManagement; 