
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Award, ArrowRight, Sparkles, Search, BookOpen, Clock, Target } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import CourseCard from "@/components/CourseCard";
import FeaturedSection from "@/components/FeaturedSection";
import { motion } from "framer-motion";

const Index = () => {
  useEffect(() => {
    // Animation for elements when they come into view
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

  // Sample courses data - expanded with more courses
  const popularCourses = [
    {
      id: "1",
      title: "Vi điều khiển STM32",
      description: "Lập trình vi điều khiển STM32 từ cơ bản đến nâng cao",
      image: "/placeholder.svg",
      lessons: 24,
      duration: "12 tuần",
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

  // Thêm dữ liệu về danh mục phổ biến
  const popularCategories = [
    { id: 1, name: "Vi điều khiển", count: 12, icon: <BookOpen className="w-5 h-5" /> },
    { id: 2, name: "Điện tử số", count: 8, icon: <Book className="w-5 h-5" /> },
    { id: 3, name: "IoT", count: 15, icon: <Sparkles className="w-5 h-5" /> },
    { id: 4, name: "Lập trình nhúng", count: 10, icon: <Target className="w-5 h-5" /> }
  ];

  // Dữ liệu về giảng viên 
  const instructors = [
    { id: 1, name: "TS. Nguyễn Văn A", specialty: "Vi điều khiển", courses: 8, img: "/placeholder.svg" },
    { id: 2, name: "PGS.TS. Trần Thị B", specialty: "IoT", courses: 6, img: "/placeholder.svg" },
    { id: 3, name: "ThS. Lê Văn C", specialty: "Điện tử số", courses: 5, img: "/placeholder.svg" },
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
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section - Compact và focused */}
        <section className="py-6 md:py-10 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <motion.div 
              className="md:col-span-6 lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                <span className="text-dtktmt-blue-dark text-3d">Học liệu </span>
                <span className="gradient-text font-extrabold">chất lượng</span>
                <span className="text-dtktmt-blue-dark text-3d"> cho sinh viên Điện Tử</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-5 animated-underline inline-block">
                DT&KTMT1 cung cấp các khóa học, tài liệu chất lượng cao cho sinh viên.
              </p>
              
              {/* Tìm kiếm khóa học */}
              <div className="relative max-w-xl mb-6">
                <div className="flex items-center glass-input rounded-full overflow-hidden pr-1">
                  <input 
                    type="text" 
                    placeholder="Tìm khóa học, tài liệu..." 
                    className="flex-1 bg-transparent border-none py-3 pl-5 pr-3 focus:outline-none focus:ring-0" 
                  />
                  <button className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark text-white p-2 rounded-full">
                    <Search size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/khoa-hoc"
                    className="btn-primary flex items-center gap-2 overflow-hidden group relative"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <Book size={18} className="relative z-10" />
                    <span className="relative z-10">Khóa học</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/tai-lieu"
                    className="btn-secondary flex items-center gap-2 overflow-hidden group relative"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <FileText size={18} className="relative z-10" />
                    <span className="relative z-10">Tài liệu</span>
                  </Link>
                </motion.div>
              </div>

              <div className="flex items-center">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200 shadow-lg transform hover:translate-y-[-5px] transition-transform"
                    >
                      <img src="/placeholder.svg" alt="User" />
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  className="ml-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="w-4 h-4 text-dtktmt-yellow"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Hơn 1000+ học viên hài lòng</p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:col-span-6 lg:col-span-7 flex justify-center relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-xl mx-auto">
                <motion.div 
                  className="bg-white p-3 rounded-2xl shadow-lg relative z-10"
                  whileHover={{ 
                    scale: 1.03, 
                    rotateY: 5, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src="/lovable-uploads/4ec8d887-3792-433e-bb58-7792ac0a36ea.png"
                    alt="Course example"
                    className="w-full h-auto rounded-xl"
                  />
                </motion.div>
                <motion.div 
                  className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg animate-float z-20"
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                >
                  <div className="flex items-center gap-2 text-dtktmt-blue-dark">
                    <Award size={20} className="text-dtktmt-blue-medium" />
                    <span className="font-medium">Chứng chỉ</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg animate-float z-20"
                  style={{ animationDelay: "1.5s" }}
                  whileHover={{ scale: 1.1, rotateZ: -5 }}
                >
                  <div className="flex items-center gap-2 text-dtktmt-blue-dark">
                    <Sparkles size={20} className="text-dtktmt-pink-medium" />
                    <span className="font-medium">Bài giảng chất lượng</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Danh mục phổ biến - Thêm mới */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-dtktmt-blue-dark">Danh mục phổ biến</h2>
              <Link to="/khoa-hoc" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark flex items-center gap-1 text-sm animated-underline">
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularCategories.map((category) => (
                <motion.div 
                  key={category.id}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="glass-card p-4 flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-blue-medium flex items-center justify-center text-white">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} khóa học</p>
                    </div>
                  </div>
                  <Link to={`/khoa-hoc?category=${category.id}`} className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark">
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content - Chuyển lên cao hơn và làm gọn lại */}
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <FeaturedSection />
          </div>
        </section>

        {/* Popular Courses - Nhiều khóa học hơn, hiển thị đẹp mắt hơn */}
        <motion.section 
          className="py-8 px-4 bg-white/50 backdrop-blur-sm"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-dtktmt-blue-dark">
                <span className="gradient-text">Khóa học</span> nổi bật
              </h2>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/khoa-hoc"
                  className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark flex items-center gap-1 animated-underline"
                >
                  Xem tất cả
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {popularCourses.slice(0, 6).map((course) => (
                <motion.div key={course.id} variants={fadeInUp}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-8 text-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/khoa-hoc" className="btn-primary inline-flex items-center gap-2">
                  <span>Khám phá tất cả khóa học</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Giới thiệu giảng viên - Mới */}
        <motion.section
          className="py-8 px-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-dtktmt-blue-dark">
                <span className="gradient-text">Giảng viên</span> hàng đầu
              </h2>
              <Link to="/gioi-thieu" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark flex items-center gap-1 animated-underline">
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {instructors.map(instructor => (
                <motion.div 
                  key={instructor.id}
                  className="card-3d p-5 flex flex-col sm:flex-row items-center gap-4"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-dtktmt-blue-light">
                    <img src={instructor.img} alt={instructor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-dtktmt-blue-dark">{instructor.name}</h3>
                    <p className="text-sm text-gray-600">{instructor.specialty}</p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <Book size={16} className="text-dtktmt-blue-medium" />
                      <span>{instructor.courses} khóa học</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tại sao chọn chúng tôi - Rút gọn */}
        <motion.section 
          className="py-8 px-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-xl md:text-2xl font-bold text-center mb-8 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Tại sao chọn DT&KTMT1?
            </motion.h2>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.div className="text-center glass-card p-6" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-blue-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Book size={28} className="text-dtktmt-blue-medium" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-dtktmt-blue-dark">
                  Nội dung chất lượng
                </h3>
                <p className="text-gray-600 text-sm">
                  Tài liệu và bài giảng được biên soạn tỉ mỉ bởi các giảng viên hàng đầu.
                </p>
              </motion.div>

              <motion.div className="text-center glass-card p-6" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-pink-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Award size={28} className="text-dtktmt-pink-medium" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-dtktmt-blue-dark">
                  Chứng chỉ giá trị
                </h3>
                <p className="text-gray-600 text-sm">
                  Nhận chứng chỉ được công nhận rộng rãi sau khi hoàn thành khóa học.
                </p>
              </motion.div>

              <motion.div className="text-center glass-card p-6" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-purple-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Clock size={28} className="text-dtktmt-purple-medium" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2 text-dtktmt-blue-dark">
                  Học bất cứ lúc nào
                </h3>
                <p className="text-gray-600 text-sm">
                  Truy cập không giới hạn vào nội dung khoá học mọi lúc, mọi nơi.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section - Rút gọn */}
        <motion.section 
          className="py-8 px-4 mb-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="glass-card rounded-2xl overflow-hidden relative"
              whileHover={{ y: -5 }}
              style={{ overflow: "hidden" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-dtktmt-blue-medium/70 to-dtktmt-purple-medium/70 z-0"></div>
              
              <div className="p-6 sm:p-8 text-white text-center relative z-10">
                <motion.h2 
                  className="text-xl md:text-2xl font-bold mb-3 glowing-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Sẵn sàng bắt đầu hành trình học tập?
                </motion.h2>
                <motion.p 
                  className="text-white/90 mb-6 max-w-xl mx-auto text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng và khóa học trên DT&KTMT1.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="bg-white text-dtktmt-blue-dark hover:bg-dtktmt-blue-light hover:text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      Đăng ký ngay
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="bg-transparent border border-white hover:bg-white hover:text-dtktmt-blue-dark px-6 py-3 rounded-full font-medium transition-all"
                    >
                      Đăng nhập
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default Index;
