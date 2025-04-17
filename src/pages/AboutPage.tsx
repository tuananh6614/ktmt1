
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { Mail, Phone, MapPin, Facebook, Github, Award, BookOpen, Trophy, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
      icon: <BookOpen size={24} className="text-dtktmt-pink-medium" />,
      title: "Nội dung chuyên sâu",
      description: "Tài liệu học tập được biên soạn bởi các chuyên gia hàng đầu trong lĩnh vực Điện tử & KTMT"
    },
    {
      icon: <Trophy size={24} className="text-dtktmt-blue-medium" />,
      title: "Phương pháp hiện đại",
      description: "Áp dụng các phương pháp giảng dạy tiên tiến, kết hợp lý thuyết và thực hành"
    },
    {
      icon: <CheckCircle size={24} className="text-dtktmt-green-medium" />,
      title: "Học mọi lúc mọi nơi",
      description: "Nền tảng trực tuyến giúp bạn tiếp cận kiến thức không giới hạn về không gian và thời gian"
    },
    {
      icon: <GraduationCap size={24} className="text-dtktmt-purple-medium" />,
      title: "Đội ngũ hỗ trợ tận tâm",
      description: "Luôn sẵn sàng giải đáp mọi thắc mắc và hướng dẫn bạn trong quá trình học tập"
    }
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainerVariants = {
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
        {/* Hero Section with Parallax Effect */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-dtktmt-blue-dark to-dtktmt-blue-medium text-white">
          <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-10"></div>
          <motion.div 
            className="max-w-7xl mx-auto px-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-dtktmt-pink-light"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Đổi mới cách học <br />
                  <span className="text-dtktmt-pink-light">Điện tử & KTMT</span>
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Nền tảng học liệu số hàng đầu, kết nối giảng viên và sinh viên trong lĩnh vực 
                  Điện tử và Kỹ thuật máy tính với công nghệ hiện đại.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <a href="/khoa-hoc" className="btn-primary px-6 py-3 flex items-center gap-2">
                    Khám phá khóa học <ArrowRight size={16} />
                  </a>
                  <a href="#team" className="btn-secondary px-6 py-3">
                    Đội ngũ phát triển
                  </a>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="h-72 md:h-96 w-full bg-dtktmt-blue-light/30 rounded-2xl overflow-hidden shadow-2xl relative border-2 border-dtktmt-blue-light/50">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="flex items-center justify-center h-full">
                      <img src="/placeholder.svg" alt="DT&KTMT1" className="max-h-full max-w-full" />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-dtktmt-pink-medium rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
                    <div className="text-white font-bold">
                      <span className="block text-2xl">5</span>
                      <span className="text-sm">năm</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section with Counter Animation */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto -mt-20 relative z-20">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                variants={fadeInUpVariants}
              >
                <div className="w-16 h-16 bg-dtktmt-blue-light/20 rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={32} className="text-dtktmt-blue-medium" />
                </div>
                <div className="counter text-4xl font-bold text-dtktmt-blue-dark mb-2">50+</div>
                <p className="text-gray-600 text-center">Khóa học chuyên sâu</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                variants={fadeInUpVariants}
              >
                <div className="w-16 h-16 bg-dtktmt-pink-light/20 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap size={32} className="text-dtktmt-pink-medium" />
                </div>
                <div className="counter text-4xl font-bold text-dtktmt-blue-dark mb-2">5000+</div>
                <p className="text-gray-600 text-center">Học viên tham gia</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                variants={fadeInUpVariants}
              >
                <div className="w-16 h-16 bg-dtktmt-purple-light/20 rounded-full flex items-center justify-center mb-4">
                  <Trophy size={32} className="text-dtktmt-purple-medium" />
                </div>
                <div className="counter text-4xl font-bold text-dtktmt-blue-dark mb-2">15+</div>
                <p className="text-gray-600 text-center">Năm kinh nghiệm</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Mission with Gradient Background */}
        <section className="py-20 px-4 bg-gradient-to-br from-dtktmt-blue-light/10 to-dtktmt-purple-light/10">
          <motion.div 
            className="max-w-7xl mx-auto"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Sứ mệnh của chúng tôi
                <div className="h-1 w-24 bg-gradient-to-r from-dtktmt-pink-medium to-dtktmt-purple-medium mx-auto mt-2"></div>
              </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="md:w-1/2 order-2 md:order-1"
                variants={fadeInUpVariants}
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
                        <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                        <p className="text-gray-700">Nội dung giảng dạy chất lượng từ chuyên gia hàng đầu</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                        <p className="text-gray-700">Kết hợp lý thuyết và thực hành với phương châm "Học để ứng dụng"</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-dtktmt-green-medium flex-shrink-0" size={20} />
                        <p className="text-gray-700">Cộng đồng học tập, hỗ trợ và chia sẻ kinh nghiệm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="md:w-1/2 mb-8 md:mb-0 order-1 md:order-2"
                variants={fadeInUpVariants}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-dtktmt-pink-medium to-dtktmt-purple-medium rounded-xl blur-sm"></div>
                  <img 
                    src="/placeholder.svg" 
                    alt="Sứ mệnh DT&KTMT1" 
                    className="rounded-xl relative z-10 w-full object-cover h-[400px]"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Our Strengths */}
        <section className="py-20 px-4 bg-white">
          <motion.div 
            className="max-w-7xl mx-auto"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUpVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Điểm mạnh của chúng tôi
                <div className="h-1 w-24 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium mx-auto mt-2"></div>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Những yếu tố tạo nên sự khác biệt của nền tảng DT&KTMT1 trong lĩnh vực đào tạo Điện tử & Kỹ thuật máy tính
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {strengths.map((strength, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-dtktmt-blue-light/50"
                  variants={fadeInUpVariants}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                      {strength.icon}
                    </div>
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
        <section id="team" className="py-20 px-4 bg-gradient-to-b from-white to-dtktmt-blue-light/20">
          <motion.div 
            className="max-w-7xl mx-auto"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUpVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Đội ngũ phát triển
                <div className="h-1 w-24 bg-gradient-to-r from-dtktmt-purple-medium to-dtktmt-blue-medium mx-auto mt-2"></div>
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
                  className="bg-white rounded-xl shadow-xl overflow-hidden transform-gpu card-3d hover:shadow-2xl transition-all duration-500"
                  variants={fadeInUpVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-purple-light">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold mb-1 text-dtktmt-blue-dark">{member.name}</h3>
                    <p className="text-dtktmt-pink-medium font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    <div className="flex items-center gap-3">
                      <a 
                        href={`mailto:${member.social.email}`} 
                        className="text-gray-500 hover:text-dtktmt-blue-medium hover:scale-110 transition-all duration-300"
                      >
                        <Mail size={18} />
                      </a>
                      <a 
                        href={member.social.Facebook} 
                        className="text-gray-500 hover:text-dtktmt-blue-medium hover:scale-110 transition-all duration-300"
                      >
                        <Facebook size={18} />
                      </a>
                      <a 
                        href={member.social.github} 
                        className="text-gray-500 hover:text-dtktmt-blue-medium hover:scale-110 transition-all duration-300"
                      >
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Us with Animated Form */}
        <section className="py-20 px-4 bg-gradient-to-br from-dtktmt-blue-medium/10 to-dtktmt-purple-medium/10">
          <motion.div 
            className="max-w-7xl mx-auto"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUpVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark inline-block relative">
                Liên hệ với chúng tôi
                <div className="h-1 w-24 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium mx-auto mt-2"></div>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Bạn có câu hỏi hoặc đề xuất? Hãy liên hệ với chúng tôi qua các kênh sau
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
                variants={fadeInUpVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-blue-light to-dtktmt-blue-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MapPin size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Địa chỉ</h3>
                <p className="text-gray-700">
                  235 Hoàng Quốc Việt, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Hà Nội
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
                variants={fadeInUpVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-pink-light to-dtktmt-pink-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Phone size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Điện thoại</h3>
                <p className="text-gray-700">+84 339 435 005</p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
                variants={fadeInUpVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-dtktmt-purple-light to-dtktmt-purple-medium rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Email</h3>
                <p className="text-gray-700">tuananh6614@gmail.com</p>
              </motion.div>
            </div>

            <motion.div 
              className="bg-white p-8 rounded-xl shadow-2xl"
              variants={fadeInUpVariants}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-dtktmt-blue-dark">Gửi tin nhắn cho chúng tôi</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
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
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
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
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
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
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
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
                    className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium hover:from-dtktmt-blue-dark hover:to-dtktmt-purple-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Gửi tin nhắn
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default AboutPage;
