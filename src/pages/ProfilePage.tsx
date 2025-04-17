import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import DocumentCard from "@/components/DocumentCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TestResults from "@/components/profile/TestResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Star } from "lucide-react";

const ProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
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
          <ProfileHeader user={user} />

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
              <TestResults results={testResults} />
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
