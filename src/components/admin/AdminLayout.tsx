import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Users, Book, FileText, Settings, ChevronRight, GraduationCap, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminDashboard from "@/pages/AdminDashboard";
import CourseEditor from "@/components/admin/CourseEditor";
import { API_URL } from '../../config/api';

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
  path: string;
  description: string;
};

const menuItems: MenuItem[] = [
  {
    id: 'users',
    title: 'Quản lý người dùng',
    icon: <Users className="h-5 w-5" />,
    path: '/admin/users',
    description: 'Quản lý thông tin và trạng thái của người dùng'
  },
  {
    id: 'courses',
    title: 'Quản lý khóa học',
    icon: <GraduationCap className="h-5 w-5" />,
    path: '/admin/courses',
    description: 'Thêm, sửa, xóa và quản lý khóa học'
  },
  {
    id: 'questions',
    title: 'Quản lý câu ngân hàng hỏi',
    icon: <Book className="h-5 w-5" />,
    path: '/admin/questions',
    description: 'Thêm, sửa, xóa và quản lý câu hỏi'
  },
  {
    id: 'exams',
    title: 'Quản lý bài thi',
    icon: <FileText className="h-5 w-5" />,
    path: '/admin/exams',
    description: 'Tạo và quản lý các bài thi'
  },
  {
    id: 'documents',
    title: 'Quản lý tài liệu',
    icon: <File className="h-5 w-5" />,
    path: '/admin/documents',
    description: 'Quản lý tài liệu và tài nguyên học tập'
  }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string>('users');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin-login');
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
        navigate('/admin-login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    // Xác định activeMenu dựa trên đường dẫn hiện tại
    const path = location.pathname;
    if (path.includes('/admin/courses/edit/')) {
      setActiveMenu('courses');
    } else {
      const foundItem = menuItems.find(item => path.includes(item.path));
      if (foundItem) {
        setActiveMenu(foundItem.id);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Đăng xuất thành công');
    navigate('/admin-login');
  };
  
  const handleMenuClick = (item: MenuItem) => {
    setActiveMenu(item.id);
    navigate(item.path);
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
                    onClick={() => handleMenuClick(item)}
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
          <Routes>
            <Route path="/" element={<Navigate to="/admin/users" replace />} />
            <Route path="/users" element={<AdminDashboard activeTab="users" />} />
            <Route path="/courses" element={<AdminDashboard activeTab="courses" />} />
            <Route path="/courses/edit/:courseId" element={<CourseEditor />} />
            <Route path="/questions" element={<AdminDashboard activeTab="questions" />} />
            <Route path="/exams" element={<AdminDashboard activeTab="exams" />} />
            <Route path="/documents" element={<AdminDashboard activeTab="documents" />} />
            <Route path="*" element={<Navigate to="/admin/users" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 