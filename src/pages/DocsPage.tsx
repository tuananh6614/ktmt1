import { useState } from "react";
import { Search, SortAsc, SortDesc, FileText } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import DocumentCard from "@/components/DocumentCard";
import DocumentCategories from "@/components/DocumentCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const DocsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allDocuments = [
    {
      id: "1",
      title: "Cấu trúc máy tính",
      description: "Tài liệu về kiến trúc và tổ chức máy tính",
      image: "/placeholder.svg",
      price: 150000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "kien-truc",
      isPurchased: true,
    },
    {
      id: "2",
      title: "Lập trình vi điều khiển",
      description: "Hướng dẫn toàn diện về lập trình STM32",
      image: "/placeholder.svg",
      price: 200000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "vi-dieu-khien",
    },
    {
      id: "3",
      title: "Tài liệu thực hành VHDL",
      description: "Bộ bài tập và giải pháp cho VHDL",
      image: "/placeholder.svg",
      price: 180000,
      fileType: "docx",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "dien-tu-so",
      isPurchased: true,
    },
    {
      id: "4",
      title: "Đề cương ôn tập Điện tử số",
      description: "Tổng hợp lý thuyết và bài tập Điện tử số",
      image: "/placeholder.svg",
      price: 120000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "dien-tu-so",
    },
    {
      id: "5",
      title: "Mô phỏng mạch với LTspice",
      description: "Hướng dẫn sử dụng LTspice để mô phỏng và phân tích mạch điện",
      image: "/placeholder.svg",
      price: 150000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "mo-phong",
    },
    {
      id: "6",
      title: "Lập trình ARM Cortex-M4",
      description: "Tài liệu chuyên sâu về lập trình ARM Cortex-M4",
      image: "/placeholder.svg",
      price: 250000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "vi-dieu-khien",
    },
    {
      id: "7",
      title: "Bài giảng Xử lý tín hiệu số",
      description: "Slides bài giảng về xử lý tín hiệu số cho kỹ sư điện tử",
      image: "/placeholder.svg",
      price: 180000,
      fileType: "pptx",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "xu-ly-tin-hieu",
    },
    {
      id: "8",
      title: "Thiết kế PCB với Altium Designer",
      description: "Hướng dẫn thiết kế mạch in chuyên nghiệp với Altium Designer",
      image: "/placeholder.svg",
      price: 220000,
      fileType: "pdf",
      preview: "https://arxiv.org/pdf/1511.06434.pdf",
      category: "thiet-ke",
    },
  ];

  const filteredDocuments = allDocuments
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFileType = !fileTypeFilter || doc.fileType === fileTypeFilter;
      
      const matchesCategory = !selectedCategory || doc.category === selectedCategory;
      
      return matchesSearch && matchesFileType && matchesCategory;
    })
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
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
          >
            <DocumentCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </motion.div>

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
                      {["pdf", "docx", "pptx"].map((type) => (
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
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: parseInt(doc.id) * 0.1,
                    duration: 0.3
                  }}
                >
                  <DocumentCard {...doc} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <FileText size={48} className="text-gray-400" />
                  <p className="text-gray-500">Không tìm thấy tài liệu phù hợp với tiêu chí tìm kiếm.</p>
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
