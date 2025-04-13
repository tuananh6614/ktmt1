
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Award, ArrowRight, Sparkles } from "lucide-react";
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

  // Sample courses data
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
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-dtktmt-blue-dark text-3d">Học liệu </span>
                <span className="gradient-text font-extrabold animate-text-shimmer">chất lượng</span>
                <span className="text-dtktmt-blue-dark text-3d"> cho sinh viên Điện Tử</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 animated-underline inline-block">
                DT&KTMT1 cung cấp các khóa học, tài liệu chất lượng cao cho sinh viên ngành Điện tử và Kỹ thuật máy tính.
              </p>
              <div className="flex flex-wrap gap-4">
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

              <div className="mt-12 flex items-center">
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
              className="md:w-1/2 md:pl-8 flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-dtktmt-blue-medium rounded-full absolute -top-5 -left-5 -z-10 animate-pulse-soft"></div>
                <div className="w-48 h-48 md:w-64 md:h-64 bg-dtktmt-pink-medium rounded-full absolute -bottom-5 -right-5 -z-10 animate-pulse-soft" style={{ animationDelay: "1s" }}></div>
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
                    src="/placeholder.svg"
                    alt="Student learning"
                    className="w-full max-w-md rounded-xl"
                  />
                </motion.div>
                <motion.div 
                  className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg animate-float"
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                >
                  <div className="flex items-center gap-2 text-dtktmt-blue-dark">
                    <Award size={20} className="text-dtktmt-blue-medium" />
                    <span className="font-medium">Chứng chỉ</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg animate-float"
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

          {/* Decorative elements */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="hidden md:block absolute top-1/4 left-10 w-12 h-12 bg-dtktmt-yellow rounded-full opacity-50"
          ></motion.div>
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="hidden md:block absolute bottom-1/4 right-10 w-8 h-8 bg-dtktmt-purple-medium rounded-full opacity-50"
          ></motion.div>
        </section>

        {/* Featured Content */}
        <section className="py-12 px-4 animate-on-scroll opacity-0">
          <div className="max-w-7xl mx-auto">
            <FeaturedSection />
          </div>
        </section>

        {/* Popular Courses */}
        <motion.section 
          className="py-12 px-4 bg-white/50 backdrop-blur-sm"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-dtktmt-blue-dark glowing-text">
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {popularCourses.map((course) => (
                <motion.div key={course.id} variants={fadeInUp}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section 
          className="py-16 px-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Tại sao chọn DT&KTMT1?
            </motion.h2>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-blue-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Book size={32} className="text-dtktmt-blue-medium" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">
                  Nội dung chất lượng
                </h3>
                <p className="text-gray-600">
                  Tài liệu và bài giảng được biên soạn tỉ mỉ bởi các giảng viên hàng đầu.
                </p>
              </motion.div>

              <motion.div className="text-center" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-pink-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Award size={32} className="text-dtktmt-pink-medium" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">
                  Chứng chỉ giá trị
                </h3>
                <p className="text-gray-600">
                  Nhận chứng chỉ được công nhận rộng rãi sau khi hoàn thành khóa học.
                </p>
              </motion.div>

              <motion.div className="text-center" variants={fadeInUp}>
                <motion.div 
                  className="icon-circle w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-white to-dtktmt-purple-light"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <Sparkles size={32} className="text-dtktmt-purple-medium" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">
                  Trải nghiệm học tập
                </h3>
                <p className="text-gray-600">
                  Giao diện trực quan, học liệu đa dạng giúp việc học trở nên thú vị.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-12 px-4 mb-8"
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
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full"></div>
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full"></div>
              
              <div className="p-8 md:p-12 text-white text-center relative z-10">
                <motion.h2 
                  className="text-2xl md:text-3xl font-bold mb-4 glowing-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Sẵn sàng bắt đầu hành trình học tập?
                </motion.h2>
                <motion.p 
                  className="text-white/90 mb-8 max-w-xl mx-auto"
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
