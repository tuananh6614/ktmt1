
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export const CourseProgress = ({
  progress,
  completedLessons,
  totalLessons,
}: CourseProgressProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex justify-between mb-2 items-center">
        <h3 className="font-semibold text-dtktmt-blue-dark">Tiến độ học tập</h3>
        <span className="font-medium text-sm bg-dtktmt-blue-medium/10 px-3 py-1 rounded-full text-dtktmt-blue-dark">
          {completedLessons}/{totalLessons} bài học
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-dtktmt-blue-light/30"
        />
        <div
          className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 h-full w-2 bg-white/50 animate-pulse-soft"></div>
        </div>
      </div>
      
      <div className="flex justify-end mt-1">
        <span className="text-sm font-medium text-dtktmt-blue-dark">{progress}% hoàn thành</span>
      </div>
    </div>
  );
};
