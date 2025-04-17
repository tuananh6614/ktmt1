
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
}

const items: FeaturedItem[] = [
  {
    id: "1",
    title: "Lập trình nhúng với ARM Cortex-M",
    description: "Kiến thức chuyên sâu về lập trình nhúng sử dụng kiến trúc ARM Cortex-M",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/khoa-hoc/vi-xu-ly",
    color: "from-blue-500/80 to-purple-500/80",
  },
  {
    id: "2",
    title: "Tài liệu điện tử số",
    description: "Tất cả tài liệu bạn cần cho môn học Điện tử số",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/tai-lieu/dien-tu-so",
    color: "from-purple-500/80 to-pink-500/80",
  },
  {
    id: "3",
    title: "Hỗ trợ đồ án điện tử, công nghệ",
    description: "Uy tín, giá rẻ, chất lượng cao, liên hệ",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "https://www.facebook.com/boycantien/",
    color: "from-emerald-500/80 to-blue-500/80",
  },
];

const FeaturedSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl h-[350px] bg-gradient-to-r from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium mb-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentItem.color}`}></div>
      </div>
      
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentItem.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            <div className="flex flex-col justify-center px-8 md:px-12 space-y-4">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentItem.title}
              </motion.h2>
              <motion.p 
                className="text-white/90 mb-5 text-base max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentItem.description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to={currentItem.link}
                  className="glass-card bg-white/20 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 font-medium transition-all hover:bg-white hover:text-dtktmt-blue-dark hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl premium-card"
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <button 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 z-20 backdrop-blur-sm transition-all hover:scale-110"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <button 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 z-20 backdrop-blur-sm transition-all hover:scale-110"
        onClick={nextSlide}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default FeaturedSection;
