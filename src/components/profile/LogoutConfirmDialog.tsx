
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LogoutConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-lg border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-800">
            <LogOut size={20} className="text-dtktmt-pink-medium" />
            Xác nhận đăng xuất
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200 hover:bg-gray-100 text-gray-700">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white"
          >
            Đăng xuất
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmDialog;
