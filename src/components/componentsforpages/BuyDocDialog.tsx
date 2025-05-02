import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "@/config/config";

interface BuyDocDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docTitle: string;
  docPrice: number;
  docId: string;
}

const BuyDocDialog = ({ open, onClose, onSuccess, docTitle, docPrice, docId }: BuyDocDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleBuyNow = async () => {
    // Mua ngay không cần thanh toán (đơn giản hóa quy trình)
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để mua tài liệu!");
        setLoading(false);
        onClose();
        navigate("/dang-nhap");
        return;
      }
      
      // Gọi API mua tài liệu
      const response = await fetch(`${API_BASE_URL}/api/documents/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ document_id: docId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.already_purchased) {
          toast.info("Bạn đã mua tài liệu này rồi!");
        } else {
          toast.success("Mua tài liệu thành công!");
        }
        
        // Lưu vào localStorage để xử lý offline
        const purchasedDocs = JSON.parse(localStorage.getItem("purchasedDocs") || "[]");
        if (!purchasedDocs.includes(docId)) {
          purchasedDocs.push(docId);
          localStorage.setItem("purchasedDocs", JSON.stringify(purchasedDocs));
        }
        
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi mua tài liệu");
      }
    } catch (error) {
      console.error("Lỗi khi mua tài liệu:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi mua tài liệu");
    } finally {
      setLoading(false);
    }
  };
  
  const handleProceedToPayment = () => {
    // Chuyển đến trang thanh toán với thông tin tài liệu
    navigate(`/thanh-toan?id=${docId}&title=${encodeURIComponent(docTitle)}&price=${docPrice}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận mua tài liệu</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p className="mb-4">
            Bạn có chắc chắn muốn mua <span className="font-semibold">{docTitle}</span> với giá{" "}           
            <span className="font-bold text-dtktmt-pink-dark">
              {docPrice.toLocaleString("vi-VN")} đ
            </span>
            ?
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Lưu ý:</strong> Sau khi mua, bạn sẽ có quyền tải xuống và xem toàn bộ nội dung tài liệu này. Thông tin mua hàng sẽ được lưu trong hệ thống.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">Huỷ</Button>
          <Button
            className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark sm:order-3"
            onClick={handleBuyNow}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Mua ngay"}
          </Button>
          <Button 
            variant="outline" 
            className="border-dtktmt-blue-medium text-dtktmt-blue-medium hover:bg-dtktmt-blue-light/10 sm:order-2"
            onClick={handleProceedToPayment}
          >
            Thanh toán qua thẻ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyDocDialog;
