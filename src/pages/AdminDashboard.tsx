import { useState } from "react";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import QuestionManagement from "@/components/admin/QuestionManagement";
import ExamManagement from "@/components/admin/ExamManagement";

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
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý tài liệu</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Danh sách tài liệu</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Thêm tài liệu mới
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tài liệu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Dữ liệu tài liệu sẽ được thêm vào đây */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Tài liệu mẫu</td>
                      <td className="px-6 py-4 whitespace-nowrap">PDF</td>
                      <td className="px-6 py-4 whitespace-nowrap">2.5 MB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Tải xuống</button>
                        <button className="text-red-600 hover:text-red-900">Xóa</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
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