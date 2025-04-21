
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export type DocumentCategory = {
  id: string;
  name: string;
  slug: string;
};

interface DocumentCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const fetchCategories = async (): Promise<DocumentCategory[]> => {
  // TODO: Replace with real API (currently mocked)
  return [
    { id: "1", name: "Giáo trình", slug: "giao-trinh" },
    { id: "2", name: "Tài liệu tham khảo", slug: "tai-lieu-tham-khao" },
    { id: "3", name: "Đề cương", slug: "de-cuong" },
    { id: "4", name: "Tài liệu khác", slug: "khac" },
  ];
};

const DocumentCategories = ({
  selectedCategory,
  onSelectCategory,
}: DocumentCategoriesProps) => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategories().then(data => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-xs mx-auto mb-8">
      <Select
        onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
        value={selectedCategory || "all"}
      >
        <SelectTrigger className="w-full border-dtktmt-blue-light/40 rounded-xl shadow">
          <Search className="mr-2 h-4 w-4 text-dtktmt-blue-medium" />
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((cat) => (
            <SelectItem value={cat.slug} key={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <div className="mt-2 text-gray-400 text-xs text-center">Đang tải danh mục...</div>}
    </div>
  );
};

export default DocumentCategories;
