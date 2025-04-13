
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
    <div className="relative overflow-hidden rounded-2xl shadow-lg h-[400px] bg-gradient-to-r from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentItem.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            <div className="flex flex-col justify-center px-8 md:px-16">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
              >
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
                className="bg-white text-dtktmt-blue-dark hover:bg-dtktmt-blue-light hover:text-white px-6 py-3 rounded-full inline-flex items-center gap-2 font-medium transition-all w-fit"
              >
                Khám phá ngay
                <ArrowRight size={16} />
              </motion.a>
            </div>
            <div className="hidden md:flex items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
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
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;
