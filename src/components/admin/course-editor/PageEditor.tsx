import { useState, useEffect } from 'react';

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: string;
  content: string;
}

interface VideoData {
  videoUrl: string;
  title: string;
}

interface PageEditorProps {
  page: Page;
  onSave: (page: Page) => void;
  onCancel: () => void;
}

const PageEditor = ({ page, onSave, onCancel }: PageEditorProps) => {
  const [content, setContent] = useState(page.content);
  const [pageType, setPageType] = useState(page.page_type);
  const [videoData, setVideoData] = useState<VideoData>({ videoUrl: '', title: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Khởi tạo dữ liệu
    setPageType(page.page_type);
    setContent(page.content);

    // Nếu là trang video, parse nội dung video
    if (page.page_type === 'video') {
      try {
        const parsed = JSON.parse(page.content) as VideoData;
        setVideoData(parsed);
      } catch (e) {
        setError('Dữ liệu video không hợp lệ');
        setVideoData({ videoUrl: '', title: 'Video bài học' });
      }
    }
  }, [page]);

  const handleSave = () => {
    // Kiểm tra dữ liệu trước khi lưu
    if (pageType === 'text' && !content.trim()) {
      setError('Vui lòng nhập nội dung văn bản');
      return;
    }

    if (pageType === 'video') {
      if (!videoData.videoUrl.trim()) {
        setError('Vui lòng nhập đường dẫn video');
        return;
      }

      if (!videoData.title.trim()) {
        setError('Vui lòng nhập tiêu đề video');
        return;
      }
    }

    // Chuẩn bị dữ liệu để lưu
    const updatedPage: Page = {
      ...page,
      page_type: pageType,
      content: pageType === 'video' ? JSON.stringify(videoData) : content
    };

    onSave(updatedPage);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    // Xử lý URL YouTube để lấy đường dẫn embed
    if (!url) return '';
    
    let videoId = '';
    
    // Xử lý các dạng URL YouTube phổ biến
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(youtubeRegex);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const renderTextEditor = () => (
    <div className="p-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung HTML
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md h-48 font-mono text-sm"
          placeholder="Nhập nội dung HTML cho trang..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Hỗ trợ các thẻ HTML cơ bản như: h1, h2, p, ul, li, strong, em, img, v.v.
        </p>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Xem trước:</h4>
        <div 
          className="border border-gray-200 rounded-md p-3 bg-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );

  const renderVideoEditor = () => (
    <div className="p-4">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đường dẫn video
        </label>
        <input
          type="text"
          value={videoData.videoUrl}
          onChange={(e) => setVideoData(prev => ({ ...prev, videoUrl: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nhập URL YouTube hoặc URL video khác..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Hỗ trợ các URL YouTube (ví dụ: https://www.youtube.com/watch?v=abcdef12345)
        </p>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề video
        </label>
        <input
          type="text"
          value={videoData.title}
          onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nhập tiêu đề video..."
        />
      </div>

      {videoData.videoUrl && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Xem trước:</h4>
          <div className="border border-gray-200 rounded-md p-2 bg-white">
            <h3 className="text-lg font-medium mb-2">{videoData.title}</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={getYoutubeEmbedUrl(videoData.videoUrl)}
                className="w-full h-56"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoData.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm mx-4 mt-2 rounded">
          {error}
        </div>
      )}
      
      <div className="p-3">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại trang
          </label>
          <select
            value={pageType}
            onChange={(e) => {
              setPageType(e.target.value);
              setError(null);
              
              // Khởi tạo lại nội dung khi chuyển loại trang
              if (e.target.value === 'text') {
                setContent('<h2>Tiêu đề trang</h2><p>Nội dung trang</p>');
              } else if (e.target.value === 'video') {
                setVideoData({ videoUrl: '', title: 'Video bài học' });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="text">Văn bản</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {pageType === 'text' ? renderTextEditor() : renderVideoEditor()}

      <div className="flex justify-end p-4 space-x-2 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default PageEditor; 