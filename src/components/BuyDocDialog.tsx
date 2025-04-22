
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BuyDocDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docTitle: string;
  docPrice: number;
}

const BuyDocDialog = ({ open, onClose, onSuccess, docTitle, docPrice }: BuyDocDialogProps) => {
  const handleBuy = () => {
    // Giả lập mua thành công 
    toast.success("Mua thành công! Bạn đã sở hữu tài liệu.");
    onSuccess();
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
            Bạn có chắc chắn mua <span className="font-semibold">{docTitle}</span> với giá{" "}
            <span className="font-bold text-dtktmt-pink-dark">
              {docPrice.toLocaleString("vi-VN")} đ
            </span>
            ?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button className="bg-dtktmt-pink-medium" onClick={handleBuy}>
            Xác nhận mua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyDocDialog;
