
import { useState } from "react";
import { Search, Filter, SortAsc, SortDesc, FileText } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import DocumentCard from "@/components/DocumentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);

  // Sample documents data
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

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "kien-truc", name: "Kiến trúc máy tính" },
    { id: "vi-dieu-khien", name: "Vi điều khiển" },
    { id: "dien-tu-so", name: "Điện tử số" },
    { id: "xu-ly-tin-hieu", name: "Xử lý tín hiệu" },
    { id: "mo-phong", name: "Mô phỏng" },
    { id: "thiet-ke", name: "Thiết kế" },
  ];

  const fileTypes = ["pdf", "docx", "pptx"];

  const filteredDocuments = (category: string) => {
    return allDocuments
      .filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = category === "all" || doc.category === category;
        
        const matchesFileType = !fileTypeFilter || doc.fileType === fileTypeFilter;
        
        return matchesSearch && matchesCategory && matchesFileType;
      })
      .sort((a, b) => {
        if (sortDirection === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dtktmt-blue-dark">Tài liệu học tập</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá thư viện tài liệu đa dạng để nâng cao kiến thức của bạn về Điện tử và Kỹ thuật máy tính
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Tìm kiếm tài liệu..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-dtktmt-blue-medium" />
                <span className="text-sm font-medium whitespace-nowrap">Định dạng:</span>
                <Select onValueChange={(value) => setFileTypeFilter(value === "all" ? null : value)} defaultValue="all">
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {fileTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full flex overflow-x-auto mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex-1">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDocuments(category.id).length > 0 ? (
                    filteredDocuments(category.id).map((doc) => (
                      <DocumentCard key={doc.id} {...doc} />
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <FileText size={48} className="text-gray-400" />
                        <p className="text-gray-500">Không tìm thấy tài liệu phù hợp với tiêu chí tìm kiếm.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default DocsPage;
