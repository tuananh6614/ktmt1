import { FileText, Download, Eye, CheckCircle, X, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import BuyDocDialog from "@/components/componentsforpages/BuyDocDialog";
import { API_BASE_URL } from "@/config/config";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  fileType: string;
  preview: string;
  isPurchased?: boolean;
  categoryName?: string;
}

const clampText = (txt: string, max: number) => txt.length > max ? (txt.slice(0, max) + '...') : txt;

const PREVIEW_LIMIT = 3;

const DocumentCard = ({
  id,
  title,
  description,
  image,
  price,
  fileType,
  preview,
  isPurchased = false,
  categoryName = "",
}: DocumentCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBuyDialogOpen, setBuyDialogOpen] = useState(false);
  const [purchased, setPurchased] = useState(isPurchased);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    // Kiểm tra xem người dùng đã mua tài liệu chưa từ API
    const checkPurchaseStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Nếu không có token, người dùng chưa đăng nhập
        
        const response = await fetch(`${API_BASE_URL}/api/documents/purchase/check/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPurchased(data.purchased);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái mua:", error);
      }
    };
    
    checkPurchaseStatus();
    
    // Fallback vào localStorage nếu API không khả dụng
    const purchasedDocs = JSON.parse(localStorage.getItem("purchasedDocs") || "[]");
    if (purchasedDocs.includes(id)) {
      setPurchased(true);
    }
  }, [id]);

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để mua tài liệu!");
      return;
    }
    
    setBuyDialogOpen(true);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!purchased) {
      toast.error("Vui lòng mua tài liệu để tải xuống!");
      return;
    }
    
    setLoading(true);
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để tải xuống tài liệu!");
        setLoading(false);
        setIsDownloading(false);
        return;
      }
      
      toast.success("Đang chuẩn bị tải xuống tài liệu...");
      
      // Sử dụng fetch API để tải xuống file
      try {
        const response = await fetch(`${API_BASE_URL}/api/documents/download/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi tải xuống');
        }
        
        // Lấy tên file từ header Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${title}.${fileType}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        // Hiển thị tiến trình tải xuống
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 95) {
            clearInterval(interval);
          }
          setDownloadProgress(progress);
        }, 150);
        
        // Tạo blob và tạo URL để tải xuống
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Tạo thẻ a tạm thời để tải xuống
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Dọn dẹp
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Hoàn thành tiến trình
        clearInterval(interval);
        setDownloadProgress(100);
        
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
        }, 2000);
        
        toast.success(`Đã tải xuống "${filename}" thành công!`);
      } catch (error) {
        console.error('Lỗi khi tải xuống:', error);
        toast.error(error instanceof Error ? error.message : 'Lỗi không xác định khi tải xuống');
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
      toast.error("Có lỗi xảy ra khi tải xuống tài liệu!");
      setIsDownloading(false);
      setDownloadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const getPreviewUrl = (docId: string, fileType: string): string => {
    // Sử dụng API preview mới cho file docx
    if (fileType === 'doc') {
      return `${API_BASE_URL}/api/documents/preview/${docId}`;
    }
    
    // Đối với PDF, sử dụng URL gốc
    if (fileType === 'pdf' && preview !== "#") {
      return preview;
    }
    
    return preview;
  };

  return (
    <>
      <div className="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white h-full min-h-[410px]">
        <div className="relative w-full h-44 bg-gray-100 flex-shrink-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-dtktmt-blue-dark text-white px-2 py-1 rounded-full text-xs font-bold">
            {fileType?.toUpperCase()}
          </div>
          {purchased && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Đã mua</span>
            </div>
          )}
          {categoryName && (
            <div className="absolute bottom-2 left-2 bg-white/90 border text-dtktmt-blue-medium px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
              <Folder size={12} className="mr-1" />
              {categoryName}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-5 justify-between">
          <div>
            <h3 
              title={title}
              className="text-lg font-bold text-dtktmt-blue-dark min-h-[48px] flex items-center line-clamp-2 mb-1"
              style={{ lineHeight: "1.2" }}
            >
              {clampText(title, 38)}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px] mb-3">
              {clampText(description, 70)}
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-lg font-bold ${purchased ? "text-green-500" : "text-dtktmt-pink-dark"}`}>
                {purchased ? "Đã mua" : formatPrice(price)}
              </span>
            </div>
            
            {/* Thanh tiến độ tải xuống */}
            {isDownloading && (
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div 
                  className="h-full bg-dtktmt-blue-medium rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  {downloadProgress < 100 ? `Đang tải: ${downloadProgress}%` : 'Hoàn tất!'}
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handlePreview} 
                variant="outline"
                className="flex items-center gap-1 flex-1"
              >
                <Eye size={16} />
                <span>Xem trước</span>
              </Button>
              {purchased ? (
                <Button 
                  onClick={handleDownload} 
                  className="flex items-center gap-1 flex-1 bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                  disabled={loading || isDownloading}
                >
                  <Download size={16} />
                  <span>{loading || isDownloading ? "Đang tải..." : "Tải xuống"}</span>
                </Button>
              ) : (
                <Button onClick={handleBuy} className="flex items-center gap-1 flex-1 bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark">
                  <FileText size={16} />
                  <span>Mua ngay</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden relative shadow-xl">
            <div className="bg-dtktmt-blue-medium text-white p-3 flex justify-between items-center">
              <h3 className="font-medium">Xem trước: {title}</h3>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="hover:text-dtktmt-blue-light"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[calc(90vh-4rem)] overflow-auto flex flex-col gap-4">
              {((fileType === "pdf" || fileType === "doc" || fileType === "ppt" || fileType === "pptx") && !purchased) ? (
                <div className="relative w-full h-[70vh]">
                  <iframe 
                    src={getPreviewUrl(id, fileType)} 
                    title={`Xem trước ${title}`}
                    className="w-full h-full border rounded-md"
                    // Chỉ tắt tính năng pointer-events cho PDF, giữ nguyên cho DOCX để người dùng vẫn cuộn được
                    style={{pointerEvents: fileType === 'pdf' ? 'none' : 'auto'}}
                  ></iframe>
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 text-center p-6 rounded-lg gap-2" 
                       style={{top: "70%", height: "30%"}}>
                    <p className="text-dtktmt-pink-dark mb-2">Vui lòng mua để xem đầy đủ nội dung!</p>
                    <Button onClick={() => { setIsPreviewOpen(false); setBuyDialogOpen(true); }} className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark px-6">
                      Mua để xem đầy đủ
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe 
                  src={getPreviewUrl(id, fileType)} 
                  title={`Xem trước ${title}`}
                  className="w-full h-[70vh] border rounded-md bg-white"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thẻ a ẩn để tải xuống */}
      <a 
        ref={downloadLinkRef} 
        href="#" 
        download 
        className="hidden"
        target="_blank"
        rel="noopener noreferrer"
      ></a>

      <BuyDocDialog 
        open={isBuyDialogOpen}
        onClose={() => setBuyDialogOpen(false)}
        onSuccess={() => setPurchased(true)}
        docTitle={title}
        docPrice={price}
        docId={id}
      />
    </>
  );
};

export default DocumentCard;
