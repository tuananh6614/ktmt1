import { Book, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons?: number;
  duration?: string;
  level?: string;
  progress?: number;
  status?: 'active' | 'inactive' | 'maintenance';
}

const CourseCard = ({
  id,
  title,
  description,
  image,
  lessons = 0,
  duration,
  level,
  progress,
  status = 'active',
}: CourseCardProps) => {
  if (status !== 'active') {
    return null;
  }
  
  return (
    <Link to={`/khoa-hoc/${id}`} className="block h-full">
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="premium-card overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl h-full flex flex-col cursor-pointer"
      >
        <div className="block h-full flex flex-col">
          <div className="relative">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={image || "/placeholder.svg"} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            {level && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-dtktmt-blue-dark shadow-md">
                {level}
              </div>
            )}
            {progress !== undefined && (
              <div className="absolute bottom-0 left-0 w-full h-2 bg-dtktmt-blue-light/40">
                <div 
                  className="h-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          
          <div className="p-5 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-bold text-dtktmt-blue-dark mb-2 line-clamp-2 text-lg h-14">
                {title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                {description}
              </p>
            </div>
            
            <div className="mt-auto">
              {lessons > 0 && (
                <div className="flex items-center justify-between text-xs border-t pt-4 mt-2">  
                </div>
              )}
              
              {progress !== undefined && (
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-dtktmt-blue-dark font-medium">Tiến độ: {progress}%</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="flex items-center gap-1.5 text-dtktmt-blue-medium cursor-help">
                        <span>Chi tiết</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-dtktmt-blue-medium" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="p-4 max-w-xs">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Chi tiết tiến độ</h4>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Đã học: {Math.round(progress/100 * (lessons || 0))} bài</span>
                          <span>Còn lại: {(lessons || 0) - Math.round(progress/100 * (lessons || 0))} bài</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              )}

              <div className="mt-4">
                <div className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium text-white text-sm font-medium py-2 px-4 rounded-full inline-flex items-center gap-1.5 transition-all hover:shadow-md w-full justify-center">
                  <span>Xem chi tiết</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
