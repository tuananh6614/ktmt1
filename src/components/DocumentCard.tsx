
import { FileText, Download, Eye, CheckCircle, X, Folder, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import PptPreview from "./PptPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [isPptPreviewOpen, setIsPptPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      setIsPaymentDialogOpen(true);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nếu là file PowerPoint, mở PptPreview component
    if (fileType.toLowerCase() === "ppt" || fileType.toLowerCase() === "pptx") {
      setIsPptPreviewOpen(true);
    } else {
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPurchased) {
      toast.success("Đang tải xuống tài liệu...");
      // Giả lập tải xuống
      setTimeout(() => {
        toast.info("Tải xuống hoàn tất!");
      }, 2000);
    } else {
      toast.error("Vui lòng mua tài liệu để tải xuống!");
    }
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    
    // Giả lập quá trình thanh toán
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentDialogOpen(false);
      toast.success("Thanh toán thành công!");
      // Cập nhật trạng thái isPurchased thành true (trong thực tế sẽ cần lưu trạng thái này ở backend)
      // Để giả lập, ta có thể làm mới trang sau khi thanh toán
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, 2000);
  };

  return (
    <>
      <div className="card-3d h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
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
          {categoryName && (
            <div className="absolute bottom-2 left-2 bg-white/90 border text-dtktmt-blue-medium px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
              <Folder size={12} className="mr-1" />
              {categoryName}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-dtktmt-blue-dark flex-1 h-14 line-clamp-2">
              {title}
            </h3>
            <span className={`text-lg font-bold ${isPurchased ? "text-green-500" : "text-dtktmt-pink-dark"}`}>
              {isPurchased ? "Đã mua" : formatPrice(price)}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{description}</p>
          <div className="flex gap-2 mt-auto pt-4 border-t">
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
                <CreditCard size={16} />
                <span>Mua ngay</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialog để xem trước tài liệu thông thường (không phải PowerPoint) */}
      {isPreviewOpen && fileType.toLowerCase() !== "ppt" && fileType.toLowerCase() !== "pptx" && (
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

      {/* Dialog xử lý thanh toán */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanh toán tài liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tài liệu:</span>
              <span>{title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Giá:</span>
              <span className="font-bold text-dtktmt-pink-dark">{formatPrice(price)}</span>
            </div>
            <div className="border-t my-4"></div>
            <div className="space-y-2">
              <h4 className="font-medium">Phương thức thanh toán:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-lg p-3 flex items-center gap-2 cursor-pointer bg-blue-50 border-blue-300">
                  <input type="radio" checked className="text-dtktmt-blue-medium" readOnly />
                  <span>Thẻ tín dụng</span>
                </div>
                <div className="border rounded-lg p-3 flex items-center gap-2 cursor-pointer">
                  <input type="radio" className="text-dtktmt-blue-medium" readOnly />
                  <span>VNPay</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleProcessPayment}
              className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  Thanh toán {formatPrice(price)}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PowerPoint Preview Dialog sử dụng component riêng */}
      <PptPreview
        title={title}
        previewUrl={preview}
        isOpen={isPptPreviewOpen}
        onClose={() => setIsPptPreviewOpen(false)}
      />
    </>
  );
};

export default DocumentCard;
