import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { Mail, Phone, MapPin, Facebook, Github, Award, BookOpen, Trophy, GraduationCap, CheckCircle, ArrowRight, Code, Cpu, Layers, Zap } from "lucide-react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const AboutPage = () => {
  // Sample team members data
  const teamMembers = [
    {
      name: "Phan Thị Thanh Ngọc ",
      role: "Giáo viên hướng dẫn",
      image: "/placeholder.svg",
      bio: "Thạc sĩ khoa điện tử viễn thông trường Đại Học Điện Lực",
      social: {
        email: "",
        Facebook: "https://www.facebook.com/pttngoc",
        github: "#",
      },
    },
    {
      name: "Nguyễn Tuấn Anh",
      role: "Trưởng nhóm phát triển",
      image: "/placeholder.svg",
      bio: "Sinh viên chuyên ngành điện tử viên thông trường Đại Học Điện Lực.",
      social: {
        email: "tuananh6614@gmail.com",
        Facebook: "https://www.facebook.com/boycantien/",
        github: "#",
      },
    },
    {
      name: "Trần Đinh Dũng",
      role: "Phó nhóm phát triển",
      image: "/placeholder.svg",
      bio: "Sinh viên chuyên ngành điện tử viên thông trường Đại Học Điện Lực.",
      social: {
        email: "https://www.facebook.com/inhdung.936915",
        Facebook: "https://www.facebook.com/nguyen.van.phuong.658431",
        github: "#",
      },
    },
    {
      name: "Nguyễn Văn Phương",
      role: "Phó nhóm phát triển",
      image: "/placeholder.svg",
      bio: "Sinh viên chuyên ngành điện tử viên thông trường Đại Học Điện Lực.",
      social: {
        email: "levanc@dtktmt1.edu.vn",
        Facebook: "https://www.facebook.com/nguyen.van.phuong.658431",
        github: "#",
      },
    },
  ];

  // Our strengths data
  const strengths = [
    {
      icon: <Code size={24} className="text-dtktmt-pink-medium" />,
      title: "Công nghệ hiện đại",
      description: "Ứng dụng các công nghệ và framework mới nhất trong phát triển nền tảng học tập số"
    },
    {
      icon: <Trophy size={24} className="text-dtktmt-blue-medium" />,
      title: "Phương pháp tiên tiến",
      description: "Áp dụng các phương pháp giảng dạy kết hợp lý thuyết và thực hành hiệu quả"
    },
    {
      icon: <Cpu size={24} className="text-dtktmt-green-medium" />,
      title: "Nền tảng AI tích hợp",
      description: "Hệ thống học tập thông minh với trợ lý AI hỗ trợ sinh viên 24/7"
    },
    {
      icon: <Zap size={24} className="text-dtktmt-purple-medium" />,
      title: "Đội ngũ chuyên nghiệp",
      description: "Luôn cập nhật và đổi mới nội dung theo xu hướng công nghệ mới nhất"
    }
  ];

  const statsRef = useRef(null);
  const strengthsRef = useRef(null);
  const missionRef = useRef(null);
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const teamRef = useRef(null);
  
  // Fix: Removed the threshold property from useInView options
  const statsInView = useInView(statsRef, { once: false });
  const strengthsInView = useInView(strengthsRef, { once: false });
  const missionInView = useInView(missionRef, { once: false });
  const heroInView = useInView(heroRef, { once: true });
  const contactInView = useInView(contactRef, { once: false });
  const teamInView = useInView(teamRef, { once: false });

  // Parallax effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  // Counter animation for stats
  const [counters, setCounters] = useState({ courses: 0, students: 0, years: 0 });
  const finalValues = { courses: 50, students: 5000, years: 15 };

  useEffect(() => {
    if (statsInView) {
      const interval = setInterval(() => {
        setCounters(prev => ({
          courses: prev.courses < finalValues.courses ? prev.courses + 1 : finalValues.courses,
          students: prev.students < finalValues.students ? prev.students + 100 : finalValues.students,
          years: prev.years < finalValues.years ? prev.years + 1 : finalValues.years
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [statsInView]);

  // Mouse parallax effect for hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Xử lý cuộn đến phần Team khi click vào nút "Đội ngũ phát triển"
  const scrollToTeam = () => {
    const teamElement = document.getElementById('team');
    if (teamElement) {
      teamElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section with Advanced Parallax Effect */}
        <section 
          ref={heroRef} 
          className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-dtktmt-blue-dark via-dtktmt-blue-medium to-dtktmt-blue-light/70 text-white"
        >
          {/* Background elements */}
          <div className="absolute inset-0 w-full h-full">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid-bg w-full h-full"></div>
            </div>
            
            {/* Animated particles */}
            <div className="absolute inset-0">
              {Array(20).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    x: [
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`
                    ],
                    y: [
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5
                  }}
                />
              ))}
            </div>
            
            {/* Circuit pattern overlay */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              style={{ y: textY }}
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="md:w-1/2 mb-12 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-xl"
                >
                  <div className="inline-block mb-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                    <span className="text-white font-medium text-sm">Đổi mới công nghệ giáo dục</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                    <span className="block mb-2">Đổi mới cách học</span>
                    <div className="relative inline-block overflow-hidden">
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-dtktmt-pink-light to-dtktmt-purple-light animate-gradient-slide bg-300%">Điện tử & KTMT</span>
                      <motion.span 
                        className="absolute -bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-dtktmt-pink-light to-dtktmt-purple-light rounded-full"
                        animate={{ 
                          width: ['0%', '100%'],
                          opacity: [0, 1]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.8,
                          ease: "easeOut"
                        }}
                      ></motion.span>
                    </div>
                  </h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl text-white/90 mb-10 max-w-lg font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Nền tảng học liệu số hàng đầu, kết nối giảng viên và sinh viên trong lĩnh vực 
                    Điện tử và Kỹ thuật máy tính với công nghệ AI hiện đại.
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-wrap gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.a 
                      href="/khoa-hoc" 
                      className="relative overflow-hidden bg-gradient-to-r from-dtktmt-pink-light to-dtktmt-purple-medium px-8 py-4 rounded-xl text-white font-medium flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 text-lg">Khám phá khóa học</span>
                      <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      <motion.span 
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                        animate={{
                          background: [
                            'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                            'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)',
                            'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.span>
                    </motion.a>
                    
                    <motion.button 
                      onClick={scrollToTeam}
                      className="relative overflow-hidden bg-white/15 backdrop-blur-md border-2 border-white/30 px-8 py-4 rounded-xl text-white font-medium hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 text-lg">Đội ngũ phát triển</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="md:w-1/2 md:flex md:justify-end">
                <motion.div
                  className="relative w-full max-w-md mx-auto"
                  style={{ 
                    x: mousePosition.x * 20, 
                    y: mousePosition.y * 20
                  }}
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={heroInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.9, rotate: -5 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                >
                  <div className="relative">
                    {/* Main visual element */}
                    <div className="h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 relative backdrop-blur-sm">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-dtktmt-blue-dark/80 to-dtktmt-purple-medium/80"></div>
                      
                      {/* Animated visual content */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="technology-code w-full h-full opacity-30"></div>
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ 
                            rotateY: [0, 360], 
                            rotateX: [5, -5, 5]
                          }}
                          transition={{ 
                            duration: 25, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        >
                          <div className="w-40 h-40 md:w-60 md:h-60 relative">
                            {/* 3D Floating cube */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                className="relative w-full h-full"
                                animate={{ 
                                  rotateY: [0, 360],
                                  rotateX: [20, -20, 20]
                                }}
                                transition={{ 
                                  duration: 20, 
                                  repeat: Infinity, 
                                  ease: "linear" 
                                }}
                              >
                                {/* Logo hoặc hình ảnh - đã thay thế bằng logo của trang web */}
                                <motion.img
                                  src="/lovable-uploads/62599728-dd80-41c9-80ea-ed479b3c2173.png" 
                                  alt="DT&KTMT1" 
                                  className="w-full h-full object-contain rounded-full"
                                  animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.9, 1, 0.9],
                                    rotateZ: [0, 5, 0, -5, 0]
                                  }}
                                  transition={{ 
                                    duration: 8, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                  }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Animated rings around logo */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.div 
                            className="w-48 h-48 md:w-72 md:h-72 border-2 border-white/10 rounded-full"
                            animate={{ 
                              rotate: [0, 360],
                              scale: [0.9, 1.1, 0.9]
                            }}
                            transition={{ 
                              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                            }}
                          />
                          <motion.div 
                            className="absolute w-60 h-60 md:w-80 md:h-80 border border-white/5 rounded-full"
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute -top-4 -left-4 text-sm bg-gradient-to-r from-dtktmt-pink-light to-dtktmt-pink-medium text-white px-4 py-2 rounded-lg shadow-xl z-20 animate-float">
                      <motion.span
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Công nghệ tương tác
                      </motion.span>
                    </div>
                    
                    {/* Year badge */}
                    <motion.div 
                      className="absolute -bottom-6 -right-6 bg-gradient-to-br from-dtktmt-pink-medium to-dtktmt-purple-medium rounded-full w-28 h-28 flex items-center justify-center shadow-xl"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <div className="text-white font-bold">
                        <span className="block text-3xl"></span>
                        <span className="text-center"> Thông minh</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating tech elements */}
                  <motion.div 
                    className="absolute -top-10 right-20 w-20 h-20 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg"
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    style={{ 
                      x: mousePosition.x * -15, 
                      y: mousePosition.y * -15 + -10
                    }}
                  >
                    <Cpu className="text-dtktmt-pink-light w-10 h-10" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-20 -left-10 w-20 h-20 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg"
                    animate={{ 
                      y: [0, 15, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    style={{ 
                      x: mousePosition.x * 15, 
                      y: mousePosition.y * 15
                    }}
                  >
                    <Code className="text-dtktmt-purple-light w-10 h-10" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section with Counter Animation */}
        <section ref={statsRef} className="py-16 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={statsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  background: "linear-gradient(to bottom, white, #f9fafb)" 
                }}
              >
                <div className="w-16 h-16 bg-dtktmt-blue-light/20 rounded-full flex items-center justify-center mb-4 relative">
                  <BookOpen size={32} className="text-dtktmt-blue-medium" />
                  <div className="absolute inset-0 rounded-full bg-dtktmt-blue-light/10 animate-ping opacity-75"></div>
                </div>
                <div className="counter text-5xl font-bold text-dtktmt-blue-dark mb-2">{counters.courses}+</div>
                <p className="text-gray-600 text-center font-medium">Khóa học chuyên sâu</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  background: "linear-gradient(to bottom, white, #f9fafb)" 
                }}
              >
                <div className="w-16 h-16 bg-dtktmt-pink-light/20 rounded-full flex items-center justify-center mb-4 relative">
                  <GraduationCap size={32} className="text-dtktmt-pink-medium" />
                  <div className="absolute inset-0 rounded-full bg-dtktmt-pink-light/10 animate-ping opacity-75"></div>
                </div>
                <div className="counter text-5xl font-bold text-dtktmt-blue-dark mb-2">{counters.students}+</div>
                <p className="text-gray-600 text-center font-medium">Học viên tham gia</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  background: "linear-gradient(to bottom, white, #f9fafb)" 
                }}
              >
                <div className="w-16 h-16 bg-dtktmt-purple-light/20 rounded-full flex items-center justify-center mb-4 relative">
                  <Trophy size={32} className="text-dtktmt-purple-medium" />
                  <div className="absolute inset-0 rounded-full bg-dtktmt-purple-light/10 animate-ping opacity-75"></div>
                </div>
                <div className="counter text-5xl font-bold text-dtktmt-blue-dark mb-2">{counters.years}+</div>
                <p className="text-gray-600 text-center font-medium">Năm kinh nghiệm</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Mission with 3D Cards */}
        <section ref={missionRef} className="py-20 px-4 bg-gradient-to-br from-dtktmt-blue-light/10 to-dtktmt-purple-light/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={missionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Sứ mệnh của chúng tôi
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-dtktmt-pink-medium to-dtktmt-purple-medium mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={missionInView ? { width: 100 } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
              </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="md:w-1/2 order-2 md:order-1 perspective-1000"
                initial={{ opacity: 0, x: -50 }}
                animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="transform-3d"
                  whileHover={{ rotateY: 5, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <div className="p-1 bg-gradient-to-br from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-xl shadow-xl">
                    <div className="bg-white p-8 rounded-lg">
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        Tại DT&KTMT1, chúng tôi tin rằng kiến thức về Điện tử và Kỹ thuật máy tính nên được 
                        phổ biến một cách dễ tiếp cận và hiệu quả. Sứ mệnh của chúng tôi là cung cấp nền tảng 
                        học liệu số chất lượng cao, giúp sinh viên và những người đam mê công nghệ có thể 
                        tiếp cận kiến thức chuyên sâu mọi lúc, mọi nơi.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={missionInView ? { scale: 1 } : { scale: 0 }}
                            transition={{ delay: 0.5, type: "spring" }}
                          >
                            <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                          </motion.span>
                          <p className="text-gray-700">Nội dung giảng dạy chất lượng từ chuyên gia hàng đầu</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={missionInView ? { scale: 1 } : { scale: 0 }}
                            transition={{ delay: 0.7, type: "spring" }}
                          >
                            <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                          </motion.span>
                          <p className="text-gray-700">Kết hợp lý thuyết và thực hành với phương châm "Học để ứng dụng"</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={missionInView ? { scale: 1 } : { scale: 0 }}
                            transition={{ delay: 0.9, type: "spring" }}
                          >
                            <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                          </motion.span>
                          <p className="text-gray-700">Cộng đồng học tập, hỗ trợ và chia sẻ kinh nghiệm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="md:w-1/2 mb-8 md:mb-0 order-1 md:order-2 perspective-1000"
                initial={{ opacity: 0, x: 50 }}
                animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="relative transform-3d"
                  animate={{ 
                    rotateY: [0, 5, 0, -5, 0],
                    rotateX: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-dtktmt-pink-medium to-dtktmt-purple-medium rounded-xl blur-sm"></div>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-white">
                    <motion.div 
                      className="absolute inset-0 bg-circuit-pattern mix-blend-overlay opacity-30"
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    
                    <img 
                      src="/placeholder.svg" 
                      alt="Sứ mệnh DT&KTMT1"
