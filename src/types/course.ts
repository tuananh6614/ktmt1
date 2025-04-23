
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  chapters: Chapter[];
  price: number;
  duration?: string;
  level?: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  progress?: number;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration?: string;
  progress?: number;
  testId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  pages: Page[];
  completed?: boolean;
}

export interface Page {
  id: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  duration?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
}
