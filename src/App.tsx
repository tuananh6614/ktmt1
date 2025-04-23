
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import ChapterDetail from "./pages/ChapterDetail";
import ChapterQuiz from "./pages/ChapterQuiz";
import DocsPage from "./pages/DocsPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";

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
            <Route path="/khoa-hoc/:courseId" element={<CourseDetail />} />
            <Route path="/khoa-hoc/:courseId/chuong/:chapterId" element={<ChapterDetail />} />
            <Route path="/khoa-hoc/:courseId/chuong/:chapterId/quiz" element={<ChapterQuiz />} />
            <Route path="/tai-lieu" element={<DocsPage />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="thanh-toan" element={<PaymentPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
