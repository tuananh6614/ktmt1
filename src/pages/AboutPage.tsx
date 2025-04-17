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
                                {/* Logo or image */}
                                <motion.img
                                  src="/lovable-uploads/edbc5529-0211-47c7-81df-4adf5f381a48.png" 
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
                        <span className="block text-3xl">5</span>
                        <span className="text-sm">năm</span>
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
                      className="relative z-10 w-full object-cover h-[400px]"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6">
                        <motion.h3 
                          className="text-white text-2xl font-bold mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.5 }}
                        >
                          Công nghệ tương lai
                        </motion.h3>
                        <motion.p 
                          className="text-white/80"
                          initial={{ opacity: 0, y: 20 }}
                          animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.7 }}
                        >
                          Đột phá giới hạn của giáo dục truyền thống
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Our Strengths */}
        <section ref={strengthsRef} className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={strengthsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={strengthsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Điểm mạnh của chúng tôi
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={strengthsInView ? { width: 100 } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Những yếu tố tạo nên sự khác biệt của nền tảng DT&KTMT1 trong lĩnh vực đào tạo Điện tử & Kỹ thuật máy tính
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {strengths.map((strength, index) => (
                <motion.div 
                  key={index} 
                  className="glassmorphism bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-white shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={strengthsInView ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 + 0.3, duration: 0.6 }
                  } : { 
                    opacity: 0, 
                    y: 50 
                  }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.95)"
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-dtktmt-blue-light/20 to-dtktmt-purple-light/20 rounded-2xl flex items-center justify-center shadow-inner"
                      whileHover={{ rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }}
                    >
                      {strength.icon}
                      <div className="absolute w-16 h-16 bg-gradient-to-br from-dtktmt-blue-light/10 to-dtktmt-purple-light/10 rounded-2xl animate-pulse"></div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">{strength.title}</h3>
                      <p className="text-gray-700">{strength.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Our Team with 3D Cards */}
        <section id="team" ref={teamRef} className="py-20 px-4 bg-gradient-to-b from-white to-dtktmt-blue-light/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={teamInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Đội ngũ phát triển
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-dtktmt-purple-medium to-dtktmt-blue-medium mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={teamInView ? { width: 100 } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Gặp gỡ những chuyên gia đã xây dựng nên DT&KTMT1 - những người đam mê công nghệ 
                và giáo dục, với sứ mệnh đưa kiến thức chuyên ngành đến gần hơn với mọi người.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-xl overflow-hidden transform-gpu shadow-xl perspective-1000 hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 50 }}
                  animate={teamInView ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5 }
                  } : { 
                    opacity: 0, 
                    y: 50 
                  }}
                  whileHover={{ 
                    y: -15,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <motion.div 
                    className="transform-3d"
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                  >
                    <div className="relative">
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-purple-light">
                        <motion.img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-80"></div>
                        
                        <motion.div 
                          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center"
                          whileHover={{ 
                            rotate: 360,
                            transition: { duration: 0.7, ease: "easeInOut" }
                          }}
                        >
                          <GraduationCap className="text-white" size={20} />
                        </motion.div>
                      </div>
                      <motion.div 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-full w-12 h-12 flex items-center justify-center border-4 border-white"
                        initial={{ scale: 0 }}
                        animate={teamInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        <Award className="text-white" size={18} />
                      </motion.div>
                    </div>
                    <div className="p-6 pt-8 bg-white">
                      <h3 className="text-xl font-bold mb-1 text-dtktmt-blue-dark text-center">{member.name}</h3>
                      <p className="text-dtktmt-pink-medium font-medium mb-3 text-center">{member.role}</p>
                      <p className="text-gray-600 text-sm mb-4 text-center">{member.bio}</p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <motion.a 
                          href={`mailto:${member.social.email}`} 
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-dtktmt-blue-medium hover:text-white transition-all duration-300"
                          whileHover={{ y: -5, rotate: 10 }}
                        >
                          <Mail size={15} />
                        </motion.a>
                        <motion.a 
                          href={member.social.Facebook} 
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-dtktmt-blue-medium hover:text-white transition-all duration-300"
                          whileHover={{ y: -5, rotate: -10 }}
                        >
                          <Facebook size={15} />
                        </motion.a>
                        <motion.a 
                          href={member.social.github} 
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-dtktmt-blue-medium hover:text-white transition-all duration-300"
                          whileHover={{ y: -5, rotate: 10 }}
                        >
                          <Github size={15} />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Us with Animated Form */}
        <section ref={contactRef} className="py-20 px-4 bg-gradient-to-br from-dtktmt-blue-medium/10 to-dtktmt-purple-medium/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
          
          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Liên hệ với chúng tôi
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={contactInView ? { width: 100 } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Bạn có câu hỏi hoặc đề xuất? Hãy liên hệ với chúng tôi qua các kênh sau
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div 
                className="glassmorphism bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-blue-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin size={24} className="text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Địa chỉ</h3>
                <p className="text-gray-700">
                  235 Hoàng Quốc Việt, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Hà Nội
                </p>
              </motion.div>

              <motion.div 
                className="glassmorphism bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-pink-light to-dtktmt-pink-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Phone size={24} className="text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Điện thoại</h3>
                <motion.p 
                  className="text-gray-700"
                  whileHover={{ scale: 1.05 }}
                >
                  +84 339 435 005
                </motion.p>
              </motion.div>

              <motion.div 
                className="glassmorphism bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-purple-light to-dtktmt-purple-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail size={24} className="text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Email</h3>
                <motion.p 
                  className="text-gray-700"
                  whileHover={{ scale: 1.05 }}
                >
                  tuananh6614@gmail.com
                </motion.p>
              </motion.div>
            </div>

            <motion.div 
              className="glassmorphism bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-dtktmt-blue-dark">Gửi tin nhắn cho chúng tôi</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={contactInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="block text-gray-700 mb-2 font-medium">Họ và tên</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium focus:border-transparent transition-all duration-300" 
                    placeholder="Nhập họ và tên"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={contactInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="block text-gray-700 mb-2 font-medium">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium focus:border-transparent transition-all duration-300" 
                    placeholder="Nhập địa chỉ email"
                  />
                </motion.div>
                <motion.div 
                  className="md:col-span-2"
                  initial={{ y: 50, opacity: 0 }}
                  animate={contactInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <label className="block text-gray-700 mb-2 font-medium">Chủ đề</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium focus:border-transparent transition-all duration-300" 
                    placeholder="Nhập chủ đề"
                  />
                </motion.div>
                <motion.div 
                  className="md:col-span-2"
                  initial={{ y: 50, opacity: 0 }}
                  animate={contactInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <label className="block text-gray-700 mb-2 font-medium">Nội dung</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium focus:border-transparent h-36 transition-all duration-300" 
                    placeholder="Nhập nội dung tin nhắn"
                  ></textarea>
                </motion.div>
                <div className="md:col-span-2 text-center">
                  <motion.button 
                    type="submit"
                    className="relative overflow-hidden bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white font-bold py-3 px-8 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span className="relative z-10">Gửi tin nhắn</span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-dtktmt-pink-medium to-dtktmt-blue-medium opacity-0 hover:opacity-100 transition-opacity"
                      animate={{
                        background: ['linear-gradient(to right, #5da7e8, #c9a9ff)', 'linear-gradient(to right, #c9a9ff, #5da7e8)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    ></motion.span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <ChatBox />
      
      {/* Fix: Removed jsx and global props from style element */}
      <style>
        {`
        .glassmorphism {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .transform-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .grid-bg {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        }
        
        .bg-circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .technology-code {
          background: linear-gradient(rgba(43, 120, 194, 0.7), rgba(201, 169, 255, 0.7)),
                      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23FFFFFF'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .bg-300\\% {
          background-size: 300% 100%;
        }
        
        .animate-gradient-slide {
          animation: gradient-slide 3s linear infinite;
        }
        
        @keyframes gradient-slide {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        `}
      </style>
    </div>
  );
};

export default AboutPage;
