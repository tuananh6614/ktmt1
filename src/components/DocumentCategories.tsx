
import { Book, FileText, ListTodo, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export type DocumentCategory = {
  id: string;
  name: string;
  icon: JSX.Element;
  slug: string;
};

export const documentCategories: DocumentCategory[] = [
  {
    id: "1",
    name: "Giáo trình",
    icon: <Book className="h-5 w-5" />,
    slug: "giao-trinh",
  },
  {
    id: "2",
    name: "Tài liệu tham khảo",
    icon: <FileText className="h-5 w-5" />,
    slug: "tai-lieu-tham-khao",
  },
  {
    id: "3",
    name: "Đề cương",
    icon: <ListTodo className="h-5 w-5" />,
    slug: "de-cuong",
  },
  {
    id: "4",
    name: "Tài liệu khác",
    icon: <Archive className="h-5 w-5" />,
    slug: "khac",
  },
];

interface DocumentCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const DocumentCategories = ({
  selectedCategory,
  onSelectCategory,
}: DocumentCategoriesProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {documentCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(selectedCategory === category.slug ? null : category.slug)}
          className={cn(
            "relative p-4 rounded-xl transition-all duration-300 hover:shadow-lg",
            "flex flex-col items-center justify-center gap-2 text-center",
            "border-2 hover:border-dtktmt-blue-medium",
            selectedCategory === category.slug
              ? "bg-dtktmt-blue-light/30 border-dtktmt-blue-medium shadow-lg scale-[1.02]"
              : "bg-white border-gray-200 hover:bg-dtktmt-blue-light/10"
          )}
        >
          <div className={cn(
            "p-3 rounded-lg transition-colors duration-300",
            selectedCategory === category.slug
              ? "bg-dtktmt-blue-medium text-white"
              : "bg-dtktmt-blue-light/20 text-dtktmt-blue-dark"
          )}>
            {category.icon}
          </div>
          <span className="font-medium text-sm">{category.name}</span>
          <div className={cn(
            "absolute bottom-0 left-0 h-1 bg-dtktmt-blue-medium transition-all duration-300",
            selectedCategory === category.slug ? "w-full" : "w-0"
          )} />
        </button>
      ))}
    </div>
  );
};

export default DocumentCategories;
