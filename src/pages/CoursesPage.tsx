import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import NavBar from "@/components/componentsforpages/NavBar";
import Footer from "@/components/componentsforpages/Footer";
import ChatBox from "@/components/componentsforpages/ChatBox";
import CourseCard from "@/components/componentsforpages/CourseCard";
import { Input } from "@/components/ui/input";

// Định nghĩa interface cho dữ liệu khóa học từ API
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

const API_URL = 'http://localhost:3000/api';

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dữ liệu khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/courses/`);
        
        if (!response.ok) {
          throw new Error("Không thể tải danh sách khóa học");
        }
        
        const data = await response.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải khóa học:", err);
        setError("Không thể tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Lọc khóa học theo searchTerm và chỉ hiển thị các khóa học có status='active'
  const filteredCourses = courses
    .filter((course) => course.status === 'active')
    .filter((course) => {
      return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             course.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 relative">
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 via-purple-500 via-pink-500 to-amber-400 bg-clip-text text-transparent drop-shadow-sm animate-text-shimmer">Khóa học</span>
              <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-cyan-500/30 via-blue-600/30 via-purple-500/20 via-pink-500/20 to-amber-400/20 rounded-lg -z-10 animate-pulse"></span>
            </h1>
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
          
          {loading ? (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">Đang tải danh sách khóa học...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="animate-enter" style={{ animationDelay: `${course.id * 0.1 % 1}s` }}>
                    <CourseCard 
                      id={String(course.id)}
                      title={course.title}
                      description={course.description}
                      image={course.thumbnail}
                      lessons={20} // Giá trị mặc định vì không có trong CSDL
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-gray-500">Không tìm thấy khóa học phù hợp với tiêu chí tìm kiếm.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default CoursesPage;
