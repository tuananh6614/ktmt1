import { FileText, Download, Eye, CheckCircle, X, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import BuyDocDialog from "./BuyDocDialog";

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

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBuyDialogOpen(true);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (purchased) {
      toast.success("Đang tải xuống tài liệu...");
    } else {
      toast.error("Vui lòng mua tài liệu để tải xuống!");
    }
  };

  const getLimitedPreviewUrl = () => {
    if (fileType === "pdf" && preview !== "#") {
      return `${preview}#page=1&view=FitH`;
    }
    if (fileType === "ppt" || fileType === "pptx") {
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
                <Button onClick={handleDownload} className="flex items-center gap-1 flex-1 bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark">
                  <Download size={16} />
                  <span>Tải xuống</span>
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
              {((fileType === "pdf" || fileType === "ppt" || fileType === "pptx") && !purchased) ? (
                <div className="relative w-full h-[70vh]">
                  <iframe 
                    src={getLimitedPreviewUrl()} 
                    title={`Xem trước ${title}`}
                    className="w-full h-full border rounded-md pointer-events-none"
                  ></iframe>
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 text-center p-6 rounded-lg gap-2">
                    <p className="text-base font-semibold text-dtktmt-blue-dark mb-2">
                      Bạn chỉ có thể xem {fileType === "pdf" ? "3 trang đầu" : "3 slide đầu tiên"} của tài liệu này.
                    </p>
                    <p className="text-dtktmt-pink-dark mb-4">Vui lòng mua để xem đầy đủ nội dung!</p>
                    <Button onClick={() => { setIsPreviewOpen(false); setBuyDialogOpen(true); }} className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark px-6">
                      Mua để xem đầy đủ
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe 
                  src={preview} 
                  title={`Xem trước ${title}`}
                  className="w-full h-[70vh] border rounded-md bg-white"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}

      <BuyDocDialog 
        open={isBuyDialogOpen}
        onClose={() => setBuyDialogOpen(false)}
        onSuccess={() => setPurchased(true)}
        docTitle={title}
        docPrice={price}
      />
    </>
  );
};

export default DocumentCard;
