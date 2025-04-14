
import { useState } from "react";
import { ChevronDown, BookOpen, CheckCircle, Clock, HelpCircle } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Quiz {
  id: string;
  title: string;
  questionCount: number;
  timeLimit: number;
  completed: boolean;
  score?: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: Lesson[];
  quiz: Quiz;
}

interface ChapterListProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  activeLessonId: string | null;
  onChapterClick: (chapterId: string) => void;
  onLessonClick: (lessonId: string) => void;
  onShowQuiz: (chapterId: string) => void;
}

export const ChapterList = ({
  chapters,
  activeChapterId,
  activeLessonId,
  onChapterClick,
  onLessonClick,
  onShowQuiz,
}: ChapterListProps) => {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
    onChapterClick(chapterId);
  };

  return (
    <div className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-dtktmt-blue-light/30 to-dtktmt-purple-light/30">
        <h2 className="text-lg font-semibold text-dtktmt-blue-dark">Nội dung khóa học</h2>
      </div>
      
      <Accordion 
        type="multiple" 
        value={expandedChapters} 
        className="px-2"
      >
        {chapters.map((chapter) => (
          <AccordionItem 
            key={chapter.id} 
            value={chapter.id}
            className={cn(
              "border-b border-gray-100 overflow-hidden transition-all duration-300",
              activeChapterId === chapter.id ? "bg-dtktmt-blue-light/10" : "bg-white"
            )}
          >
            <AccordionTrigger
              onClick={() => toggleChapter(chapter.id)}
              className="px-4 py-3 hover:no-underline"
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1 rounded-md",
                    chapter.progress === 100
                      ? "bg-green-100 text-green-600"
                      : chapter.progress > 0
                      ? "bg-dtktmt-blue-light/30 text-dtktmt-blue-dark"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {chapter.progress === 100 ? (
                      <CheckCircle size={16} />
                    ) : (
                      <BookOpen size={16} />
                    )}
                  </div>
                  <span className="font-semibold">{chapter.title}</span>
                </div>
                <div className="flex items-center mt-1 gap-5 w-full pr-8">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    <span>{chapter.lessons.length} bài học</span>
                  </div>
                  <div className="flex-grow relative h-1 bg-gray-100 rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-purple-medium rounded-full"
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-dtktmt-blue-dark">
                    {chapter.progress}%
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-1 pt-0">
              <div className="space-y-1 pl-8 pr-2">
                {chapter.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick(lesson.id)}
                    className={cn(
                      "flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-all duration-200",
                      activeLessonId === lesson.id
                        ? "bg-gradient-to-r from-dtktmt-blue-medium/20 to-dtktmt-blue-light/30 text-dtktmt-blue-dark font-medium shadow-sm"
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <div className="flex items-center gap-2 text-left">
                      {lesson.completed ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border border-gray-300 rounded-full" />
                      )}
                      <span className={lesson.completed ? "text-gray-700" : ""}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {lesson.duration}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => onShowQuiz(chapter.id)}
                  className={cn(
                    "flex items-center justify-between w-full py-2 px-3 mt-2 rounded-lg text-sm transition-all duration-200 border border-dashed",
                    activeChapterId === chapter.id && !activeLessonId
                      ? "bg-dtktmt-purple-light/30 text-dtktmt-purple-medium border-dtktmt-purple-medium/30 font-medium"
                      : "hover:bg-dtktmt-purple-light/10 text-dtktmt-purple-medium border-dtktmt-purple-light"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} />
                    <span>{chapter.quiz.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {chapter.quiz.completed && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {chapter.quiz.score}/{chapter.quiz.questionCount}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {chapter.quiz.timeLimit} phút
                    </span>
                  </div>
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
