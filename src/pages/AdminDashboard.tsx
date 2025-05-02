import { useState } from "react";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import QuestionManagement from "@/components/admin/QuestionManagement";
import ExamManagement from "@/components/admin/ExamManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";

interface AdminDashboardProps {
  activeTab?: string;
}

const AdminDashboard = ({ activeTab = 'users' }: AdminDashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'questions':
        return <QuestionManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'documents':
        return <DocumentManagement />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard; 