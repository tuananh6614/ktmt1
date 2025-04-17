import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Award, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import DocumentCard from "@/components/DocumentCard";
import { motion } from "framer-motion";
import FeaturedSection from "@/components/FeaturedSection";

const Index = () => {
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

  const popularCourses = [
    {
      id: "1",
      title: "Lập trình nhúng với ARM Cortex-M",
      description: "Kiến thức chuyên sâu về lập trình nhúng sử dụng kiến trúc ARM Cortex-M",
      image: "/lovable-uploads/47f9d951-4fcc-4c74-a8c6-618391ab6fcd.png",
      lessons: 28,
      duration: "14 tuần",
      level: "Trung cấp",
    },
    {
      id: "2",
      title: "Điện tử số",
      description: "Tổng quan về kỹ thuật điện tử số và thiết kế mạch",
      image: "/placeholder.svg",
      lessons: 18,
      duration: "8 tuần",
      level: "Cơ bản",
    },
    {
      id: "3",
      title: "Xử lý tín hiệu số",
      description: "Các phương pháp xử lý tín hiệu số trong thực tế",
      image: "/placeholder.svg",
      lessons: 30,
      duration: "16 tuần",
      level: "Nâng cao",
    },
    {
      id: "4",
      title: "IoT và ứng dụng",
      description: "Phát triển các ứng dụng IoT với Arduino và ESP8266",
      image: "/placeholder.svg",
      lessons: 22,
      duration: "10 tuần",
      level: "Trung cấp",
    },
    {
      id: "5",
      title: "Lập trình nhúng C/C++",
      description: "Lập trình ngôn ngữ C/C++ chuyên sâu cho hệ thống nhúng",
      image: "/placeholder.svg",
      lessons: 28,
      duration: "14 tuần",
      level: "Trung cấp",
    },
    {
      id: "6",
      title: "Thiết kế PCB",
      description: "Học thiết kế mạch in chuyên nghiệp với Altium Designer",
      image: "/placeholder.svg",
      lessons: 20,
      duration: "10 tuần",
      level: "Cơ bản",
    },
  ];

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
      comment: "Khóa học rất chi tiết và dễ hiểu. Tôi đã học được rất nhiều kiến thức mới.",
      avatar: "/placeholder.svg",
      rating: 5,
    },
    {
      id: "2",
      name: "Trần Thị B",
      course: "IoT và ứng dụng",
      comment: "Tài liệu hướng dẫn rất hay, giảng viên nhiệt tình. Đã giúp tôi hoàn thành dự án IoT của mình.",
      avatar: "/placeholder.svg",
      rating: 5,
    },
    {
      id: "3",
      name: "Lê Văn C",
      course: "Điện tử số",
      comment: "Nội dung cập nhật với công nghệ mới nhất, bài tập thực hành rất bổ ích.",
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

      <main className="flex-1">
        <FeaturedSection />

        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-dtktmt-blue-dark">
                  <span className="gradient-text">Khóa học</span> nổi bật
                </h2>
                <p className="text-gray-500 text-sm">Những khóa học được yêu thích nhất</p>
              </div>
              <Link
                to="/khoa-hoc"
                className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark flex items-center gap-1 text-sm"
              >
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {popularCourses.slice(0, 3).map((course) => (
                <motion.div key={course.id} variants={fadeInUp}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {popularCourses.slice(3, 6).map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/khoa-hoc" 
                className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <span>Khám phá tất cả khóa học</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-dtktmt-blue-dark">
                  <span className="gradient-text">Tài liệu</span> bán chạy
                </h2>
                <p className="text-gray-500 text-sm">Tài liệu chất lượng cao được nhiều sinh viên lựa chọn</p>
              </div>
              <Link
                to="/tai-lieu"
                className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark flex items-center gap-1 text-sm"
              >
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  {...doc}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-dtktmt-blue-dark">
              Nhận xét từ <span className="gradient-text">học viên</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(testimonial => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-dtktmt-blue-dark">{testimonial.name}</h3>
                      <p className="text-xs text-gray-500">{testimonial.course}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "text-dtktmt-yellow fill-dtktmt-yellow" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 px-4 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Sẵn sàng bắt đầu hành trình học tập?
            </h2>
            <p className="mb-6 text-white/90 max-w-2xl mx-auto">
              Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng và khóa học trên DT&KTMT1.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-dtktmt-blue-dark hover:bg-dtktmt-blue-light hover:text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Đăng ký ngay
              </Link>
              <Link
                to="/login"
                className="bg-transparent border border-white hover:bg-white hover:text-dtktmt-blue-dark px-6 py-2.5 rounded-full font-medium transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default Index;
