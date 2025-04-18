
import { Activity, BookOpen, Clock, FileText, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Activity size={20} className="text-dtktmt-pink-medium mr-2" />
        Thống kê học tập
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="group bg-gradient-to-br from-dtktmt-blue-light/30 to-dtktmt-blue-medium/20 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-dtktmt-blue-medium/20 group-hover:bg-dtktmt-blue-medium/30 transition-colors mb-3">
            <BookOpen size={24} className="text-dtktmt-blue-dark" />
          </div>
          <p className="text-2xl font-bold text-dtktmt-blue-dark mb-1 group-hover:scale-110 transition-transform">
            {stats.coursesCompleted}
          </p>
          <p className="text-sm text-gray-600">Khóa học đã hoàn thành</p>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-pink-light/30 to-dtktmt-pink-medium/20 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-dtktmt-pink-medium/20 group-hover:bg-dtktmt-pink-medium/30 transition-colors mb-3">
            <Clock size={24} className="text-dtktmt-pink-dark" />
          </div>
          <p className="text-2xl font-bold text-dtktmt-pink-dark mb-1 group-hover:scale-110 transition-transform">
            {stats.coursesInProgress}
          </p>
          <p className="text-sm text-gray-600">Khóa học đang học</p>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-purple-light/30 to-dtktmt-purple-medium/20 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-dtktmt-purple-medium/20 group-hover:bg-dtktmt-purple-medium/30 transition-colors mb-3">
            <FileText size={24} className="text-dtktmt-purple-medium" />
          </div>
          <p className="text-2xl font-bold text-dtktmt-purple-medium mb-1 group-hover:scale-110 transition-transform">
            {stats.documentsPurchased}
          </p>
          <p className="text-sm text-gray-600">Tài liệu đã mua</p>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-yellow/30 to-dtktmt-yellow/20 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-dtktmt-yellow/20 group-hover:bg-dtktmt-yellow/30 transition-colors mb-3">
            <Award size={24} className="text-dtktmt-blue-dark" />
          </div>
          <p className="text-2xl font-bold text-dtktmt-blue-dark mb-1 group-hover:scale-110 transition-transform">
            {stats.avgScore}
          </p>
          <p className="text-sm text-gray-600">Điểm trung bình</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsSection;
