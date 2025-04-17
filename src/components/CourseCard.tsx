
import { Book, Star, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

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
    <Link to={`/khoa-hoc/${id}`}>
      <div className="card-3d group h-full hover:animate-wobble overflow-hidden">
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-dtktmt-blue-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-dtktmt-blue-light/40 backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 right-0 h-full w-1.5 bg-white/50 animate-pulse-soft"></div>
              </div>
            </div>
          )}
          {level && (
            <div className="absolute top-2 right-2">
              <div className="bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium px-2.5 py-0.5 text-xs font-bold text-white shadow-lg rounded-md">
                {level}
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={12} className="text-dtktmt-yellow fill-dtktmt-yellow" />
            ))}
          </div>
        </div>
        <div className="p-4 transition-all duration-300 group-hover:bg-gradient-to-br from-white via-white to-dtktmt-blue-light/20 rounded-b-xl">
          <h3 className="text-base font-bold mb-1.5 text-dtktmt-blue-dark group-hover:text-dtktmt-blue-medium transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2 mb-3">{description}</p>
          
          <div className="border-t pt-2.5 mt-2.5 grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center">
              <Book size={14} className="text-dtktmt-blue-medium mr-1.5" />
              <span>{lessons} bài học</span>
            </div>
            {duration && (
              <div className="flex items-center">
                <Clock size={14} className="text-dtktmt-purple-medium mr-1.5" />
                <span>{duration}</span>
              </div>
            )}
          </div>
          
          {progress !== undefined && (
            <div className="mt-2.5 text-xs font-medium flex items-center justify-between">
              <span className="text-dtktmt-blue-dark">Tiến độ:</span>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="bg-dtktmt-blue-light/30 px-2 py-0.5 rounded-full flex items-center">
                    <span className="mr-1 text-dtktmt-blue-dark">{progress}%</span>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-blue-dark animate-pulse-soft"></div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="glass-card">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-dtktmt-blue-dark">Chi tiết tiến độ</h4>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div className="h-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-full" style={{ width: `${progress}%` }}></div>
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
          
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">
            <div className="bg-gradient-to-r from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium text-white text-xs font-medium flex items-center justify-center p-1.5 rounded-md shadow-md hover:shadow-lg transition-shadow">
              <span>Xem chi tiết</span>
              <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
