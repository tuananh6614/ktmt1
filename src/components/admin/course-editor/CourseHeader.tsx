import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { X, Upload, Edit } from 'lucide-react';
import { API_URL } from '../../../config/api';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
}

interface CourseHeaderProps {
  course: Course;
  onCourseUpdated: () => void;
}

const CourseHeader = ({ course, onCourseUpdated }: CourseHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    status: course.status
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(course.thumbnail);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Kiểm tra loại file
      if (!file.type.match('image.*')) {
        toast.error('Vui lòng chọn file hình ảnh (jpg, jpeg, png, gif)');
        return;
      }
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Tạo URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin khóa học');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      // Nếu có file ảnh mới, sử dụng API upload
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('thumbnail', selectedFile);

        const response = await fetch(`${API_URL}/courses/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật khóa học');
        }

        await response.json();
      } else {
        // Nếu không có file ảnh mới, sử dụng API cập nhật thông thường
        const response = await fetch(`${API_URL}/courses/${course.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            thumbnail: course.thumbnail,
            status: formData.status
          })
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật khóa học');
        }

        await response.json();
      }

      toast.success('Cập nhật khóa học thành công');
      setIsEditing(false);
      onCourseUpdated();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Lỗi khi cập nhật khóa học');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {isEditing ? (
        <form onSubmit={handleUpdateCourse}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khóa học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tên khóa học"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả khóa học"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
              </label>
              <div className="mt-1 flex items-center">
                <div
                  className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer ${
                    previewUrl ? 'border-gray-300' : 'border-gray-400 hover:border-blue-500'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Ảnh xem trước"
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl(course.thumbnail);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Nhấn để tải lên hoặc kéo thả file vào đây
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        Hỗ trợ JPG, JPEG, PNG, GIF (Max: 5MB)
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : 'Cập nhật khóa học'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Edit size={18} className="mr-1" />
              Chỉnh sửa
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-48 object-cover rounded-lg border border-gray-200" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                }}
              />
              
              <div className="mt-3 flex items-center">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.status === 'active' ? 'Đang hoạt động' : 'Đã ẩn'}
                </span>
                <span className="ml-2 text-sm text-gray-500">ID: {course.id}</span>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="font-medium text-gray-700 mb-2">Mô tả khóa học</h3>
              <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseHeader; 