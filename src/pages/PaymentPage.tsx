import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/config";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy thông tin tài liệu từ URL params
  const docId = searchParams.get("id");
  const docTitle = searchParams.get("title") || "Tài liệu";
  const docPrice = Number(searchParams.get("price")) || 0;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Format số thẻ theo nhóm 4 chữ số
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format ngày hết hạn MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value.substring(0, 19)); // Max 16 + 3 spaces
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatExpiryDate(e.target.value);
    setExpiryDate(value.substring(0, 5)); // Max MM/YY
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    setCvv(value.substring(0, 3)); // Max 3 digits
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Số thẻ không hợp lệ");
      setLoading(false);
      return;
    }

    if (cardName.length < 3) {
      setError("Tên chủ thẻ không hợp lệ");
      setLoading(false);
      return;
    }

    if (expiryDate.length < 5) {
      setError("Ngày hết hạn không hợp lệ");
      setLoading(false);
      return;
    }

    if (cvv.length < 3) {
      setError("Mã CVV không hợp lệ");
      setLoading(false);
      return;
    }

    // Giả lập gọi API thanh toán
    setTimeout(() => {
      // Giả lập xử lý thanh toán thành công (90% tỉ lệ thành công)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        setSuccess(true);
        
        // Lưu trạng thái mua hàng vào localStorage
        const purchasedDocs = JSON.parse(localStorage.getItem("purchasedDocs") || "[]");
        if (docId && !purchasedDocs.includes(docId)) {
          purchasedDocs.push(docId);
          localStorage.setItem("purchasedDocs", JSON.stringify(purchasedDocs));
        }
        
        toast.success("Thanh toán thành công!");
        
        // Chuyển về trang gốc sau 2 giây
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setError("Thanh toán thất bại. Vui lòng thử lại hoặc sử dụng thẻ khác.");
        toast.error("Thanh toán thất bại");
      }
      
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    // Kiểm tra xem tài liệu đã được mua chưa
    const purchasedDocs = JSON.parse(localStorage.getItem("purchasedDocs") || "[]");
    if (docId && purchasedDocs.includes(docId)) {
      // Nếu đã mua rồi thì chuyển về trang gốc
      toast.info("Bạn đã mua tài liệu này rồi!");
      navigate(-1);
    }
  }, [docId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="p-2 mr-2" 
            onClick={() => navigate(-1)}
            disabled={loading || success}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-dtktmt-blue-dark">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chi tiết thanh toán */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6 text-dtktmt-blue-dark border-b pb-3">
                Thông tin thanh toán
              </h2>

              {success ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-600">Thanh toán thành công!</h3>
                  <p className="text-center text-gray-600 mb-6">
                    Bạn đã mua thành công tài liệu "{docTitle}".
                    <br />Bạn sẽ được chuyển về trang tài liệu trong giây lát.
                  </p>
                  <Button 
                    className="bg-dtktmt-blue-medium"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại xem tài liệu
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                      <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Số thẻ
                      </label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="pl-10 bg-gray-50"
                          disabled={loading}
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        * Đây là demo, bạn có thể nhập số thẻ giả
                      </p>
                    </div>

                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên chủ thẻ
                      </label>
                      <Input
                        id="cardName"
                        placeholder="NGUYEN VAN A"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="bg-gray-50"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày hết hạn
                        </label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          className="bg-gray-50"
                          disabled={loading}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                          className="bg-gray-50"
                          disabled={loading}
                          required
                          type="password"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      type="submit"
                      className="w-full bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white py-3 h-auto text-base"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : `Thanh toán ${docPrice.toLocaleString("vi-VN")} đ`}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-dtktmt-blue-dark border-b pb-3">
                Thông tin đơn hàng
              </h2>
              
              <div className="mb-6">
                <p className="font-medium mb-1">Tài liệu:</p>
                <p className="text-gray-800">{docTitle}</p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Giá tài liệu:</span>
                  <span>{docPrice.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Thuế:</span>
                  <span>0 đ</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-dtktmt-pink-dark text-lg">{docPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;