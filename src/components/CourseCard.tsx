
import { Book, Clock, BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: number;
  duration: string;
  level: string;
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
      <div className="card-3d group h-full hover:animate-wobble">
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dtktmt-blue-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-dtktmt-blue-light">
              <div 
                className="h-full bg-dtktmt-blue-medium" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <div className="absolute -top-2 -right-2 bg-dtktmt-yellow rounded-full px-2 py-1 text-xs font-bold transform rotate-12 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            Hot!
          </div>
        </div>
        <div className="p-5 transition-all duration-300 group-hover:bg-gradient-to-br from-white to-dtktmt-blue-light/20">
          <h3 className="text-lg font-bold mb-2 text-dtktmt-blue-dark group-hover:text-dtktmt-blue-medium transition-colors duration-300 group-hover:animate-text-pop">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
          <div className="border-t pt-3 mt-3 grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div className="flex flex-col items-center group-hover:animate-bounce-light" style={{ animationDelay: '0.1s' }}>
              <Book size={16} className="text-dtktmt-blue-medium mb-1" />
              <span>{lessons} bài học</span>
            </div>
            <div className="flex flex-col items-center group-hover:animate-bounce-light" style={{ animationDelay: '0.2s' }}>
              <Clock size={16} className="text-dtktmt-blue-medium mb-1" />
              <span>{duration}</span>
            </div>
            <div className="flex flex-col items-center group-hover:animate-bounce-light" style={{ animationDelay: '0.3s' }}>
              <Award size={16} className="text-dtktmt-pink-medium mb-1" />
              <span>{level}</span>
            </div>
          </div>
          {progress !== undefined && (
            <div className="mt-3 text-sm text-dtktmt-blue-dark font-medium">
              <span>Tiến độ: {progress}%</span>
            </div>
          )}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="text-dtktmt-blue-medium text-sm font-medium flex items-center">
              <span>Xem chi tiết</span>
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
