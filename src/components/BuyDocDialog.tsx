
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  
  const handleProceedToPayment = () => {
    // Chuyển đến trang thanh toán với thông tin tài liệu
    navigate(`/payment?id=${docId}&title=${encodeURIComponent(docTitle)}&price=${docPrice}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận mua tài liệu</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p>
            Bạn có chắc chắn muốn mua <span className="font-semibold">{docTitle}</span> với giá{" "}
            <span className="font-bold text-dtktmt-pink-dark">
              {docPrice.toLocaleString("vi-VN")} đ
            </span>
            ?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button className="bg-dtktmt-pink-medium" onClick={handleProceedToPayment}>
            Tiến hành thanh toán
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyDocDialog;
