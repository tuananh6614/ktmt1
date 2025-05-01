import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Book, FileText, Settings, ChevronRight, GraduationCap, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_URL = 'http://localhost:3000/api';

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  school: string;
  status: 'active' | 'inactive';
  role: string;
  created_at: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

  useEffect(() => {
    if (activeMenu === 'users') {
      fetchUsers();
    }
  }, [activeMenu]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái');
      }

      const user = users.find(u => u.id === userId);
      if (user) {
        toast.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản của ${user.full_name}`);
      } else {
        toast.success('Cập nhật trạng thái thành công');
      }
      
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa tài khoản');
      }

      const user = users.find(u => u.id === userId);
      if (user) {
        toast.success(`Đã xóa tài khoản của ${user.full_name}`);
      } else {
        toast.success('Xóa tài khoản thành công');
      }
      
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Lỗi khi xóa tài khoản');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Đăng xuất thành công');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'users':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Thêm người dùng</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trường</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">
                                    {user.full_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">Đăng ký: {new Date(user.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.school}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleUpdateStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  user.status === 'active'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${user.full_name}?`)) {
                                    handleDeleteUser(user.id);
                                  }
                                }}
                                className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý khóa học</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Danh sách khóa học</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Thêm khóa học mới
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khóa học</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Dữ liệu khóa học sẽ được thêm vào đây */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Khóa học mẫu</td>
                      <td className="px-6 py-4">Mô tả khóa học mẫu</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đang hoạt động
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Sửa</button>
                        <button className="text-red-600 hover:text-red-900">Xóa</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
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