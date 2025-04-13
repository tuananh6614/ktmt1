
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    title: "Khóa học mới về Vi xử lý",
    description: "Tìm hiểu về kiến trúc và lập trình vi điều khiển hiện đại",
    image: "/placeholder.svg",
    link: "/khoa-hoc/vi-xu-ly",
  },
  {
    id: "2",
    title: "Tài liệu điện tử số",
    description: "Tất cả tài liệu bạn cần cho môn học Điện tử số",
    image: "/placeholder.svg",
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
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] bg-gradient-to-r from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium border-4 border-white/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] bg-[url('/placeholder.svg')] opacity-20 blur-sm" style={{backgroundSize: "cover", backgroundPosition: "center"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dtktmt-blue-light/80 via-dtktmt-blue-medium/80 to-dtktmt-purple-medium/80"></div>
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
            <div className="flex flex-col justify-center px-8 md:px-16">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-white glowing-text relative"
              >
                <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-white/70 rounded-full"></span>
                {currentItem.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 mb-6"
              >
                {currentItem.description}
              </motion.p>
              <motion.a
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                href={currentItem.link}
                className="bg-white text-dtktmt-blue-dark hover:bg-dtktmt-blue-light hover:text-white px-6 py-3 rounded-full inline-flex items-center gap-2 font-medium transition-all w-fit shadow-lg hover:shadow-xl transform hover:translate-x-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Khám phá ngay
                <ArrowRight size={16} className="animate-bounce-light" />
              </motion.a>
            </div>
            <div className="hidden md:flex items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl transform hover:rotate-0 transition-transform duration-500"
                style={{ 
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  transform: "perspective(1000px) rotateX(5deg) rotateY(-5deg)"
                }}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dtktmt-blue-dark/50 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8 shadow-lg shadow-white/30"
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
      <motion.button 
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm z-20"
        onClick={prevSlide}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm z-20"
        onClick={nextSlide}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="rgba(255,255,255,0.1)"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="rgba(255,255,255,0.2)"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="rgba(255,255,255,0.3)"></path>
        </svg>
      </div>
    </div>
  );
};

export default FeaturedSection;
