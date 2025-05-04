import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Search, 
  Tag,
  BookOpen,
  Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/config/config";

interface DocumentData {
  id: number;
  user_id: number;
  document_id: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
  document_title: string;
  document_file: string;
  price?: number;
  original_price?: number;
  category?: string;
  author?: string;
  pages?: number;
  file_size?: string;
  file_format?: string;
}

interface PurchasedDocumentsProps {
  documents: DocumentData[];
}

const PurchasedDocuments = ({ documents }: PurchasedDocumentsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Lấy danh sách category từ tài liệu
  const categories = Array.from(new Set(documents.map(doc => doc.category).filter(Boolean) as string[]));
  
  // Lọc tài liệu theo tìm kiếm và category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Tính tổng chi phí đã tiêu cho tài liệu
  const totalSpent = documents.reduce((sum, doc) => sum + (doc.price || 0), 0);
  
  // Tính tiết kiệm
  const totalSavings = documents.reduce((sum, doc) => {
    if (doc.price && doc.original_price) {
      return sum + (doc.original_price - doc.price);
    }
    return sum;
  }, 0);

  // Format giá tiền (VND)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Tạo icon cho định dạng file
  const getFileFormatIcon = (format: string = '') => {
    switch(format.toLowerCase()) {
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText size={20} className="text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText size={20} className="text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText size={20} className="text-green-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="mb-4">
          <FileText size={48} className="mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Bạn chưa mua tài liệu nào</h3>
        <p className="text-gray-500 mb-5 max-w-md mx-auto">
          Khám phá thư viện tài liệu học tập chất lượng cao để nâng cao kiến thức của bạn.
        </p>
        <Button className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark">
          Khám phá tài liệu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thống kê tài liệu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/60">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-dtktmt-blue-light/30 flex items-center justify-center">
              <FileText size={20} className="text-dtktmt-blue-medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số tài liệu</p>
              <p className="text-xl font-bold">{documents.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng chi phí</p>
              <p className="text-xl font-bold">{formatPrice(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Receipt size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tiết kiệm</p>
              <p className="text-xl font-bold">{formatPrice(totalSavings)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả
          </Badge>
          {categories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Danh sách tài liệu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gray-50 p-6 flex items-center justify-center">
              {getFileFormatIcon(doc.file_format)}
            </div>
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14">
                {doc.document_title}
              </h4>
              
              <div className="mt-2 space-y-2 text-sm text-gray-500">
                {doc.category && (
                  <div className="flex items-center">
                    <Tag size={14} className="mr-2 text-gray-400" />
                    <span>{doc.category}</span>
                  </div>
                )}
                
                {doc.pages && (
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-2 text-gray-400" />
                    <span>{doc.pages} trang</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <span>Ngày mua: {new Date(doc.purchase_date).toLocaleDateString('vi-VN')}</span>
                </div>
                
                {doc.price && (
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-2 text-gray-400" />
                    <span className="font-medium text-gray-700">{formatPrice(doc.price)}</span>
                    {doc.original_price && doc.original_price > doc.price && (
                      <span className="ml-2 line-through text-gray-400">
                        {formatPrice(doc.original_price)}
                      </span>
                    )}
                  </div>
                )}
                
                {doc.file_size && (
                  <div className="flex items-center">
                    <FileText size={14} className="mr-2 text-gray-400" />
                    <span>{doc.file_size} {doc.file_format && `(${doc.file_format.toUpperCase()})`}</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="default"
                className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={() => window.open(`${API_BASE_URL}/api/documents/download/${doc.document_id}`, '_blank')}
              >
                <Download size={16} />
                Tải xuống
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Search size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">Không tìm thấy tài liệu nào phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default PurchasedDocuments; 