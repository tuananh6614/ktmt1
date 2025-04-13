
import { useState } from "react";
import { Search, BookOpen, Clock, Award, Filter } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Sample courses data
  const allCourses = [
    {
      id: "1",
      title: "Vi điều khiển STM32",
      description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao",
      image: "/placeholder.svg",
      lessons: 24,
      duration: "12 tuần",
      level: "Trung cấp",
      category: "vi-dieu-khien",
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
      category: "dien-tu-so",
    },
    {
      id: "3",
      title: "Xử lý tín hiệu số",
      description: "Các phương pháp xử lý tín hiệu số trong thực tế",
      image: "/placeholder.svg",
      lessons: 30,
      duration: "16 tuần",
      level: "Nâng cao",
      category: "xu-ly-tin-hieu",
      progress: 35,
    },
    {
      id: "4",
      title: "IoT và ứng dụng",
      description: "Phát triển các ứng dụng IoT với Arduino và ESP8266",
      image: "/placeholder.svg",
      lessons: 22,
      duration: "10 tuần",
      level: "Trung cấp",
      category: "iot",
      progress: 10,
    },
    {
      id: "5",
      title: "Kỹ thuật phân tích mạch điện",
      description: "Phương pháp phân tích và thiết kế mạch điện từ cơ bản đến phức tạp",
      image: "/placeholder.svg",
      lessons: 20,
      duration: "10 tuần",
      level: "Cơ bản",
      category: "dien-tu-so",
    },
    {
      id: "6",
      title: "Lập trình nhúng với ARM Cortex-M",
      description: "Kiến thức chuyên sâu về lập trình nhúng sử dụng kiến trúc ARM Cortex-M",
      image: "/placeholder.svg",
      lessons: 28,
      duration: "14 tuần",
      level: "Nâng cao",
      category: "vi-dieu-khien",
    },
    {
      id: "7",
      title: "Thiết kế PCB chuyên nghiệp",
      description: "Quy trình thiết kế và sản xuất PCB trong thực tế công nghiệp",
      image: "/placeholder.svg",
      lessons: 15,
      duration: "8 tuần",
      level: "Trung cấp",
      category: "thiet-ke",
    },
    {
      id: "8",
      title: "FPGA và VHDL",
      description: "Thiết kế số sử dụng FPGA và ngôn ngữ mô tả phần cứng VHDL",
      image: "/placeholder.svg",
      lessons: 26,
      duration: "13 tuần",
      level: "Nâng cao",
      category: "dien-tu-so",
    },
  ];
  
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "vi-dieu-khien", name: "Vi điều khiển" },
    { id: "dien-tu-so", name: "Điện tử số" },
    { id: "xu-ly-tin-hieu", name: "Xử lý tín hiệu" },
    { id: "iot", name: "IoT" },
    { id: "thiet-ke", name: "Thiết kế" },
  ];
  
  const levels = ["Cơ bản", "Trung cấp", "Nâng cao"];
  
  const filteredCourses = (category: string) => {
    return allCourses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === "all" || course.category === category;
      
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark">Khóa học</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các khóa học chất lượng cao về Điện tử và Kỹ thuật máy tính, được biên soạn bởi đội ngũ chuyên gia hàng đầu
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Tìm kiếm khóa học..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-dtktmt-blue-medium" />
              <span className="text-sm font-medium">Cấp độ:</span>
              {levels.map((level) => (
                <Button 
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className={`text-sm ${selectedLevel === level ? 'bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark' : ''}`}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full flex overflow-x-auto mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex-1">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses(category.id).length > 0 ? (
                    filteredCourses(category.id).map((course) => (
                      <CourseCard key={course.id} {...course} />
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center">
                      <p className="text-gray-500">Không tìm thấy khóa học phù hợp với tiêu chí tìm kiếm.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default CoursesPage;
