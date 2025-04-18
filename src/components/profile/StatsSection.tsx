
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
    <Card className="p-4 bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Activity size={18} className="text-dtktmt-pink-medium mr-2" />
        Thống kê học tập
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="group bg-gradient-to-br from-dtktmt-blue-light/30 to-dtktmt-blue-medium/20 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dtktmt-blue-medium/20 group-hover:bg-dtktmt-blue-medium/30 transition-colors">
              <BookOpen size={20} className="text-dtktmt-blue-dark" />
            </div>
            <div>
              <p className="text-xl font-bold text-dtktmt-blue-dark group-hover:scale-110 transition-transform">
                {stats.coursesCompleted}
              </p>
              <p className="text-xs text-gray-600">Khóa học đã hoàn thành</p>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-pink-light/30 to-dtktmt-pink-medium/20 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dtktmt-pink-medium/20 group-hover:bg-dtktmt-pink-medium/30 transition-colors">
              <Clock size={20} className="text-dtktmt-pink-dark" />
            </div>
            <div>
              <p className="text-xl font-bold text-dtktmt-pink-dark group-hover:scale-110 transition-transform">
                {stats.coursesInProgress}
              </p>
              <p className="text-xs text-gray-600">Khóa học đang học</p>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-purple-light/30 to-dtktmt-purple-medium/20 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dtktmt-purple-medium/20 group-hover:bg-dtktmt-purple-medium/30 transition-colors">
              <FileText size={20} className="text-dtktmt-purple-medium" />
            </div>
            <div>
              <p className="text-xl font-bold text-dtktmt-purple-medium group-hover:scale-110 transition-transform">
                {stats.documentsPurchased}
              </p>
              <p className="text-xs text-gray-600">Tài liệu đã mua</p>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-dtktmt-yellow/30 to-dtktmt-yellow/20 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dtktmt-yellow/20 group-hover:bg-dtktmt-yellow/30 transition-colors">
              <Award size={20} className="text-dtktmt-blue-dark" />
            </div>
            <div>
              <p className="text-xl font-bold text-dtktmt-blue-dark group-hover:scale-110 transition-transform">
                {stats.avgScore}
              </p>
              <p className="text-xs text-gray-600">Điểm trung bình</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsSection;
