import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type DocumentCategory = {
  id: number;
  category_name: string;
};

interface DocumentCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const fetchCategories = async (): Promise<DocumentCategory[]> => {
  const res = await fetch("http://localhost:3000/api/document-categories");
  if (!res.ok) throw new Error("Không thể lấy danh mục");
  return res.json();
};

const DocumentCategories = ({
  selectedCategory,
  onSelectCategory,
}: DocumentCategoriesProps) => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch(err => {
        console.error("Lỗi khi lấy danh mục:", err);
        setError("Không thể tải danh mục tài liệu");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-lg mx-auto mb-8">
      <Select
        onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
        value={selectedCategory || "all"}
        disabled={loading}
      >
        <SelectTrigger className="w-full border-dtktmt-blue-light/40 rounded-xl shadow bg-white text-base">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((cat) => (
            <SelectItem value={cat.id.toString()} key={cat.id}>
              {cat.category_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <div className="mt-2 text-gray-400 text-xs text-center">Đang tải danh mục...</div>}
      {error && <div className="mt-2 text-red-500 text-xs text-center">{error}</div>}
      {!loading && !error && categories.length === 0 && (
        <div className="mt-2 text-gray-400 text-xs text-center">Không tìm thấy danh mục tài liệu</div>
      )}
    </div>
  );
};

export default DocumentCategories;
