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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { UploadCloud, InfoIcon, FileText, Loader2, Check, Trash2, Search, Filter, MoreVertical, SortAsc, SortDesc, FileQuestion, BarChart2, Book, Edit, FileCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const QuestionManagement = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeleteSelectedDialogOpen, setIsDeleteSelectedDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  
  // Thêm state mới cho tìm kiếm, lọc và phân trang
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterChapter, setFilterChapter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [viewMode, setViewMode] = useState<"grouped" | "list" | "grid">("grouped");
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState<boolean>(false);
  
  // Thống kê
  const [stats, setStats] = useState<{
    totalQuestions: number;
    questionsPerChapter: { [key: string]: number };
    correctAnswerDistribution: { [key: string]: number };
  }>({
    totalQuestions: 0,
    questionsPerChapter: {},
    correctAnswerDistribution: { A: 0, B: 0, C: 0, D: 0 },
  });
  
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

  const deleteAllQuestionsMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/course/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa tất cả câu hỏi');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Đã xóa ${data.affectedRows} câu hỏi thành công`);
      setIsDeleteAllDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-questions', selectedCourse] });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    }
  });

  const deleteSelectedQuestionsMutation = useMutation({
    mutationFn: async (questionIds: number[]) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/questions/batch-delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionIds })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa các câu hỏi đã chọn');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Đã xóa ${data.deletedCount} câu hỏi thành công`);
      setIsDeleteSelectedDialogOpen(false);
      setSelectedQuestions([]);
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

  const handleDeleteAllQuestions = () => {
    if (!selectedCourse) {
      toast.error('Vui lòng chọn khóa học trước');
      return;
    }
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllQuestions = () => {
    if (selectedCourse) {
      deleteAllQuestionsMutation.mutate(selectedCourse);
    }
  };

  const handleToggleSelectQuestion = (questionId: number) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAllQuestionsInChapter = (chapterId: number, questions: Question[]) => {
    const chapterQuestionIds = questions.map(q => q.id);
    
    setSelectedQuestions(prev => {
      // Kiểm tra xem tất cả câu hỏi trong chương đã được chọn chưa
      const allSelected = chapterQuestionIds.every(id => prev.includes(id));
      
      if (allSelected) {
        // Nếu tất cả đã được chọn thì bỏ chọn tất cả
        return prev.filter(id => !chapterQuestionIds.includes(id));
      } else {
        // Nếu chưa thì chọn tất cả những câu hỏi chưa được chọn
        const newSelected = [...prev];
        chapterQuestionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      }
    });
  };

  const handleSelectAllQuestions = () => {
    if (!allQuestions) return;
    
    if (selectedQuestions.length === allQuestions.length) {
      // Nếu tất cả đã được chọn thì bỏ chọn tất cả
      setSelectedQuestions([]);
    } else {
      // Nếu chưa thì chọn tất cả
      setSelectedQuestions(allQuestions.map(q => q.id));
    }
  };

  const handleDeleteSelectedQuestions = () => {
    if (selectedQuestions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một câu hỏi để xóa');
      return;
    }
    setIsDeleteSelectedDialogOpen(true);
  };

  const confirmDeleteSelectedQuestions = () => {
    if (selectedQuestions.length > 0) {
      deleteSelectedQuestionsMutation.mutate(selectedQuestions);
    }
  };

  const handleAccordionChange = (value: string) => {
    setExpandedChapters(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleFilterChange = (value: string) => {
    setFilterChapter(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi sắp xếp
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số item mỗi trang
  };

  const handleViewModeChange = (mode: "grouped" | "list" | "grid") => {
    setViewMode(mode);
  };

  const toggleStats = () => {
    if (!isStatsOpen && allQuestions) {
      calculateStats(allQuestions);
    }
    setIsStatsOpen(!isStatsOpen);
  };

  const calculateStats = (questions: Question[]) => {
    // Tính toán thống kê
    const newStats = {
      totalQuestions: questions.length,
      questionsPerChapter: {} as { [key: string]: number },
      correctAnswerDistribution: { A: 0, B: 0, C: 0, D: 0 },
    };

    questions.forEach(q => {
      const chapterId = q.chapter_id.toString();
      newStats.questionsPerChapter[chapterId] = (newStats.questionsPerChapter[chapterId] || 0) + 1;
      
      const ans = q.correct_answer as 'A' | 'B' | 'C' | 'D';
      newStats.correctAnswerDistribution[ans] += 1;
    });

    setStats(newStats);
  };

  // Chuẩn bị danh sách câu hỏi đã lọc, tìm kiếm và sắp xếp
  const prepareQuestions = () => {
    if (!allQuestions) return { filteredQuestions: [], paginatedQuestions: [], totalPages: 0 };

    // 1. Lọc câu hỏi
    let filteredQuestions = [...allQuestions];

    // Lọc theo chương
    if (filterChapter !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.chapter_id.toString() === filterChapter);
    }

    // Tìm kiếm
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.question_text.toLowerCase().includes(search) ||
        q.option_a.toLowerCase().includes(search) ||
        q.option_b.toLowerCase().includes(search) ||
        q.option_c.toLowerCase().includes(search) ||
        q.option_d.toLowerCase().includes(search)
      );
    }

    // 2. Sắp xếp câu hỏi
    filteredQuestions.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case 'id':
          valueA = a.id;
          valueB = b.id;
          break;
        case 'question_text':
          valueA = a.question_text;
          valueB = b.question_text;
          break;
        case 'chapter_id':
          valueA = a.chapter_id;
          valueB = b.chapter_id;
          break;
        case 'correct_answer':
          valueA = a.correct_answer;
          valueB = b.correct_answer;
          break;
        default:
          valueA = a.id;
          valueB = b.id;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });

    // 3. Phân trang
    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

    return { filteredQuestions, paginatedQuestions, totalPages };
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
  const isSubmitting = addQuestionMutation.isPending || updateQuestionMutation.isPending || deleteQuestionMutation.isPending || deleteAllQuestionsMutation.isPending || deleteSelectedQuestionsMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chuẩn bị dữ liệu
  const { filteredQuestions, paginatedQuestions, totalPages } = prepareQuestions();
  const pagesToShow = 5; // Số trang hiển thị trong phân trang

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý ngân hàng câu hỏi</h2>
        <div className="flex gap-4">
          <Button 
            onClick={toggleStats} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart2 size={16} />
            Thống kê
          </Button>
          
          <Button 
            onClick={handleOpenAIAssistant} 
            disabled={!selectedCourse || isSubmitting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Trợ lý EduAI
          </Button>
          
          <Button 
            onClick={handleDeleteSelectedQuestions} 
            disabled={!selectedCourse || isSubmitting || selectedQuestions.length === 0}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Xóa đã chọn ({selectedQuestions.length})
          </Button>
          
          <Button 
            onClick={handleDeleteAllQuestions} 
            disabled={!selectedCourse || isSubmitting}
            variant="destructive"
            className="flex items-center gap-2"
          >
            Xóa tất cả câu hỏi
          </Button>
          
          <Button onClick={handleAddQuestion} disabled={!selectedCourse || isSubmitting}>
            Thêm câu hỏi mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Chọn khóa học</CardTitle>
            <CardDescription>Chọn khóa học để quản lý câu hỏi</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {selectedCourse && chapters && (
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Lọc theo chương</CardTitle>
              <CardDescription>Hiển thị câu hỏi theo chương học</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={filterChapter} 
                onValueChange={handleFilterChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chương" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các chương</SelectItem>
                  {chapters?.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id.toString()}>
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Tìm kiếm</CardTitle>
            <CardDescription>Tìm kiếm câu hỏi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {isStatsOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thống kê câu hỏi</CardTitle>
            <CardDescription>Tổng quan về ngân hàng câu hỏi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalQuestions}</div>
                <div className="text-sm text-blue-800 mt-1">Tổng số câu hỏi</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Phân bố đáp án đúng</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.correctAnswerDistribution.A}</div>
                    <div className="text-xs">A</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.correctAnswerDistribution.B}</div>
                    <div className="text-xs">B</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.correctAnswerDistribution.C}</div>
                    <div className="text-xs">C</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.correctAnswerDistribution.D}</div>
                    <div className="text-xs">D</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                <div className="text-sm font-medium mb-2">Số câu hỏi theo chương</div>
                <div className="grid grid-cols-2 gap-2">
                  {chapters?.map(chapter => (
                    <div key={chapter.id} className="flex justify-between items-center">
                      <span className="truncate">{chapter.title}:</span>
                      <span className="font-bold text-purple-600">{stats.questionsPerChapter[chapter.id.toString()] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="select-all"
              checked={allQuestions?.length === selectedQuestions.length && allQuestions?.length > 0}
              onChange={handleSelectAllQuestions}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="select-all" className="font-medium">Chọn tất cả</label>
            {selectedQuestions.length > 0 && (
              <Badge variant="outline" className="ml-2">
                Đã chọn: {selectedQuestions.length} câu hỏi
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Hiển thị:</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === "grouped" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-none px-3"
                onClick={() => handleViewModeChange("grouped")}
              >
                <Book size={16} />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-none px-3"
                onClick={() => handleViewModeChange("list")}
              >
                <FileQuestion size={16} />
              </Button>
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-none px-3"
                onClick={() => handleViewModeChange("grid")}
              >
                <BarChart2 size={16} />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-1" /> 
                  Sắp xếp
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSortChange('id')}>
                  ID {sortField === 'id' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-2" /> : <SortDesc size={14} className="ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('question_text')}>
                  Nội dung câu hỏi {sortField === 'question_text' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-2" /> : <SortDesc size={14} className="ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('chapter_id')}>
                  Chương {sortField === 'chapter_id' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-2" /> : <SortDesc size={14} className="ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('correct_answer')}>
                  Đáp án đúng {sortField === 'correct_answer' && (sortOrder === 'asc' ? <SortAsc size={14} className="ml-2" /> : <SortDesc size={14} className="ml-2" />)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {selectedCourse && (
          <>
            {viewMode === "grouped" && (
              <Accordion 
                type="multiple" 
                value={expandedChapters}
                onValueChange={(values) => {
                  if (Array.isArray(values)) {
                    setExpandedChapters(values);
                  }
                }}
                className="w-full"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`select-all`}
                      checked={allQuestions?.length === selectedQuestions.length && allQuestions?.length > 0}
                      onChange={handleSelectAllQuestions}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`select-all`} className="font-medium">Chọn tất cả</label>
                  </div>
                  {selectedQuestions.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      Đã chọn: {selectedQuestions.length} câu hỏi
                    </Badge>
                  )}
                </div>
                {Object.values(groupedQuestions[selectedCourse]?.chapters || {}).map(({ chapter, questions }) => (
                  <AccordionItem key={chapter.id} value={chapter.id.toString()}>
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`chapter-${chapter.id}`}
                            checked={questions.length > 0 && questions.every(q => selectedQuestions.includes(q.id))}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectAllQuestionsInChapter(chapter.id, questions);
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />   
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
                                  <div className="flex items-start gap-2">
                                    <input
                                      type="checkbox"
                                      id={`question-${question.id}`}
                                      checked={selectedQuestions.includes(question.id)}
                                      onChange={() => handleToggleSelectQuestion(question.id)}
                                      className="h-4 w-4 mt-1.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <h4 className="font-medium text-lg">{question.question_text}</h4>
                                  </div>
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
            )}

            {viewMode === "list" && (
              <div className="divide-y">
                {paginatedQuestions.length > 0 ? (
                  paginatedQuestions.map((question) => {
                    const chapter = chapters?.find(c => c.id === question.chapter_id);
                    return (
                      <div key={question.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between mb-3">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={`list-question-${question.id}`}
                              checked={selectedQuestions.includes(question.id)}
                              onChange={() => handleToggleSelectQuestion(question.id)}
                              className="h-4 w-4 mt-1.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex flex-col">
                              <h4 className="font-medium text-lg">{question.question_text}</h4>
                              <span className="text-sm text-gray-500">
                                {chapter ? `Chương: ${chapter.title}` : 'Chương không xác định'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="mr-2">
                              Đáp án đúng: {question.correct_answer}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                                  <Edit size={14} className="mr-2" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteQuestion(question)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 size={14} className="mr-2" /> Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <span className="font-medium">A.</span> {question.option_a}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <span className="font-medium">B.</span> {question.option_b}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <span className="font-medium">C.</span> {question.option_c}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <span className="font-medium">D.</span> {question.option_d}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery.trim() ? "Không tìm thấy câu hỏi nào khớp với tìm kiếm của bạn." : "Không có câu hỏi nào."}
                  </div>
                )}
              </div>
            )}

            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {paginatedQuestions.length > 0 ? (
                  paginatedQuestions.map((question) => {
                    const chapter = chapters?.find(c => c.id === question.chapter_id);
                    return (
                      <Card key={question.id} className="border border-gray-200 h-full">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`grid-question-${question.id}`}
                                checked={selectedQuestions.includes(question.id)}
                                onChange={() => handleToggleSelectQuestion(question.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Badge variant="outline">Q-{question.id}</Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                                  <Edit size={14} className="mr-2" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteQuestion(question)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 size={14} className="mr-2" /> Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardTitle className="text-base mt-2">{question.question_text}</CardTitle>
                          <CardDescription>
                            Chương: {chapter?.title || 'Không xác định'} | Đáp án đúng: {question.correct_answer}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 gap-2">
                            <div className={`p-2 rounded text-sm ${question.correct_answer === 'A' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                              <span className="font-medium">A.</span> {question.option_a}
                            </div>
                            <div className={`p-2 rounded text-sm ${question.correct_answer === 'B' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                              <span className="font-medium">B.</span> {question.option_b}
                            </div>
                            <div className={`p-2 rounded text-sm ${question.correct_answer === 'C' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                              <span className="font-medium">C.</span> {question.option_c}
                            </div>
                            <div className={`p-2 rounded text-sm ${question.correct_answer === 'D' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                              <span className="font-medium">D.</span> {question.option_d}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500 col-span-full">
                    {searchQuery.trim() ? "Không tìm thấy câu hỏi nào khớp với tìm kiếm của bạn." : "Không có câu hỏi nào."}
                  </div>
                )}
              </div>
            )}

            {(viewMode === "list" || viewMode === "grid") && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredQuestions.length)}</span> trong tổng số <span className="font-medium">{filteredQuestions.length}</span> câu hỏi
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-l-md"
                      >
                        Trước
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        // Hiển thị các trang xung quanh trang hiện tại
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages || 
                          (pageNumber >= currentPage - Math.floor(pagesToShow / 2) && 
                           pageNumber <= currentPage + Math.floor(pagesToShow / 2))
                        ) {
                          return (
                            <Button
                              key={i}
                              variant={pageNumber === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              className="rounded-none"
                            >
                              {pageNumber}
                            </Button>
                          );
                        } else if (
                          pageNumber === currentPage - Math.floor(pagesToShow / 2) - 1 ||
                          pageNumber === currentPage + Math.floor(pagesToShow / 2) + 1
                        ) {
                          // Hiển thị dấu ... khi có nhảy trang
                          return <Button key={i} variant="outline" size="sm" disabled className="rounded-none">...</Button>;
                        }
                        return null;
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-r-md"
                      >
                        Sau
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tất cả câu hỏi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tất cả câu hỏi trong khóa học này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAllQuestions} 
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAllQuestionsMutation.isPending}
            >
              {deleteAllQuestionsMutation.isPending ? 'Đang xóa...' : 'Xóa tất cả'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteSelectedDialogOpen} onOpenChange={setIsDeleteSelectedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu hỏi đã chọn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedQuestions.length} câu hỏi đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSelectedQuestions} 
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteSelectedQuestionsMutation.isPending}
            >
              {deleteSelectedQuestionsMutation.isPending ? 'Đang xóa...' : 'Xóa đã chọn'}
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
                          <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            A. {question.option_a}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            B. {question.option_b}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            C. {question.option_c}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
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