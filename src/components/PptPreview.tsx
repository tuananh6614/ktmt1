
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PptPreviewProps {
  title: string;
  previewUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PptPreview = ({ title, previewUrl, isOpen, onClose }: PptPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPages = 5; // Giới hạn số trang xem trước
  
  const handleNext = () => {
    if (currentPage < maxPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-center">
              <span className="text-dtktmt-blue-dark">
                Xem trước: {title} (Trang {currentPage}/{maxPages})
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="h-8 w-8"
              >
                <X size={18} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-[60vh] overflow-hidden bg-gray-50 relative">
          {/* Giả lập nội dung PowerPoint cho mục đích xem trước */}
          <div className="flex justify-center items-center h-full">
            <div className="bg-white shadow-lg rounded-lg w-[80%] h-[80%] flex flex-col justify-center items-center">
              <h3 className="text-2xl font-bold text-dtktmt-blue-dark mb-4">Trang {currentPage}</h3>
              <p className="text-gray-600">Nội dung xem trước của {title}</p>
              <div className="mt-6">
                <p className="text-sm text-gray-500">Đây là nội dung xem trước bị giới hạn</p>
                <p className="text-sm text-gray-500">Vui lòng mua tài liệu để xem đầy đủ</p>
              </div>
            </div>
          </div>
          
          {/* Điều khiển chuyển trang */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
            <Button 
              onClick={handlePrevious} 
              disabled={currentPage === 1}
              className="bg-white text-dtktmt-blue-dark border hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
              <span>Trang trước</span>
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={currentPage === maxPages}
              className="bg-white text-dtktmt-blue-dark border hover:bg-gray-100"
            >
              <span>Trang sau</span>
              <ChevronRight size={18} />
            </Button>
          </div>
          
          {/* Thông báo giới hạn xem trước */}
          <div className="absolute top-2 right-2 bg-dtktmt-pink-medium text-white px-3 py-1 rounded-full text-xs">
            Xem trước giới hạn
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t">
          <p className="text-sm text-gray-500">Bạn chỉ có thể xem trước {maxPages} trang đầu tiên</p>
          <Button onClick={onClose} variant="outline">Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PptPreview;
