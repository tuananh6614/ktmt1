import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Book, FileText, Settings, ChevronRight, GraduationCap, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";

const API_URL = 'http://localhost:3000/api';

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

type MenuItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

const menuItems: MenuItem[] = [
  {
    id: 'users',
    title: 'Quản lý người dùng',
    icon: <Users className="h-5 w-5" />,
    description: 'Quản lý thông tin và trạng thái của người dùng'
  },
  {
    id: 'courses',
    title: 'Quản lý khóa học',
    icon: <GraduationCap className="h-5 w-5" />,
    description: 'Thêm, sửa, xóa và quản lý khóa học'
  },
  {
    id: 'questions',
    title: 'Quản lý câu hỏi',
    icon: <Book className="h-5 w-5" />,
    description: 'Thêm, sửa, xóa và quản lý câu hỏi'
  },
  {
    id: 'exams',
    title: 'Quản lý bài thi',
    icon: <FileText className="h-5 w-5" />,
    description: 'Tạo và quản lý các bài thi'
  },
  {
    id: 'documents',
    title: 'Quản lý tài liệu',
    icon: <File className="h-5 w-5" />,
    description: 'Quản lý tài liệu và tài nguyên học tập'
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string>('users');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể truy cập dashboard');
        }

        const data = await response.json();
        setAdminUser(data.user);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Lỗi khi tải dữ liệu admin');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Đăng xuất thành công');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'questions':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý câu hỏi</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {/* Nội dung quản lý câu hỏi sẽ được thêm vào đây */}
              <p>Danh sách câu hỏi sẽ hiển thị ở đây</p>
            </div>
          </div>
        );
      case 'exams':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý bài thi</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {/* Nội dung quản lý bài thi sẽ được thêm vào đây */}
              <p>Danh sách bài thi sẽ hiển thị ở đây</p>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý tài liệu</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Danh sách tài liệu</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Thêm tài liệu mới
                </Button>
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Xin chào, {adminUser?.full_name}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      activeMenu === item.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform ${
                      activeMenu === item.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 