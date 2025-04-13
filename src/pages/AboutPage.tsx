
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import { Mail, Phone, MapPin, Linkedin, GitHub, Award, BookOpen, Trophy, GraduationCap } from "lucide-react";

const AboutPage = () => {
  // Sample team members data
  const teamMembers = [
    {
      name: "TS. Nguyễn Văn A",
      role: "Trưởng nhóm phát triển",
      image: "/placeholder.svg",
      bio: "Tiến sĩ Điện tử Viễn thông với hơn 15 năm kinh nghiệm trong lĩnh vực Vi điều khiển và Hệ thống nhúng.",
      social: {
        email: "nguyenvana@dtktmt1.edu.vn",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "ThS. Trần Thị B",
      role: "Chuyên gia nội dung",
      image: "/placeholder.svg",
      bio: "Thạc sĩ Kỹ thuật Máy tính với kinh nghiệm giảng dạy tại các trường đại học hàng đầu trong nước.",
      social: {
        email: "tranthib@dtktmt1.edu.vn",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "KS. Lê Văn C",
      role: "Chuyên gia kỹ thuật",
      image: "/placeholder.svg",
      bio: "Kỹ sư Điện tử với nhiều năm kinh nghiệm làm việc trong lĩnh vực thiết kế mạch và hệ thống nhúng.",
      social: {
        email: "levanc@dtktmt1.edu.vn",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "ThS. Phạm Văn D",
      role: "Quản lý dự án",
      image: "/placeholder.svg",
      bio: "Thạc sĩ Quản lý Công nghệ với kinh nghiệm quản lý các dự án công nghệ giáo dục quy mô lớn.",
      social: {
        email: "phamvand@dtktmt1.edu.vn",
        linkedin: "#",
        github: "#",
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-dtktmt-blue-light to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-dtktmt-blue-dark">
              Giới thiệu về DT&KTMT1
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Nền tảng học liệu số hàng đầu về Điện tử và Kỹ thuật máy tính,
              được phát triển bởi đội ngũ chuyên gia với nhiều năm kinh nghiệm trong lĩnh vực.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
                <BookOpen size={32} className="text-dtktmt-blue-medium mb-2" />
                <span className="text-3xl font-bold text-dtktmt-blue-dark">50+</span>
                <span className="text-gray-600">Khóa học</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
                <GraduationCap size={32} className="text-dtktmt-pink-medium mb-2" />
                <span className="text-3xl font-bold text-dtktmt-blue-dark">5000+</span>
                <span className="text-gray-600">Học viên</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
                <Trophy size={32} className="text-dtktmt-purple-medium mb-2" />
                <span className="text-3xl font-bold text-dtktmt-blue-dark">15+</span>
                <span className="text-gray-600">Năm kinh nghiệm</span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-dtktmt-blue-dark">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-gray-700 mb-4">
                  Tại DT&KTMT1, chúng tôi tin rằng kiến thức về Điện tử và Kỹ thuật máy tính nên được 
                  phổ biến một cách dễ tiếp cận và hiệu quả. Sứ mệnh của chúng tôi là cung cấp nền tảng 
                  học liệu số chất lượng cao, giúp sinh viên và những người đam mê công nghệ có thể 
                  tiếp cận kiến thức chuyên sâu mọi lúc, mọi nơi.
                </p>
                <p className="text-gray-700 mb-4">
                  Chúng tôi luôn nỗ lực phát triển nội dung giáo dục đa dạng, từ các khóa học video 
                  đến tài liệu chuyên sâu, đều được biên soạn bởi các chuyên gia hàng đầu trong lĩnh vực.
                </p>
                <p className="text-gray-700">
                  Với phương châm "Học để ứng dụng", chúng tôi tập trung vào nội dung thực tiễn, 
                  giúp người học không chỉ nắm vững lý thuyết mà còn có thể áp dụng kiến thức 
                  vào các dự án thực tế.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/placeholder.svg" 
                  alt="Sứ mệnh DT&KTMT1" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 px-4 bg-dtktmt-blue-light/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-dtktmt-blue-dark">
              Đội ngũ phát triển
            </h2>
            <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
              Gặp gỡ những chuyên gia đã xây dựng nên DT&KTMT1 - những người đam mê công nghệ 
              và giáo dục, với sứ mệnh đưa kiến thức chuyên ngành đến gần hơn với mọi người.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden card-3d">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-dtktmt-blue-dark">{member.name}</h3>
                    <p className="text-dtktmt-pink-medium font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    <div className="flex items-center gap-3">
                      <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-dtktmt-blue-medium">
                        <Mail size={18} />
                      </a>
                      <a href={member.social.linkedin} className="text-gray-500 hover:text-dtktmt-blue-medium">
                        <Linkedin size={18} />
                      </a>
                      <a href={member.social.github} className="text-gray-500 hover:text-dtktmt-blue-medium">
                        <GitHub size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-dtktmt-blue-dark">
              Lịch sử phát triển
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-dtktmt-blue-light"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-dtktmt-blue-dark">2015</h3>
                      <h4 className="text-dtktmt-pink-medium font-medium mb-2">Khởi đầu hành trình</h4>
                      <p className="text-gray-700">
                        DT&KTMT1 được thành lập bởi nhóm các giảng viên đại học với mong muốn xây dựng
                        nền tảng học liệu số đầu tiên về Điện tử và Kỹ thuật máy tính tại Việt Nam.
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
                    <div className="hidden md:flex items-center justify-center bg-dtktmt-blue-medium w-8 h-8 rounded-full relative -left-4 border-4 border-white">
                      <Award size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right order-1 md:order-2">
                    <div className="hidden md:flex items-center justify-center bg-dtktmt-pink-medium w-8 h-8 rounded-full relative -right-4 border-4 border-white">
                      <Trophy size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 order-2 md:order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-dtktmt-blue-dark">2018</h3>
                      <h4 className="text-dtktmt-pink-medium font-medium mb-2">Mở rộng hoạt động</h4>
                      <p className="text-gray-700">
                        Nền tảng mở rộng với hơn 20 khóa học và 1000+ học viên, bắt đầu hợp tác với
                        các trường đại học và doanh nghiệp trong lĩnh vực công nghệ.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-dtktmt-blue-dark">2021</h3>
                      <h4 className="text-dtktmt-pink-medium font-medium mb-2">Cải tiến công nghệ</h4>
                      <p className="text-gray-700">
                        Ra mắt nền tảng học trực tuyến mới với nhiều tính năng hiện đại, 
                        nâng cao trải nghiệm người dùng và chất lượng nội dung học tập.
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
                    <div className="hidden md:flex items-center justify-center bg-dtktmt-purple-medium w-8 h-8 rounded-full relative -left-4 border-4 border-white">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right order-1 md:order-2">
                    <div className="hidden md:flex items-center justify-center bg-dtktmt-blue-dark w-8 h-8 rounded-full relative -right-4 border-4 border-white">
                      <BookOpen size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0 order-2 md:order-1">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold text-dtktmt-blue-dark">2023</h3>
                      <h4 className="text-dtktmt-pink-medium font-medium mb-2">Hiện tại và tương lai</h4>
                      <p className="text-gray-700">
                        Hiện nay, DT&KTMT1 tự hào là nền tảng học liệu số hàng đầu với hơn 50 khóa học
                        và 5000+ học viên. Chúng tôi tiếp tục phát triển, với mục tiêu trở thành
                        nguồn tài nguyên không thể thiếu cho sinh viên và kỹ sư trong lĩnh vực.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="py-16 px-4 bg-dtktmt-blue-light/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-dtktmt-blue-dark">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
              Bạn có câu hỏi hoặc đề xuất? Hãy liên hệ với chúng tôi qua các kênh sau
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-dtktmt-blue-light rounded-full flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-dtktmt-blue-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Địa chỉ</h3>
                <p className="text-gray-700">
                  268 Lý Thường Kiệt, Phường 14, Quận 10,<br />
                  Thành phố Hồ Chí Minh
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-dtktmt-pink-light rounded-full flex items-center justify-center mb-4">
                  <Phone size={24} className="text-dtktmt-pink-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Điện thoại</h3>
                <p className="text-gray-700">
                  +84 123 456 789<br />
                  +84 987 654 321
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-dtktmt-purple-light rounded-full flex items-center justify-center mb-4">
                  <Mail size={24} className="text-dtktmt-purple-medium" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dtktmt-blue-dark">Email</h3>
                <p className="text-gray-700">
                  info@dtktmt1.edu.vn<br />
                  support@dtktmt1.edu.vn
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center text-dtktmt-blue-dark">Gửi tin nhắn cho chúng tôi</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium" 
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium" 
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Chủ đề</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium" 
                    placeholder="Nhập chủ đề"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Nội dung</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dtktmt-blue-medium h-32" 
                    placeholder="Nhập nội dung tin nhắn"
                  ></textarea>
                </div>
                <div className="md:col-span-2 text-center">
                  <button 
                    type="submit"
                    className="btn-primary px-8 py-3"
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default AboutPage;
