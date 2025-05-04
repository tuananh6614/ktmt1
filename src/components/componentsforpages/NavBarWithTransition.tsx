
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavBarWithTransition = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { navigateWithTransition } = usePageTransition();

  // Logic để xử lý cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants - cập nhật để mượt mà hơn
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.25,
        ease: "easeOut",
        staggerChildren: 0.04
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeIn",
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -8, opacity: 0 }
  };

  const handleLinkClick = (path: string, transitionType: 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'none') => {
    // Close mobile menu if open
    setMobileMenuOpen(false);
    
    // Navigate with animation
    navigateWithTransition(path, { type: transitionType });
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div 
            className="text-dtktmt-blue-dark font-bold text-xl cursor-pointer"
            onClick={() => handleLinkClick("/", "fade")}
          >
            DT&KTMT1
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <NavigationMenuList className="hidden md:flex">
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="nav-link px-4 py-2 text-gray-700 hover:text-dtktmt-blue-medium transition-colors"
              onClick={() => handleLinkClick("/", "fade")}
            >
              Trang chủ
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="nav-link px-4 py-2 text-gray-700 hover:text-dtktmt-blue-medium transition-colors"
              onClick={() => handleLinkClick("/khoa-hoc", "slideLeft")}
            >
              Khóa học
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="nav-link px-4 py-2 text-gray-700 hover:text-dtktmt-blue-medium transition-colors"
              onClick={() => handleLinkClick("/tai-lieu", "none")}
            >
              Tài liệu
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="nav-link px-4 py-2 text-gray-700 hover:text-dtktmt-blue-medium transition-colors"
              onClick={() => handleLinkClick("/gioi-thieu", "fade")}
            >
              Giới thiệu
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* User Controls */}
        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="outline"
            className="btn-press"
            onClick={() => handleLinkClick("/login", "scale")}
          >
            Đăng nhập
          </Button>
          <Button 
            className="btn-press"
            onClick={() => handleLinkClick("/register", "scale")}
          >
            Đăng ký
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu - cập nhật animation để mượt mà hơn */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 bg-white/95 backdrop-blur-sm shadow-lg">
              <motion.div variants={itemVariants}>
                <div 
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleLinkClick("/", "fade")}
                >
                  Trang chủ
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div 
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleLinkClick("/khoa-hoc", "slideLeft")}
                >
                  Khóa học
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div 
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleLinkClick("/tai-lieu", "none")}
                >
                  Tài liệu
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div 
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleLinkClick("/gioi-thieu", "fade")}
                >
                  Giới thiệu
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-4 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => handleLinkClick("/login", "scale")}
                >
                  Đăng nhập
                </Button>
                <Button 
                  className="w-full justify-center"
                  onClick={() => handleLinkClick("/register", "scale")}
                >
                  Đăng ký
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBarWithTransition;
