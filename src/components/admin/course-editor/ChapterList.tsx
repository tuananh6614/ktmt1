import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import LessonList from './LessonList';
import { API_URL } from '../../../config/api';

interface Chapter {
  id: number;
  course_id: number;
  title: string;
  chapter_order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  lesson_order: number;
}

interface ChapterListProps {
  courseId: number;
  chapters: Chapter[];
  onDataChanged: () => void;
}

const ChapterList = ({ courseId, chapters, onDataChanged }: ChapterListProps) => {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [editChapterTitle, setEditChapterTitle] = useState('');

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) {
      toast.error('Vui lòng nhập tên chương');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/chapters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: courseId,
          title: newChapterTitle,
          chapter_order: chapters.length + 1
        })
      });

      if (!response.ok) {
        throw new Error('Không thể thêm chương mới');
      }

      const data = await response.json();
      toast.success('Thêm chương mới thành công');
      setNewChapterTitle('');
      setIsAddingChapter(false);
      onDataChanged();
      
      // Tự động mở rộng chương mới thêm
      setExpandedChapters(prev => [...prev, data.id]);
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error('Lỗi khi thêm chương mới');
    }
  };

  const handleDeleteChapter = async (chapterId: number, chapterTitle: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chương "${chapterTitle}"? Hành động này sẽ xóa tất cả bài học trong chương này.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa chương');
      }

      toast.success(`Đã xóa chương "${chapterTitle}"`);
      onDataChanged();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Lỗi khi xóa chương');
    }
  };

  const handleUpdateChapter = async (chapterId: number) => {
    if (!editChapterTitle.trim()) {
      toast.error('Vui lòng nhập tên chương');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const chapter = chapters.find(c => c.id === chapterId);
      if (!chapter) {
        throw new Error('Không tìm thấy thông tin chương');
      }

      const response = await fetch(`${API_URL}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editChapterTitle,
          chapter_order: chapter.chapter_order
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật chương');
      }

      toast.success('Cập nhật chương thành công');
      setEditingChapter(null);
      onDataChanged();
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast.error('Lỗi khi cập nhật chương');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Danh sách chương</h2>
        <button
          onClick={() => setIsAddingChapter(true)}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus size={16} className="mr-1" />
          Thêm chương mới
        </button>
      </div>

      {isAddingChapter && (
        <div className="mb-4 p-4 border border-green-200 bg-green-50 rounded-md">
          <h3 className="text-md font-medium text-green-800 mb-2">Thêm chương mới</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Nhập tên chương mới"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddChapter}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Thêm
            </button>
            <button
              onClick={() => {
                setIsAddingChapter(false);
                setNewChapterTitle('');
              }}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-600">
          Chưa có chương nào trong khóa học này
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4">
                <div className="flex justify-between items-center">
                  {editingChapter === chapter.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editChapterTitle}
                        onChange={(e) => setEditChapterTitle(e.target.value)}
                        placeholder="Nhập tên chương"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateChapter(chapter.id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingChapter(null)}
                        className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleChapter(chapter.id)}
                    >
                      {expandedChapters.includes(chapter.id) ? (
                        <ChevronUp size={20} className="text-gray-600 mr-2" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600 mr-2" />
                      )}
                      <h3 className="text-lg font-medium text-gray-800">{chapter.title}</h3>
                      <span className="ml-2 text-sm text-gray-500">
                        ({chapter.lessons?.length || 0} bài học)
                      </span>
                    </div>
                  )}
                  
                  {editingChapter !== chapter.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingChapter(chapter.id);
                          setEditChapterTitle(chapter.title);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Sửa chương"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Xóa chương"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {expandedChapters.includes(chapter.id) && (
                <div className="p-4">
                  <LessonList 
                    chapterId={chapter.id} 
                    lessons={chapter.lessons || []} 
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

export default ChapterList; 