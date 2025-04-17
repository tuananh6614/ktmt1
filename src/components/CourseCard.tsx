
import { Book, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: number;
  duration?: string;
  level?: string;
  progress?: number;
}

const CourseCard = ({
  id,
  title,
  description,
  image,
  lessons,
  duration,
  level,
  progress,
}: CourseCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/khoa-hoc/${id}`}>
        <div className="relative">
          <img 
            src={image || "/placeholder.svg"} 
            alt={title}
            className="w-full h-48 object-cover" 
          />
          {level && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-dtktmt-blue-dark">
              {level}
            </div>
          )}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-dtktmt-blue-light/40">
              <div 
                className="h-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-dtktmt-blue-dark mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
          
          <div className="flex items-center justify-between text-xs border-t pt-3">
            <div className="flex items-center gap-1 text-dtktmt-blue-dark">
              <Book size={14} />
              <span>{lessons} bài học</span>
            </div>
            
            {duration && (
              <div className="flex items-center gap-1 text-dtktmt-purple-dark">
                <Clock size={14} />
                <span>{duration}</span>
              </div>
            )}
          </div>
          
          {progress !== undefined && (
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-dtktmt-blue-dark font-medium">Tiến độ: {progress}%</span>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center gap-1 text-dtktmt-blue-medium cursor-help">
                    <span>Chi tiết</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="top" className="p-3 max-w-xs">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Chi tiết tiến độ</h4>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Đã học: {Math.round(progress/100 * lessons)} bài</span>
                      <span>Còn lại: {lessons - Math.round(progress/100 * lessons)} bài</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}

          <div className="mt-3 text-center">
            <div className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white text-xs font-medium py-1.5 px-3 rounded-full inline-flex items-center gap-1 transition-all hover:shadow-md">
              <span>Xem chi tiết</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
