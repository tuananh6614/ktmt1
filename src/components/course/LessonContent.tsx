
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, HelpCircle, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz } from "@/components/course/Quiz";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LessonContentProps {
  courseData: any;
  activeChapterId: string | null;
  activeLessonId: string | null;
  showQuiz: boolean;
}

export const LessonContent = ({
  courseData,
  activeChapterId,
  activeLessonId,
  showQuiz,
}: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState<string>("noi-dung");
  
  // Reset tab when changing lessons
  useEffect(() => {
    setActiveTab("noi-dung");
  }, [activeLessonId, activeChapterId]);

  // Find active chapter and lesson
  const activeChapter = activeChapterId 
    ? courseData.chapters.find((c: any) => c.id === activeChapterId) 
    : null;
    
  const activeLesson = activeLessonId && activeChapter
    ? activeChapter.lessons.find((l: any) => l.id === activeLessonId)
    : null;
    
  // Find current quiz (either chapter quiz or final quiz)
  const activeQuiz = (() => {
    if (!showQuiz) return null;
    
    if (activeChapterId) {
      return activeChapter?.quiz;
    } else {
      return courseData.finalQuiz;
    }
  })();
  
  // If no lesson or quiz is selected, show welcome screen
  if (!activeLesson && !activeQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center p-6"
      >
        <div className="w-24 h-24 bg-dtktmt-blue-light/30 rounded-full flex items-center justify-center mb-6">
          <BookOpen size={32} className="text-dtktmt-blue-dark" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-dtktmt-blue-dark">
          Chào mừng đến với khóa học!
        </h2>
        <p className="text-gray-600 max-w-lg mb-8">
          Hãy chọn một bài học từ danh sách bên trái để bắt đầu học hoặc tiếp tục quá trình học tập của bạn.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {courseData.chapters.slice(0, 3).map((chapter: any) => (
            <div key={chapter.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-dtktmt-blue-light/20">
                  <BookOpen size={14} className="text-dtktmt-blue-dark" />
                </div>
                <h3 className="font-medium text-sm">{chapter.title}</h3>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-2">
                <div 
                  className="h-1 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-full"
                  style={{ width: `${chapter.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // Show quiz content
  if (activeQuiz) {
    return (
      <motion.div
        key={`quiz-${activeQuiz.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Quiz quiz={activeQuiz} />
      </motion.div>
    );
  }
  
  // Show lesson content
  return (
    <motion.div
      key={activeLesson.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dtktmt-blue-dark">
            {activeLesson.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeChapter.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs bg-dtktmt-blue-light/20 text-dtktmt-blue-dark px-3 py-1 rounded-full">
            <Clock size={12} />
            {activeLesson.duration}
          </span>
          {activeLesson.completed && (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <CheckCircle size={12} />
              Đã hoàn thành
            </span>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-dtktmt-blue-light/10 p-0 h-auto">
          <TabsTrigger 
            value="noi-dung"
            className="py-2 px-4 data-[state=active]:bg-dtktmt-blue-medium data-[state=active]:text-white rounded-none"
          >
            Nội dung bài học
          </TabsTrigger>
          <TabsTrigger 
            value="tai-lieu"
            className="py-2 px-4 data-[state=active]:bg-dtktmt-blue-medium data-[state=active]:text-white rounded-none"
          >
            Tài liệu
          </TabsTrigger>
          <TabsTrigger 
            value="bai-tap"
            className="py-2 px-4 data-[state=active]:bg-dtktmt-blue-medium data-[state=active]:text-white rounded-none"
          >
            Bài tập
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="noi-dung" className="mt-0">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="prose max-w-none">
                <h3>Nội dung chi tiết bài học</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, 
                  nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget tincidunt nisl 
                  nisl eget nisl. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam 
                  nisl, eget tincidunt nisl nisl eget nisl.
                </p>
                
                <p>
                  Ut at nisi vel risus finibus elementum. Donec pharetra tellus maximus tellus egestas 
                  scelerisque. Nunc feugiat lobortis consequat. Sed ac imperdiet ex, nec pulvinar quam.
                </p>
                
                <h4>Kiến thức quan trọng</h4>
                
                <ul>
                  <li>Đặc tính của vi điều khiển STM32</li>
                  <li>Cách sử dụng công cụ để lập trình</li>
                  <li>Các chế độ hoạt động của STM32</li>
                </ul>
                
                <div className="bg-dtktmt-blue-light/10 border-l-4 border-dtktmt-blue-medium p-4 my-4 rounded-r-md">
                  <h5 className="text-dtktmt-blue-dark font-semibold">Lưu ý quan trọng</h5>
                  <p className="mb-0">Hãy đảm bảo bạn đã cài đặt đầy đủ phần mềm trước khi thực hành</p>
                </div>
                
                <h4>Video hướng dẫn</h4>
                
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-gray-500">Video nội dung bài học</div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button className="px-4 py-2 text-dtktmt-blue-dark border border-dtktmt-blue-light rounded-lg flex items-center gap-2 hover:bg-dtktmt-blue-light/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Bài trước
                </button>
                
                <button className="px-4 py-2 bg-dtktmt-blue-medium text-white rounded-lg flex items-center gap-2 hover:bg-dtktmt-blue-dark transition-colors">
                  Bài tiếp theo
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="tai-lieu" className="mt-0">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tài liệu tham khảo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex gap-4">
                    <div className="p-3 bg-dtktmt-pink-light/50 rounded-lg self-start">
                      <svg className="w-6 h-6 text-dtktmt-pink-medium" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Cẩm nang STM32</h4>
                      <p className="text-sm text-gray-500 mt-1">PDF, 1.2 MB</p>
                      <button className="mt-2 text-sm text-dtktmt-blue-dark hover:text-dtktmt-blue-medium font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Tải xuống
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex gap-4">
                    <div className="p-3 bg-dtktmt-blue-light/50 rounded-lg self-start">
                      <svg className="w-6 h-6 text-dtktmt-blue-medium" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Mã nguồn mẫu</h4>
                      <p className="text-sm text-gray-500 mt-1">ZIP, 345 KB</p>
                      <button className="mt-2 text-sm text-dtktmt-blue-dark hover:text-dtktmt-blue-medium font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Tải xuống
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="bai-tap" className="mt-0">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Bài tập thực hành</h3>
                
                <div className="space-y-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                    <h4 className="font-medium text-dtktmt-blue-dark">Bài tập 1: Cấu hình GPIO</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-4">
                      Hãy cấu hình chân PA5 làm ngõ ra để điều khiển LED trên board STM32.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm overflow-auto"><code>/* Mã khởi tạo GPIO */
void GPIO_Init(void) {
  // Viết mã của bạn ở đây
  
}</code></pre>
                    </div>
                    
                    <button className="mt-4 bg-dtktmt-blue-medium/90 hover:bg-dtktmt-blue-medium text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Nộp bài
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-5">
                    <h4 className="font-medium text-dtktmt-blue-dark">Bài tập 2: Đọc nút nhấn</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-4">
                      Cấu hình chân PC13 làm ngõ vào để đọc trạng thái của nút nhấn trên board.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm overflow-auto"><code>/* Mã đọc nút nhấn */
uint8_t ReadButtonState(void) {
  // Viết mã của bạn ở đây
  
  return 0;
}</code></pre>
                    </div>
                    
                    <button className="mt-4 bg-dtktmt-blue-medium/90 hover:bg-dtktmt-blue-medium text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Nộp bài
                    </button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
