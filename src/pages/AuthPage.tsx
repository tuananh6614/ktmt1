import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, User, Lock, Mail, Phone, School, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Đăng nhập thành công!");
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      setIsLoading(false);
    }, 1500);
  };

  // Tab transition variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: {
        duration: 0.2
      }
    }
  };

  // Decorative bubble animation - Fixed to properly type the variants
  const bubbleVariants: Variants = {
    initial: {
      opacity: 0.7,
      scale: 1,
      y: 0,
      x: 0,
    },
    animate: {
      opacity: [0.7, 0.9, 0.7],
      scale: [1, 1.1, 1],
      y: [0, -15, 0],
      x: [0, 10, 0],
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  // Tab indicator animation
  const indicatorVariants = {
    login: { x: 0 },
    register: { x: "100%" },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Decorative */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-dtktmt-blue-medium via-dtktmt-purple-medium to-dtktmt-pink-medium p-8 items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Animated floating bubbles - Fixed the TypeScript error with the transition property */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              style={{
                width: `${80 + Math.random() * 120}px`,
                height: `${80 + Math.random() * 120}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
                position: 'absolute',
                borderRadius: '50%',
                filter: 'blur(15px)',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                zIndex: 0
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md text-white relative z-10 glass-card p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center mb-8"
          >
            <div className="relative group">
              <div className="bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] rounded-full p-2.5 group-hover:shadow-xl group-hover:shadow-blue-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full group-hover:before:animate-[shimmer_1.5s_ease-in-out_infinite] before:transition-transform after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-br after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:animate-pulse-soft relative z-10"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" className="group-hover:stroke-[#FFE29F]"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" className="group-hover:stroke-[#FFA99F]"></path>
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            </div>
            <h1 className="text-3xl font-bold ml-2 font-montserrat bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] bg-[length:200%_100%] group-hover:bg-[length:200%_100%] group-hover:animate-[gradient-slide_3s_linear_infinite] bg-clip-text text-transparent">DT&KTMT1</h1>
          </motion.div>
          
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4 glowing-text">
            Học liệu chất lượng cho sinh viên Điện Tử
          </motion.h2>
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8">
            Tham gia ngay để truy cập vào kho tàng học liệu đa dạng và chất lượng cao về Điện tử và Kỹ thuật máy tính.
          </motion.p>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M15.5 9.5 12 6 8.5 9.5"></path>
                  <path d="m12 6-2 2h4l-2-2z"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                  <path d="M22 8h-4"></path>
                  <path d="M6 18h12"></path>
                  <path d="M12 12v4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Học mọi lúc, mọi nơi</h3>
                <p className="text-white/80 text-sm">
                  Truy cập dễ dàng vào các khóa học và tài liệu từ mọi thiết bị
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Hỗ trợ 24/7</h3>
                <p className="text-white/80 text-sm">
                  Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Cập nhật liên tục</h3>
                <p className="text-white/80 text-sm">
                  Nội dung được cập nhật thường xuyên để bắt kịp công nghệ mới
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-10 overflow-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] rounded-full p-2.5 group-hover:shadow-xl group-hover:shadow-blue-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full group-hover:before:animate-[shimmer_1.5s_ease-in-out_infinite] before:transition-transform after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-br after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:animate-pulse-soft relative z-10"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" className="group-hover:stroke-[#FFE29F]"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" className="group-hover:stroke-[#FFA99F]"></path>
                </svg>
              </div>
              <motion.span 
                className="font-montserrat font-bold text-xl bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] bg-[length:200%_100%] group-hover:bg-[length:200%_100%] group-hover:animate-[gradient-slide_3s_linear_infinite] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#8B5CF6] after:to-[#0EA5E9] after:scale-x-0 after:origin-right after:transition-transform after:duration-500 group-hover:after:scale-x-100 after:hover:origin-left group-hover:drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)]"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                DT&KTMT1
              </motion.span>
            </Link>
            <motion.h2 
              className="text-2xl font-bold text-dtktmt-blue-dark mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Chào mừng bạn quay trở lại
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Đăng nhập hoặc đăng ký để trải nghiệm đầy đủ
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card-3d bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Tabs with custom transition */}
            <div className="relative">
              <Tabs 
                defaultValue="login" 
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
                value={activeTab}
              >
                {/* Custom tab list with sliding indicator */}
                <div className="relative">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100/80 rounded-none">
                    <TabsTrigger 
                      value="login" 
                      className={`flex items-center justify-center gap-2 py-3 data-[state=active]:font-bold rounded-md transition-all duration-300 relative z-10 ${activeTab === "login" ? "text-dtktmt-blue-medium" : "text-gray-500"}`}
                      onClick={() => setActiveTab("login")}
                    >
                      <LogIn size={16} />
                      <span>Đăng nhập</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className={`flex items-center justify-center gap-2 py-3 data-[state=active]:font-bold rounded-md transition-all duration-300 relative z-10 ${activeTab === "register" ? "text-dtktmt-purple-medium" : "text-gray-500"}`}
                      onClick={() => setActiveTab("register")}
                    >
                      <UserPlus size={16} />
                      <span>Đăng ký</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Animated background indicator */}
                  <motion.div 
                    className="absolute left-0 top-0 w-1/2 h-full bg-white rounded-md shadow-md"
                    variants={indicatorVariants}
                    initial={false}
                    animate={activeTab}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.3,
                    }}
                    style={{
                      zIndex: 1,
                    }}
                  />
                </div>
                
                <div className="p-6 min-h-[480px] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === "login" ? (
                      <motion.div
                        key="login"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 p-6"
                      >
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Email"
                              type="email"
                              className="pl-10 border-gray-200 focus:border-dtktmt-blue-medium focus:ring-dtktmt-blue-light transition-all duration-300"
                              required
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Mật khẩu"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10 border-gray-200 focus:border-dtktmt-blue-medium focus:ring-dtktmt-blue-light transition-all duration-300"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-dtktmt-blue-medium focus:ring-dtktmt-blue-medium"
                              />
                              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Ghi nhớ đăng nhập
                              </label>
                            </div>
                            <div className="text-sm">
                              <a href="#" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark font-medium transition-colors duration-300">
                                Quên mật khẩu?
                              </a>
                            </div>
                          </div>
                          
                          <Button
                            className="w-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg font-medium text-white rounded-lg py-2.5"
                            disabled={isLoading}
                            type="submit"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang đăng nhập...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-center w-full">
                                <LogIn size={18} />
                                <span>Đăng nhập</span>
                              </div>
                            )}
                          </Button>
                        
                          <div className="mt-6">
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                              </div>
                              <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-gray-500 text-sm">hoặc đăng nhập với</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <Button variant="outline" className="w-full hover:bg-gray-50 border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                                <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25526 2.69 1.28027 6.60998L5.27026 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25537 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                                </svg>
                                Google
                              </Button>
                              <Button variant="outline" className="w-full hover:bg-gray-50 border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                                <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 3.042 1.135 5.824 3 7.938l3-2.647z" clipRule="evenodd" />
                                </svg>
                                Facebook
                              </Button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 p-6"
                      >
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Họ và tên"
                              type="text"
                              className="pl-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Email"
                              type="email"
                              className="pl-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Số điện thoại"
                              type="tel"
                              className="pl-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Trường/Cơ quan"
                              type="text"
                              className="pl-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Mật khẩu"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="Xác nhận mật khẩu"
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-10 pr-10 border-gray-200 focus:border-dtktmt-purple-medium focus:ring-dtktmt-purple-light transition-all duration-300"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="terms"
                              name="terms"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-dtktmt-purple-medium focus:ring-dtktmt-purple-medium"
                              required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                              Tôi đồng ý với <a href="#" className="text-dtktmt-purple-medium hover:text-dtktmt-purple-dark font-medium">Điều khoản sử dụng</a> và <a href="#" className="text-dtktmt-purple-medium hover:text-dtktmt-purple-dark font-medium">Chính sách bảo mật</a>
                            </label>
                          </div>
                          
                          <Button
                            className="w-full bg-gradient-to-r from-dtktmt-purple-medium to-dtktmt-pink-medium hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg font-medium text-white rounded-lg py-2.5"
                            disabled={isLoading}
                            type="submit"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang đăng ký...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-center w-full">
                                <UserPlus size={18} />
                                <span>Đăng ký</span>
                              </div>
                            )}
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -z-10">
            <div className="absolute -bottom-10 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-dtktmt-blue-light/20 to-dtktmt-purple-light/20 blur-3xl"></div>
            <div className="absolute -top-10 -left-20 w-40 h-40 rounded-full bg-gradient-to-r from-dtktmt-purple-light/10 to-dtktmt-pink-light/10 blur-3xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
