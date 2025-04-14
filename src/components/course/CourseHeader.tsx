
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface CourseHeaderProps {
  title: string;
  description: string;
  image: string;
  instructor: string;
  rating: number;
  ratingCount: number;
  duration: string;
}

export const CourseHeader = ({
  title,
  description,
  image,
  instructor,
  rating,
  ratingCount,
  duration
}: CourseHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
      <motion.div 
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="rounded-2xl overflow-hidden shadow-xl w-full md:w-1/3 aspect-video relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="w-full md:w-2/3 space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-dtktmt-blue-dark via-dtktmt-blue-medium to-dtktmt-purple-medium bg-clip-text text-transparent">
          {title}
        </h1>
        
        <p className="text-gray-600">{description}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="bg-dtktmt-blue-light/20 px-4 py-2 rounded-full flex items-center gap-1">
            <span className="font-semibold text-dtktmt-blue-dark">Giảng viên:</span>
            <span>{instructor}</span>
          </div>
          
          <div className="bg-dtktmt-purple-light/30 px-4 py-2 rounded-full flex items-center gap-1">
            <span className="font-semibold text-dtktmt-blue-dark">Thời lượng:</span>
            <span>{duration}</span>
          </div>
          
          <div className="bg-dtktmt-yellow/20 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="font-semibold text-dtktmt-blue-dark">Đánh giá:</span>
            <div className="flex items-center">
              <span className="font-bold mr-1">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(rating)
                        ? "text-dtktmt-yellow fill-dtktmt-yellow"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-gray-500">({ratingCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
