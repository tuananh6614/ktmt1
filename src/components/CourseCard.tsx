
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
      <div className="card-3d group h-full">
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" 
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-dtktmt-blue-light">
              <div 
                className="h-full bg-dtktmt-blue-medium" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-dtktmt-blue-dark group-hover:text-dtktmt-blue-medium transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
          <div className="border-t pt-3 mt-3 grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div className="flex flex-col items-center">
              <Book size={16} className="text-dtktmt-blue-medium mb-1" />
              <span>{lessons} bài học</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={16} className="text-dtktmt-blue-medium mb-1" />
              <span>{duration}</span>
            </div>
            <div className="flex flex-col items-center">
              <Award size={16} className="text-dtktmt-pink-medium mb-1" />
              <span>{level}</span>
            </div>
          </div>
          {progress !== undefined && (
            <div className="mt-3 text-sm text-dtktmt-blue-dark font-medium">
              <span>Tiến độ: {progress}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
