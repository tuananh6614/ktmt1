import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X, LogIn, Home, Book, FileText, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: "Trang chủ", path: "/", icon: <Home size={18} /> },
    { title: "Khóa học", path: "/khoa-hoc", icon: <Book size={18} /> },
    { title: "Tài liệu", path: "/tai-lieu", icon: <FileText size={18} /> },
    { title: "Giới thiệu", path: "/gioi-thieu", icon: <Info size={18} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-dtktmt-blue-medium text-white" : "text-dtktmt-blue-dark hover:bg-dtktmt-blue-light";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <div className="bg-dtktmt-blue-medium rounded-full p-2 group-hover:shadow-lg group-hover:shadow-dtktmt-blue-light/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white group-hover:animate-pulse-soft"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </div>
              <span className="font-montserrat font-bold text-xl text-dtktmt-blue-dark group-hover:text-dtktmt-blue-medium group-hover:scale-105 transition-all duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-dtktmt-blue-medium after:scale-x-0 after:origin-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-left">
                DT&KTMT1
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" className="relative hover:bg-transparent">
              <Bell size={20} className="text-dtktmt-blue-medium" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-dtktmt-pink-medium rounded-full"></span>
            </Button>
            <Link to="/profile">
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-dtktmt-blue-medium">
                  <img
                    src="/placeholder.svg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark flex items-center gap-1">
                <LogIn size={16} />
                Đăng nhập
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" className="relative hover:bg-transparent">
              <Bell size={20} className="text-dtktmt-blue-medium" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-dtktmt-pink-medium rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg rounded-b-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-dtktmt-blue-dark hover:bg-dtktmt-blue-light"
            >
              <User size={18} />
              Hồ sơ
            </Link>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 bg-dtktmt-blue-medium text-white"
            >
              <LogIn size={18} />
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
