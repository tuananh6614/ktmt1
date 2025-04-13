
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Youtube, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md pt-10 pb-4 wave-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-dtktmt-blue-medium rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </div>
              <span className="font-montserrat font-bold text-xl text-dtktmt-blue-dark">DT&KTMT1</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Cung cấp học liệu, khóa học chất lượng cao về Điện Tử và Kỹ Thuật Máy Tính.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-2 rounded-full transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-2 rounded-full transition-colors duration-300">
                <Youtube size={20} />
              </a>
              <a href="#" className="bg-dtktmt-blue-light hover:bg-dtktmt-blue-medium text-dtktmt-blue-dark hover:text-white p-2 rounded-full transition-colors duration-300">
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-dtktmt-blue-dark">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Trang chủ</Link>
              </li>
              <li>
                <Link to="/khoa-hoc" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Khóa học</Link>
              </li>
              <li>
                <Link to="/tai-lieu" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Tài liệu</Link>
              </li>
              <li>
                <Link to="/gioi-thieu" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-dtktmt-blue-dark hover:underline transition-all">Đăng ký</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-dtktmt-blue-dark">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="text-dtktmt-blue-medium flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">268 Lý Thường Kiệt, Phường 14, Quận 10, TP HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-dtktmt-blue-medium flex-shrink-0" />
                <span className="text-gray-600">+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-dtktmt-blue-medium flex-shrink-0" />
                <span className="text-gray-600">info@dtktmt1.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dtktmt-blue-light/30 mt-8 pt-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DT&KTMT1. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
