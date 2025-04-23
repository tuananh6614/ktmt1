import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, ArrowRight, Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import DocumentCard from "@/components/DocumentCard";
import { motion } from "framer-motion";
import FeaturedSection from "@/components/FeaturedSection";
import CoursePromoBanner from "@/components/CoursePromoBanner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const Index = () => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy danh sách khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/courses`);
        
        if (!response.ok) {
          throw new Error("Không thể tải danh sách khóa học");
        }
        
        const data = await response.json();
        // Chỉ lấy các khóa học active và giới hạn 6 khóa học
        const activeCourses = data
          .filter((course: Course) => course.status === 'active')
          .slice(0, 6);
          
        setPopularCourses(activeCourses);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-in-bottom");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const topDocuments = [
    {
      id: "1",
      title: "Tài liệu điện tử số",
      description: "Tất cả kiến thức cần thiết về điện tử số và thiết kế mạch logic",
      price: 120000,
      image: "/placeholder.svg",
      fileType: "pdf",
      preview: "https://example.com/preview/1",
    },
    {
      id: "2",
      title: "Vi điều khiển STM32 - Từ cơ bản đến nâng cao",
      description: "Tài liệu đầy đủ về lập trình vi điều khiển STM32F4",
      price: 180000,
      image: "/placeholder.svg",
      fileType: "pdf",
      preview: "https://example.com/preview/2",
    },
    {
      id: "3", 
      title: "Thiết kế mạch với Altium Designer",
      description: "Hướng dẫn chi tiết từng bước thiết kế PCB chuyên nghiệp",
      price: 150000,
      image: "/placeholder.svg",
      fileType: "pdf",
      preview: "https://example.com/preview/3",
    }
  ];

  const testimonials = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      course: "Vi điều khiển STM32",
      comment: "Khóa học rất chi tiết và dễ hiểu. Tôi đã học được rất nhiều kiến thức mới và áp dụng thành công trong dự án của mình.",
      avatar: "/placeholder.svg",
      rating: 5,
    },
    {
      id: "2",
      name: "Trần Thị B",
      course: "IoT và ứng dụng",
      comment: "Tài liệu hướng dẫn rất hay, giảng viên nhiệt tình. Đã giúp tôi hoàn thành dự án IoT của mình với thời gian ngắn hơn dự kiến.",
      avatar: "/placeholder.svg",
      rating: 5,
    },
    {
      id: "3",
      name: "Lê Văn C",
      course: "Điện tử số",
      comment: "Nội dung cập nhật với công nghệ mới nhất, bài tập thực hành rất bổ ích. Tôi đã tự tin thiết kế mạch số sau khi hoàn thành khóa học.",
      avatar: "/placeholder.svg",
      rating: 4,
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 pt-6">
          <FeaturedSection />

          {/* Khóa học nổi bật */}
          <motion.section 
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex justify-between items-center mb-8">
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl md:text-3xl font-bold text-dtktmt-blue-dark mb-2">
                  <span className="gradient-text">Khóa học</span> nổi bật
                </h2>
                <p className="text-gray-500">Những khóa học được sinh viên yêu thích nhất</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link
                  to="/khoa-hoc"
                  className="neo-button text-white flex items-center gap-2 text-sm"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải khóa học...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {popularCourses.map((course) => (
                    <CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <CourseCard 
                        id={String(course.id)}
                        title={course.title}
                        description={course.description}
                        image={course.thumbnail}
                        lessons={20} // Giá trị mặc định vì không có trong CSDL
                        duration="10 tuần" // Giá trị mặc định
                        level="Cơ bản" // Giá trị mặc định
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end mt-4 gap-2">
                  <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full hover:bg-dtktmt-blue-medium hover:text-white border-dtktmt-blue-medium" />
                  <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full hover:bg-dtktmt-blue-medium hover:text-white border-dtktmt-blue-medium" />
                </div>
              </Carousel>
            )}

            <div className="mt-10 text-center">
              <Link 
                to="/khoa-hoc" 
                className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark text-white px-8 py-3 rounded-full inline-flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
              >
                <span>Khám phá tất cả khóa học</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.section>

          {/* Tài liệu bán chạy */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex justify-between items-center mb-8">
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl md:text-3xl font-bold text-dtktmt-blue-dark mb-2">
                  <span className="gradient-text">Tài liệu</span> bán chạy
                </h2>
                <p className="text-gray-500">Tài liệu học tập chất lượng cao</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link
                  to="/tai-lieu"
                  className="neo-button text-white flex items-center gap-2 text-sm"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
            >
              {topDocuments.map((doc) => (
                <motion.div key={doc.id} variants={fadeInUp}>
                  <DocumentCard {...doc} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Đánh giá từ sinh viên */}
          <motion.section
            className="py-16 px-6 md:px-10 bg-gradient-to-r from-dtktmt-blue-light/20 to-dtktmt-purple-light/20 rounded-3xl mb-16 shadow-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-dtktmt-blue-dark mb-3">
                <span className="gradient-text">Đánh giá</span> từ sinh viên
              </h2>
              <p className="text-gray-600">Những trải nghiệm thực tế từ các sinh viên đã tham gia các khóa học</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  variants={fadeInUp}
                  custom={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative"
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-full flex items-center justify-center text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" className="opacity-75">
                      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                    </svg>
                  </div>
                  
                  <p className="text-gray-600 mb-6 mt-4 italic">{testimonial.comment}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-dtktmt-blue-light flex items-center justify-center">
                      <span className="text-xl font-bold text-dtktmt-blue-dark">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-dtktmt-blue-dark">{testimonial.name}</h3>
                      <p className="text-xs text-gray-500">{testimonial.course}</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < testimonial.rating ? "text-dtktmt-yellow fill-dtktmt-yellow" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            className="py-12 px-6 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white rounded-3xl mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-md"
                variants={fadeInUp}
              >
                Sẵn sàng bắt đầu hành trình học tập?
              </motion.h2>
              <motion.p 
                className="mb-8 text-white/90 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng và khóa học trên DT&KTMT1.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                variants={fadeInUp}
              >
                <Link
                  to="/register"
                  className="bg-white text-dtktmt-blue-dark hover:bg-dtktmt-blue-light hover:text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Đăng ký ngay
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-dtktmt-blue-dark px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default Index;
