import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Book, ChevronDown, ChevronUp } from 'lucide-react';
import PageList from './PageList';
import { API_URL } from '../../../config/api';

interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  lesson_order: number;
  pages?: Page[];
}

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: string;
  content: string;
}

interface LessonListProps {
  chapterId: number;
  lessons: Lesson[];
  onDataChanged: () => void;
}

const LessonList = ({ chapterId, lessons, onDataChanged }: LessonListProps) => {
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [editLessonTitle, setEditLessonTitle] = useState('');

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) {
      toast.error('Vui lòng nhập tên bài học');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapter_id: chapterId,
          title: newLessonTitle,
          lesson_order: lessons.length + 1
        })
      });

      if (!response.ok) {
        throw new Error('Không thể thêm bài học mới');
      }

      const data = await response.json();
      toast.success('Thêm bài học mới thành công');
      setNewLessonTitle('');
      setIsAddingLesson(false);
      onDataChanged();
      
      // Tự động mở rộng bài học mới thêm
      setExpandedLessons(prev => [...prev, data.id]);
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Lỗi khi thêm bài học mới');
    }
  };

  const handleDeleteLesson = async (lessonId: number, lessonTitle: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài học "${lessonTitle}"? Hành động này sẽ xóa tất cả nội dung trong bài học này.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa bài học');
      }

      toast.success(`Đã xóa bài học "${lessonTitle}"`);
      onDataChanged();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Lỗi khi xóa bài học');
    }
  };

  const handleUpdateLesson = async (lessonId: number) => {
    if (!editLessonTitle.trim()) {
      toast.error('Vui lòng nhập tên bài học');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Không tìm thấy thông tin bài học');
      }

      const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editLessonTitle,
          lesson_order: lesson.lesson_order
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật bài học');
      }

      toast.success('Cập nhật bài học thành công');
      setEditingLesson(null);
      onDataChanged();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Lỗi khi cập nhật bài học');
    }
  };

  const fetchLessonPages = async (lessonId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/lessons/${lessonId}/pages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách trang nội dung');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lesson pages:', error);
      toast.error('Lỗi khi tải danh sách trang nội dung');
      return [];
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-700">Danh sách bài học</h3>
        <button
          onClick={() => setIsAddingLesson(true)}
          className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <Plus size={14} className="mr-1" />
          Thêm bài học
        </button>
      </div>

      {isAddingLesson && (
        <div className="mb-4 p-3 border border-blue-200 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Thêm bài học mới</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="Nhập tên bài học mới"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLesson}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Thêm
            </button>
            <button
              onClick={() => {
                setIsAddingLesson(false);
                setNewLessonTitle('');
              }}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-600 text-sm">
          Chưa có bài học nào trong chương này
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3">
                <div className="flex justify-between items-center">
                  {editingLesson === lesson.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editLessonTitle}
                        onChange={(e) => setEditLessonTitle(e.target.value)}
                        placeholder="Nhập tên bài học"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateLesson(lesson.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingLesson(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center cursor-pointer flex-1"
                      onClick={() => toggleLesson(lesson.id)}
                    >
                      {expandedLessons.includes(lesson.id) ? (
                        <ChevronUp size={16} className="text-gray-600 mr-2" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-600 mr-2" />
                      )}
                      <Book size={14} className="text-blue-600 mr-1" />
                      <span className="text-md font-medium">{lesson.title}</span>
                    </div>
                  )}
                  
                  {editingLesson !== lesson.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingLesson(lesson.id);
                          setEditLessonTitle(lesson.title);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Sửa bài học"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Xóa bài học"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {expandedLessons.includes(lesson.id) && (
                <div className="p-3 bg-white">
                  <PageList 
                    lessonId={lesson.id} 
                    pages={lesson.pages}
                    onDataChanged={onDataChanged}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList; 