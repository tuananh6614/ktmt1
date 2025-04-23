
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, BookOpen, Clock, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Course } from "@/types/course";

interface CourseDetailProps {
  course: Course;
}

const CourseDetail = ({ course }: CourseDetailProps) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap size={16} />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{course.chapters.length} chương</span>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{course.instructor.name}</h3>
              <p className="text-sm text-gray-600">{course.instructor.title}</p>
            </div>
          </div>

          {/* Course Content */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Nội dung khóa học</h2>
            <Accordion type="single" defaultValue="chapter-0" className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <AccordionItem
                  key={chapter.id}
                  value={`chapter-${index}`}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          Chương {index + 1}
                        </span>
                        <h3 className="font-medium">{chapter.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{chapter.lessons.length} bài học</span>
                        <span>{chapter.duration}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-50">
                    <div className="p-4 space-y-3">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {lessonIndex + 1}
                            </span>
                            <h4 className="font-medium">{lesson.title}</h4>
                          </div>
                          <span className="text-sm text-gray-500">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                      {chapter.testId && (
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">
                            Kiểm tra cuối chương
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Enroll Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-dtktmt-blue-dark">
                  {course.price.toLocaleString('vi-VN')}đ
                </div>
              </div>
              
              {course.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
              
              <Button className="w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark">
                {course.progress !== undefined ? 'Tiếp tục học' : 'Đăng ký học'}
              </Button>
              
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Thời lượng</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số chương</span>
                  <span>{course.chapters.length} chương</span>
                </div>
                <div className="flex justify-between">
                  <span>Trình độ</span>
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
