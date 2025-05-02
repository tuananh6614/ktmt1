import { useState, useEffect } from "react";
import { Search, SortAsc, SortDesc, FileText } from "lucide-react";
import NavBar from "@/components/componentsforpages/NavBar";
import Footer from "@/components/componentsforpages/Footer";
import ChatBox from "@/components/componentsforpages/ChatBox";
import DocumentCard from "@/components/componentsforpages/DocumentCard";
import DocumentCategories, { DocumentCategory } from "@/components/componentsforpages/DocumentCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/config";

interface Document {
  id: number;
  title: string;
  description: string;
  category_id: number | null;
  category_name: string | null;
  price: number | null;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function để lấy loại file từ file_path
const getFileType = (filePath: string | null): string => {
  if (!filePath) return "unknown";
  
  const fileExtension = filePath.split('.').pop()?.toLowerCase() || "";
  
  // Nhóm các loại file tương tự
  if (["doc", "docx"].includes(fileExtension)) return "doc";
  if (["xls", "xlsx"].includes(fileExtension)) return "xls";
  if (["ppt", "pptx"].includes(fileExtension)) return "ppt";
  if (fileExtension === "pdf") return "pdf";
  
  return fileExtension || "unknown";
};

// Helper function để tạo placeholder image dựa vào tên file
const getPlaceholderImage = (title: string, filePath: string | null) => {
  if (!filePath) return "https://placehold.co/600x400?text=Tài+liệu";
  
  const fileExtension = filePath.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return `https://placehold.co/600x400/e74c3c/white?text=PDF+-+${encodeURIComponent(title)}`;
    case 'docx':
    case 'doc':
      return `https://placehold.co/600x400/3498db/white?text=DOC+-+${encodeURIComponent(title)}`;
    case 'xlsx':
    case 'xls':
      return `https://placehold.co/600x400/2ecc71/white?text=XLS+-+${encodeURIComponent(title)}`;
    case 'pptx':
    case 'ppt':
      return `https://placehold.co/600x400/f39c12/white?text=PPT+-+${encodeURIComponent(title)}`;
    default:
      return `https://placehold.co/600x400/95a5a6/white?text=${encodeURIComponent(title)}`;
  }
};

// Helper function để lấy URL xem trước tài liệu
const getPreviewUrl = (filePath: string | null): string => {
  if (!filePath) return "#";
  
  // Nếu file_path bắt đầu bằng http hoặc https, sử dụng trực tiếp
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Nếu là file pdf, có thể xem trực tiếp
  if (filePath.toLowerCase().endsWith('.pdf')) {
    return `${API_BASE_URL}${filePath}`;
  }
  
  // Đối với các loại file khác, hiện tại chỉ hiển thị thông báo
  return "#";
};

const DocsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [purchasedDocuments, setPurchasedDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "purchased">("all");
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách tài liệu
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        let url = `${API_BASE_URL}/api/documents`;
        if (selectedCategory) {
          url += `?category_id=${selectedCategory}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tài liệu");
        }
        
        const data = await response.json();
        setDocuments(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải tài liệu:", err);
        setError("Không thể tải danh sách tài liệu");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [selectedCategory]);

  // Lấy danh sách tài liệu đã mua
  useEffect(() => {
    const fetchPurchasedDocuments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Nếu không có token, người dùng chưa đăng nhập
      
      try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/documents/purchased`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tài liệu đã mua");
        }
        
        const data = await response.json();
        setPurchasedDocuments(data);
      } catch (err) {
        console.error("Lỗi khi tải tài liệu đã mua:", err);
        // Không hiển thị lỗi này cho người dùng
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === "purchased") {
      fetchPurchasedDocuments();
    }
  }, [activeTab]);

  const filteredDocuments = (activeTab === "all" ? documents : purchasedDocuments)
    .filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFileType = !fileTypeFilter || getFileType(doc.file_path) === fileTypeFilter;

      return matchesSearch && matchesFileType;
    })
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return (a.price || 0) - (b.price || 0);
      } else {
        return (b.price || 0) - (a.price || 0);
      }
    });

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-dtktmt-blue-medium to-dtktmt-pink-medium bg-clip-text text-transparent drop-shadow-sm">
              Tài liệu học tập
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá thư viện tài liệu đa dạng để nâng cao kiến thức của bạn về Điện tử và Kỹ thuật máy tính
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white rounded-full shadow-md p-1 flex">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === "all"
                    ? "bg-dtktmt-blue-medium text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                Tất cả tài liệu
              </button>
              <button
                onClick={() => setActiveTab("purchased")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === "purchased"
                    ? "bg-dtktmt-blue-medium text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                Tài liệu đã mua
              </button>
            </div>
          </motion.div>

          {activeTab === "all" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DocumentCategories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative flex-grow md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Tìm kiếm tài liệu..." 
                  className="pl-10 border-2 border-dtktmt-blue-light/30 focus:border-dtktmt-blue-medium transition-all duration-300 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3 justify-end">
                <div className="flex items-center gap-2">
                  <Select onValueChange={(value) => setFileTypeFilter(value === "all" ? null : value)} defaultValue="all">
                    <SelectTrigger className="w-28 border-dtktmt-blue-light/30">
                      <SelectValue placeholder="Định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {["pdf", "doc", "xls", "ppt"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-dtktmt-blue-light/30 hover:bg-dtktmt-blue-light/10 hover:text-dtktmt-blue-dark transition-all duration-300"
                  onClick={toggleSort}
                >
                  {sortDirection === "asc" ? (
                    <>
                      <SortAsc size={18} />
                      <span>Giá tăng dần</span>
                    </>
                  ) : (
                    <>
                      <SortDesc size={18} />
                      <span>Giá giảm dần</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loading ? (
              <div className="col-span-full py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dtktmt-blue-medium mx-auto"></div>
                <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: doc.id * 0.05 % 0.5,
                    duration: 0.3
                  }}
                >
                  <DocumentCard 
                    id={doc.id.toString()}
                    title={doc.title}
                    description={doc.description}
                    image={getPlaceholderImage(doc.title, doc.file_path)}
                    price={doc.price || 0}
                    fileType={getFileType(doc.file_path)}
                    preview={getPreviewUrl(doc.file_path)}
                    categoryName={doc.category_name || "Chưa phân loại"}
                    isPurchased={activeTab === "purchased"}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <FileText size={48} className="text-gray-400" />
                  {activeTab === "purchased" ? (
                    <div>
                      <p className="text-gray-500 mb-2">Bạn chưa mua tài liệu nào.</p>
                      <Button
                        onClick={() => setActiveTab("all")}
                        className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                      >
                        Khám phá tài liệu
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Không tìm thấy tài liệu phù hợp với tiêu chí tìm kiếm.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default DocsPage;

