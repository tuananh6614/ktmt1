
import { Activity, BookOpen, Clock, FileText, Award } from "lucide-react";

interface StatsSectionProps {
  stats: {
    coursesCompleted: number;
    coursesInProgress: number;
    documentsPurchased: number;
    avgScore: number;
  };
}

const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Activity size={18} className="text-dtktmt-pink-medium mr-2" />
        Thống kê học tập
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dtktmt-blue-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
          <BookOpen size={24} className="text-dtktmt-blue-medium mb-2" />
          <p className="text-xl font-bold">{stats.coursesCompleted}</p>
          <p className="text-sm text-gray-600">Khóa học đã hoàn thành</p>
        </div>
        
        <div className="bg-dtktmt-pink-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
          <Clock size={24} className="text-dtktmt-pink-medium mb-2" />
          <p className="text-xl font-bold">{stats.coursesInProgress}</p>
          <p className="text-sm text-gray-600">Khóa học đang học</p>
        </div>
        
        <div className="bg-dtktmt-purple-light/30 p-4 rounded-lg flex flex-col items-center justify-center">
          <FileText size={24} className="text-dtktmt-purple-medium mb-2" />
          <p className="text-xl font-bold">{stats.documentsPurchased}</p>
          <p className="text-sm text-gray-600">Tài liệu đã mua</p>
        </div>
        
        <div className="bg-dtktmt-yellow/30 p-4 rounded-lg flex flex-col items-center justify-center">
          <Award size={24} className="text-dtktmt-blue-dark mb-2" />
          <p className="text-xl font-bold">{stats.avgScore}</p>
          <p className="text-sm text-gray-600">Điểm trung bình</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
