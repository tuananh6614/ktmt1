
import { useState } from "react";
import { Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample courses data with better images
  const allCourses = [
    {
      id: "1",
      title: "Vi điều khiển STM32",
      description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 24,
      category: "vi-dieu-khien",
      progress: 75,
    },
    {
      id: "2",
      title: "Điện tử số",
      description: "Tổng quan về kỹ thuật điện tử số và thiết kế mạch",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 18,
      category: "dien-tu-so",
    },
    {
      id: "3",
      title: "Xử lý tín hiệu số",
      description: "Các phương pháp xử lý tín hiệu số trong thực tế",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 30,
      category: "xu-ly-tin-hieu",
      progress: 35,
    },
    {
      id: "4",
      title: "IoT và ứng dụng",
      description: "Phát triển các ứng dụng IoT với Arduino và ESP8266",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 22,
      category: "iot",
      progress: 10,
    },
    {
      id: "5",
      title: "Kỹ thuật phân tích mạch điện",
      description: "Phương pháp phân tích và thiết kế mạch điện từ cơ bản đến phức tạp",
      image: "/lovable-uploads/4ec8d887-3792-433e-bb58-7792ac0a36ea.png",
      lessons: 20,
      category: "dien-tu-so",
    },
    {
      id: "6",
      title: "Lập trình nhúng với ARM Cortex-M",
      description: "Kiến thức chuyên sâu về lập trình nhúng sử dụng kiến trúc ARM Cortex-M",
      image: "/lovable-uploads/0ac03c84-f242-4aab-b5d7-712426f58932.png",
      lessons: 28,
      category: "vi-dieu-khien",
    },
    {
      id: "7",
      title: "Thiết kế PCB chuyên nghiệp",
      description: "Quy trình thiết kế và sản xuất PCB trong thực tế công nghiệp",
      image: "https://images.unsplash.com/photo-1557858310-9052820906f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 15,
      category: "thiet-ke",
    },
    {
      id: "8",
      title: "FPGA và VHDL",
      description: "Thiết kế số sử dụng FPGA và ngôn ngữ mô tả phần cứng VHDL",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      lessons: 26,
      category: "dien-tu-so",
    },
  ];
  
  const filteredCourses = allCourses.filter((course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium bg-clip-text text-transparent drop-shadow-sm">Khóa học</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các khóa học chất lượng cao về Điện tử và Kỹ thuật máy tính, được biên soạn bởi đội ngũ chuyên gia hàng đầu
            </p>
          </div>

          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-scale-in">
              <div className="relative flex-grow mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Tìm kiếm khóa học..." 
                  className="pl-10 border-2 border-dtktmt-blue-light/30 focus:border-dtktmt-blue-medium transition-all duration-300 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} className="animate-enter" style={{ animationDelay: `${parseInt(course.id) * 0.1}s` }}>
                  <CourseCard {...course} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-500">Không tìm thấy khóa học phù hợp với tiêu chí tìm kiếm.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default CoursesPage;
