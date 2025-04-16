
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import DocumentCard from "@/components/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Settings, Clock, BookOpen, FileText, Award, 
  Edit, Save, LogOut, Star, Activity, Check, X 
} from "lucide-react";

const ProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Sample user data
  const user = {
    name: "Nguyễn Văn Anh",
    role: "Học sinh/ sinh viên",
    email: "anhnguyen@example.com",
    phone: "0987654321",
    school: "Trường Đại học Bách Khoa TP.HCM",
    image: "/placeholder.svg",
    joined: "01/01/2023",
    stats: {
      coursesCompleted: 5,
      coursesInProgress: 2,
      documentsPurchased: 3,
      avgScore: 85,
    },
  };
  
  // Sample courses data
  const myCourses = [
    {
      id: "1",
      title: "Vi điều khiển STM32",
      description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao",
      image: "/placeholder.svg",
      lessons: 24,
      duration: "12 tuần",
      level: "Trung cấp",
      progress: 75,
    },
    {
      id: "2",
      title: "Điện tử số",
      description: "Tổng quan về kỹ thuật điện tử số và thiết kế mạch",
      image: "/placeholder.svg",
      lessons: 18,
      duration: "8 tuần",
      level: "Cơ bản",
      progress: 100,
    },
    {
      id: "3",
      title: "Xử lý tín hiệu số",
      description: "Các phương pháp xử lý tín hiệu số trong thực tế",
      image: "/placeholder.svg",
      lessons: 30,
      duration: "16 tuần",
      level: "Nâng cao",
      progress: 35,
    },
  ];
  
  // Sample documents data
  const myDocuments = [
    {
      id: "1",
      title: "Cấu trúc máy tính",
      description: "Tài liệu về kiến trúc và tổ chức máy tính",
      image: "/placeholder.svg",
      price: 150000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
    {
      id: "2",
      title: "Tài liệu thực hành VHDL",
      description: "Bộ bài tập và giải pháp cho VHDL",
      image: "/placeholder.svg",
      price: 180000,
      fileType: "docx",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
    {
      id: "3",
      title: "Vi điều khiển ARM Cortex-M4",
      description: "Tài liệu tham khảo cho lập trình ARM Cortex-M4",
      image: "/placeholder.svg",
      price: 200000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      isPurchased: true,
    },
  ];

  // Sample test results
  const testResults = [
    {
      id: "1",
      title: "Kiểm tra Vi điều khiển STM32",
      date: "20/05/2023",
      score: 95,
      total: 100,
    },
    {
      id: "2",
      title: "Kiểm tra Điện tử số - Chương 1",
      date: "15/02/2023",
      score: 88,
      total: 100,
    },
    {
      id: "3",
      title: "Kiểm tra Điện tử số - Chương 2",
      date: "02/03/2023",
      score: 75,
      total: 100,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium relative">
              <div className="absolute -bottom-16 left-8 flex items-end">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 mb-4">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-white/90">{user.role}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? (
                    <><X size={16} className="mr-1" /> Hủy</>
                  ) : (
                    <><Edit size={16} className="mr-1" /> Chỉnh sửa</>
                  )}
                </Button>
                {isEditingProfile && (
                  <Button 
                    className="bg-dtktmt-blue-dark hover:bg-dtktmt-blue-dark/80"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    <Save size={16} className="mr-1" /> Lưu
                  </Button>
                )}
                <Button variant="destructive">
                  <LogOut size={16} className="mr-1" /> Đăng xuất
                </Button>
              </div>
            </div>
            
            <div className="pt-20 pb-6 px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <User size={18} className="text-dtktmt-blue-medium mr-2" />
                    Thông tin cá nhân
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Email</label>
                      {isEditingProfile ? (
                        <Input defaultValue={user.email} />
                      ) : (
                        <p>{user.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Số điện thoại</label>
                      {isEditingProfile ? (
                        <Input defaultValue={user.phone} />
                      ) : (
                        <p>{user.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Trường/Cơ quan</label>
                      {isEditingProfile ? (
                        <Input defaultValue={user.school} />
                      ) : (
                        <p>{user.school}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Ngày tham gia</label>
                      <p>{user.joined}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <Activity size={18} className="text-dtktmt-pink-medium mr-2" />
                    Thống kê học tập
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dtktmt-blue-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
                      <BookOpen size={24} className="text-dtktmt-blue-medium mb-2" />
                      <p className="text-xl font-bold">{user.stats.coursesCompleted}</p>
                      <p className="text-sm text-gray-600">Khóa học đã hoàn thành</p>
                    </div>
                    
                    <div className="bg-dtktmt-pink-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
                      <Clock size={24} className="text-dtktmt-pink-medium mb-2" />
                      <p className="text-xl font-bold">{user.stats.coursesInProgress}</p>
                      <p className="text-sm text-gray-600">Khóa học đang học</p>
                    </div>
                    
                    <div className="bg-dtktmt-purple-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
                      <FileText size={24} className="text-dtktmt-purple-medium mb-2" />
                      <p className="text-xl font-bold">{user.stats.documentsPurchased}</p>
                      <p className="text-sm text-gray-600">Tài liệu đã mua</p>
                    </div>
                    
                    <div className="bg-dtktmt-yellow/30 p-4 rounded-lg flex flex-col items-center justify-center">
                      <Award size={24} className="text-dtktmt-blue-dark mb-2" />
                      <p className="text-xl font-bold">{user.stats.avgScore}</p>
                      <p className="text-sm text-gray-600">Điểm trung bình</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Khóa học của tôi</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Tài liệu của tôi</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <Star size={16} />
                <span>Kết quả kiểm tra</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDocuments.map((document) => (
                  <DocumentCard key={document.id} {...document} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tests">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-dtktmt-blue-light/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Bài kiểm tra
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Ngày làm bài
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Điểm số
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testResults.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-700">{test.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test.score}/{test.total}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.score >= 70 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check size={12} className="mr-1" />
                                Đạt
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <X size={12} className="mr-1" />
                                Không đạt
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default ProfilePage;
