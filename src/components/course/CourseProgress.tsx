
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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
    <motion.div 
      className="bg-white p-4 md:p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between mb-3 items-center">
        <h3 className="font-semibold text-dtktmt-blue-dark text-base md:text-lg">Tiến độ học tập</h3>
        <motion.span 
          className="font-medium text-sm bg-dtktmt-blue-medium/10 px-3 py-1 rounded-full text-dtktmt-blue-dark"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {completedLessons}/{totalLessons} bài học
        </motion.span>
      </div>
      
      <div className="relative mt-1">
        <Progress 
          value={progress} 
          className="h-4 bg-dtktmt-blue-light/20 rounded-full"
        />
        <motion.div
          className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute top-0 right-0 h-full w-2 bg-white/50"
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </div>
      
      <div className="flex justify-end mt-2">
        <motion.div 
          className="flex items-center gap-1"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-medium text-dtktmt-blue-dark">{progress}%</span>
          <span className="text-sm text-dtktmt-blue-dark/80">hoàn thành</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
