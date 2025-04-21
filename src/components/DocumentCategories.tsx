
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  // Lấy từ API (ví dụ: /api/document-categories)
  const res = await fetch("/api/document-categories");
  if (!res.ok) throw new Error("Không thể lấy danh mục");
  return res.json();
};

const DocumentCategories = ({
  selectedCategory,
  onSelectCategory,
}: DocumentCategoriesProps) => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Tìm kiếm danh mục theo tên
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto mb-8">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Search className="h-5 w-5 text-dtktmt-blue-medium" />
        <Input
          placeholder="Tìm kiếm danh mục tài liệu..."
          className="w-full border-dtktmt-blue-light/40 rounded-xl shadow text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select
        onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
        value={selectedCategory || "all"}
      >
        <SelectTrigger className="w-full border-dtktmt-blue-light/40 rounded-xl shadow bg-white text-base">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {filteredCategories.map((cat) => (
            <SelectItem value={cat.slug} key={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <div className="mt-2 text-gray-400 text-xs text-center">Đang tải danh mục...</div>}
      {!loading && filteredCategories.length === 0 && (
        <div className="mt-2 text-gray-400 text-xs text-center">Không tìm thấy danh mục phù hợp</div>
      )}
    </div>
  );
};

export default DocumentCategories;

