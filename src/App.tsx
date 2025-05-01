import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import DocsPage from "./pages/DocsPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";
import CourseContent from "@/pages/CourseContent";
import QuestionBank from "./components/QuestionBank";
import ExamPage from "./pages/ExamPage";
import ExamResultPage from "./pages/ExamResultPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
// Tạo QueryClient mới
const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/khoa-hoc" element={<CoursesPage />} />
            <Route path="/khoa-hoc/:courseId" element={<CourseDetailPage />} />
            <Route path="/khoa-hoc/:courseId/bai-hoc/:lessonId" element={<LessonPage />} />
            <Route path="/khoa-hoc/:courseId/thi" element={<ExamPage />} />
            <Route path="/khoa-hoc/:courseId/ket-qua" element={<ExamResultPage />} />
            <Route path="/tai-lieu" element={<DocsPage />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/thanh-toan" element={<PaymentPage />} />
            <Route path="/khoa-hoc/:courseId/noi-dung" element={<CourseContent />} />
            <Route path="/khoa-hoc/:courseId/cau-hoi" element={<QuestionBank />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
