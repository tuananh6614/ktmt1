import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, Video } from 'lucide-react';
import PageEditor from './PageEditor';
import { API_URL } from '../../../config/api';

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: string;
  content: string;
}

interface PageListProps {
  lessonId: number;
  pages?: Page[];
  onDataChanged: () => void;
}

const PageList = ({ lessonId, pages: initialPages, onDataChanged }: PageListProps) => {
  const [pages, setPages] = useState<Page[]>(initialPages || []);
  const [loading, setLoading] = useState(!initialPages);
  const [error, setError] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [selectedPageType, setSelectedPageType] = useState<string>('text');

  useEffect(() => {
    if (!initialPages) {
      fetchPages();
    }
  }, [lessonId, initialPages]);
  
  // Cập nhật state khi props thay đổi
  useEffect(() => {
    if (initialPages) {
      setPages(initialPages);
      setLoading(false);
    }
  }, [initialPages]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Lỗi khi tải danh sách trang nội dung');
      toast.error('Lỗi khi tải danh sách trang nội dung');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId: number, pageNumber: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa trang ${pageNumber}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const response = await fetch(`${API_URL}/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa trang');
      }

      toast.success(`Đã xóa trang ${pageNumber}`);
      fetchPages();
      onDataChanged();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Lỗi khi xóa trang');
    }
  };

  const handleSavePage = async (page: Page, isNew: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      let response;

      if (isNew) {
        // Thêm trang mới
        response = await fetch(`${API_URL}/pages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lesson_id: lessonId,
            page_number: pages.length + 1,
            page_type: page.page_type,
            content: page.content
          })
        });
      } else {
        // Cập nhật trang
        response = await fetch(`${API_URL}/pages/${page.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page_number: page.page_number,
            page_type: page.page_type,
            content: page.content
          })
        });
      }

      if (!response.ok) {
        throw new Error(`Không thể ${isNew ? 'thêm' : 'cập nhật'} trang`);
      }

      toast.success(`${isNew ? 'Thêm' : 'Cập nhật'} trang thành công`);
      setEditingPage(null);
      setIsAddingPage(false);
      fetchPages();
      onDataChanged();
    } catch (error) {
      console.error(`Error ${editingPage ? 'updating' : 'adding'} page:`, error);
      toast.error(`Lỗi khi ${editingPage ? 'cập nhật' : 'thêm'} trang`);
    }
  };

  const getPageIcon = (pageType: string) => {
    switch (pageType) {
      case 'video':
        return <Video size={14} className="text-red-600 mr-1" />;
      case 'text':
      default:
        return <FileText size={14} className="text-blue-600 mr-1" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Nội dung bài học</h4>
        <button
          onClick={() => {
            setIsAddingPage(true);
            setEditingPage(null);
          }}
          className="flex items-center px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs"
        >
          <Plus size={12} className="mr-1" />
          Thêm trang
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-center text-red-600 text-xs">
          {error}
        </div>
      ) : (
        <>
          {isAddingPage && (
            <div className="mb-4 border border-purple-200 rounded-md overflow-hidden">
              <div className="bg-purple-50 p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-purple-800">Thêm trang mới</span>
                </div>
                <div className="flex items-center">
                  <select
                    value={selectedPageType}
                    onChange={(e) => setSelectedPageType(e.target.value)}
                    className="mr-2 text-xs p-1 border border-purple-300 rounded bg-white"
                  >
                    <option value="text">Văn bản</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    onClick={() => setIsAddingPage(false)}
                    className="text-purple-800 hover:text-purple-950"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <PageEditor
                page={{
                  id: 0,
                  lesson_id: lessonId,
                  page_number: pages.length + 1,
                  page_type: selectedPageType,
                  content: selectedPageType === 'text' ? 
                    '<h2>Tiêu đề trang</h2><p>Nội dung trang</p>' : 
                    JSON.stringify({ videoUrl: '', title: 'Video bài học' })
                }}
                onSave={(page) => handleSavePage(page, true)}
                onCancel={() => setIsAddingPage(false)}
              />
            </div>
          )}

          {pages.length === 0 && !isAddingPage ? (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-center text-gray-600 text-xs">
              Chưa có trang nội dung nào trong bài học này
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-md overflow-hidden">
                  {editingPage === page.id ? (
                    <>
                      <div className="bg-blue-50 p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-800">Sửa trang {page.page_number}</span>
                        </div>
                        <button
                          onClick={() => setEditingPage(null)}
                          className="text-blue-800 hover:text-blue-950"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <PageEditor
                        page={page}
                        onSave={(updatedPage) => handleSavePage(updatedPage, false)}
                        onCancel={() => setEditingPage(null)}
                      />
                    </>
                  ) : (
                    <div className="bg-gray-50 p-2 flex justify-between items-center">
                      <div className="flex items-center">
                        {getPageIcon(page.page_type)}
                        <span className="text-sm font-medium ml-1">
                          Trang {page.page_number}: {page.page_type === 'text' ? 'Văn bản' : 'Video'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingPage(page.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Sửa trang"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id, page.page_number)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Xóa trang"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageList; 