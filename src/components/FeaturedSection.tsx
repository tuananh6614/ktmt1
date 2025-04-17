
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
}

const items: FeaturedItem[] = [
  {
    id: "1",
    title: "Lập trình nhúng với ARM Cortex-M",
    description: "Kiến thức chuyên sâu về lập trình nhúng sử dụng kiến trúc ARM Cortex-M",
    image: "/lovable-uploads/47f9d951-4fcc-4c74-a8c6-618391ab6fcd.png",
    link: "/khoa-hoc/vi-xu-ly",
  },
  {
    id: "2",
    title: "Tài liệu điện tử số",
    description: "Tất cả tài liệu bạn cần cho môn học Điện tử số",
    image: "/lovable-uploads/f747d1e0-acc6-4f25-ae71-e10a2c8015e7.png",
    link: "/tai-lieu/dien-tu-so",
  },
  {
    id: "3",
    title: "Bài kiểm tra năng lực",
    description: "Kiểm tra kiến thức của bạn với các bài kiểm tra chất lượng cao",
    image: "/placeholder.svg",
    link: "/kiem-tra",
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
    <div className="relative overflow-hidden rounded-xl shadow-lg h-[280px] bg-gradient-to-r from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dtktmt-blue-medium/80 to-dtktmt-purple-medium/80"></div>
      </div>
      
      <AnimatePresence initial={false} custom={direction}>
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
            <div className="flex flex-col justify-center px-6 md:px-10">
              <motion.h2 
                className="text-xl md:text-2xl font-bold mb-2 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentItem.title}
              </motion.h2>
              <motion.p 
                className="text-white/90 mb-5 text-sm"
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
                  className="bg-white text-dtktmt-blue-dark px-5 py-2 rounded-full inline-flex items-center gap-2 font-medium transition-all hover:shadow-md hover:bg-dtktmt-blue-light hover:text-white text-sm"
                >
                  Khám phá ngay
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md rounded-xl overflow-hidden shadow-lg"
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6"
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
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 z-20"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      
      <button 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 z-20"
        onClick={nextSlide}
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export default FeaturedSection;
