
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
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
            <SelectItem value={cat.slug} key={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <div className="mt-2 text-gray-400 text-xs text-center">Đang tải danh mục...</div>}
      {!loading && categories.length === 0 && (
        <div className="mt-2 text-gray-400 text-xs text-center">Không tìm thấy danh mục phù hợp</div>
      )}
    </div>
  );
};

export default DocumentCategories;
