
import { FileText, Download, Eye, CheckCircle, X, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  fileType: string;
  preview: string;
  isPurchased?: boolean;
  categoryName?: string; // Thêm prop này!
}

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

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPurchased) {
      toast.success("Tài liệu đã sẵn sàng để tải xuống!");
    } else {
      toast.info("Đang chuyển hướng đến trang thanh toán...");
      // Implement purchase logic
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPurchased) {
      toast.success("Đang tải xuống tài liệu...");
    } else {
      toast.error("Vui lòng mua tài liệu để tải xuống!");
    }
  };

  return (
    <>
      <div className="card-3d h-full">
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover" 
          />
          <div className="absolute top-2 right-2 bg-dtktmt-blue-dark text-white px-2 py-1 rounded-full text-xs font-bold">
            {fileType.toUpperCase()}
          </div>
          {isPurchased && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Đã mua</span>
            </div>
          )}
          {/* Hiển thị danh mục ở bottom left */}
          {categoryName && (
            <div className="absolute bottom-2 left-2 bg-white/90 border text-dtktmt-blue-medium px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
              <Folder size={12} className="mr-1" />
              {categoryName}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-dtktmt-blue-dark flex-1">
              {title}
            </h3>
            <span className={`text-lg font-bold ${isPurchased ? "text-green-500" : "text-dtktmt-pink-dark"}`}>
              {isPurchased ? "Đã mua" : formatPrice(price)}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
          <div className="flex gap-2">
            <Button 
              onClick={handlePreview} 
              variant="outline"
              className="flex items-center gap-1 flex-1"
            >
              <Eye size={16} />
              <span>Xem trước</span>
            </Button>
            {isPurchased ? (
              <Button 
                onClick={handleDownload}
                className="flex items-center gap-1 flex-1 bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
              >
                <Download size={16} />
                <span>Tải xuống</span>
              </Button>
            ) : (
              <Button 
                onClick={handleBuy}
                className="flex items-center gap-1 flex-1 bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark"
              >
                <FileText size={16} />
                <span>Mua ngay</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="bg-dtktmt-blue-medium text-white p-3 flex justify-between items-center">
              <h3 className="font-medium">Xem trước: {title}</h3>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="hover:text-dtktmt-blue-light"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[calc(90vh-4rem)] overflow-auto">
              <iframe 
                src={preview} 
                title={`Xem trước ${title}`}
                className="w-full h-[70vh] border"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;

