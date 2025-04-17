
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CoursePromoBannerProps {
  title: string;
  description: string;
  image: string;
  courseId: string;
  color: string;
  position?: "left" | "right";
}

const CoursePromoBanner = ({
  title,
  description,
  image,
  courseId,
  color,
  position = "left",
}: CoursePromoBannerProps) => {
  const bgGradient = 
    color === "blue" ? "from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-blue-dark" :
    color === "purple" ? "from-dtktmt-purple-light via-dtktmt-purple-medium to-dtktmt-purple-dark" :
    color === "cyan" ? "from-sky-400 via-cyan-500 to-cyan-600" :
    color === "green" ? "from-emerald-400 via-green-500 to-emerald-600" :
    "from-dtktmt-blue-light via-dtktmt-blue-medium to-dtktmt-purple-medium";

  return (
    <motion.div 
      className={`w-full rounded-2xl overflow-hidden shadow-xl mb-16`}
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={`bg-gradient-to-r ${bgGradient} p-8 md:p-10`}>
        <div className={`flex flex-col ${position === "left" ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}>
          <div className={`w-full md:w-1/2 ${position === "right" ? "md:pl-6" : "md:pr-6"}`}>
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-white/90 mb-6 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to={`/khoa-hoc/${courseId}`}>
                <Button 
                  className="bg-white hover:bg-gray-100 text-dtktmt-blue-dark hover:text-dtktmt-blue-medium px-8 py-6 h-auto rounded-full group shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <span className="font-medium">Đăng ký ngay</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <motion.div 
              className="relative w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
            >
              <div className="premium-card rounded-xl overflow-hidden shadow-2xl aspect-[16/10] bg-white p-2">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="text-dtktmt-blue-dark font-bold flex items-center text-lg">
                  <span>Mở ngay</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursePromoBanner;
