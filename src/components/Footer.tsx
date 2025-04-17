
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Youtube, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-dtktmt-blue-light/10 pt-16 pb-6 border-t border-dtktmt-blue-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark rounded-full p-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </div>
              <span className="font-montserrat font-bold text-2xl text-dtktmt-blue-dark">DT&KTMT1</span>
            </Link>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              Cung cấp học liệu, khóa học chất lượng cao về Điện Tử và Kỹ Thuật Máy Tính.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-3 rounded-full transition-colors duration-300 shadow-md">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-3 rounded-full transition-colors duration-300 shadow-md">
                <Youtube size={20} />
              </a>
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-3 rounded-full transition-colors duration-300 shadow-md">
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-dtktmt-blue-dark border-b pb-2 border-dtktmt-blue-light/30">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/khoa-hoc" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Khóa học
                </Link>
              </li>
              <li>
                <Link to="/tai-lieu" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-dtktmt-blue-medium hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium mr-2"></span>
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-dtktmt-blue-dark border-b pb-2 border-dtktmt-blue-light/30">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-dtktmt-blue-light/30 p-2 rounded-full mt-0.5">
                  <MapPin size={18} className="text-dtktmt-blue-dark flex-shrink-0" />
                </div>
                <span className="text-gray-600">268 Lý Thường Kiệt, Phường 14, Quận 10, TP HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-dtktmt-blue-light/30 p-2 rounded-full">
                  <Phone size={18} className="text-dtktmt-blue-dark flex-shrink-0" />
                </div>
                <span className="text-gray-600">+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-dtktmt-blue-light/30 p-2 rounded-full">
                  <Mail size={18} className="text-dtktmt-blue-dark flex-shrink-0" />
                </div>
                <span className="text-gray-600">info@dtktmt1.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dtktmt-blue-light/30 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-gray-500 text-sm mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} DT&KTMT1. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-dtktmt-blue-medium text-sm">Chính sách bảo mật</a>
              <a href="#" className="text-gray-500 hover:text-dtktmt-blue-medium text-sm">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
