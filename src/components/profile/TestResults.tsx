import { Button } from "@/components/ui/button";
import { Check, X, BookOpen, Calendar } from "lucide-react";

interface TestResult {
  id: number;
  exam_id: number;
  user_id: number;
  attempt_count: number;
  score: number;
  completed_at: string;
  created_at: string;
  title?: string;
  date?: string;
  total?: number;
  passed?: boolean;
  course_title?: string;
  chapter_id?: number | null;
  exam_title?: string;
  course_id?: number;
}

interface TestResultsProps {
  results: TestResult[];
}

const TestResults = ({ results }: TestResultsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-dtktmt-blue-light/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Bài kiểm tra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ngày làm bài
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Điểm số
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{test.title || test.exam_title}</div>
                  <div className="text-xs text-gray-500">
                    {test.chapter_id === null ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dtktmt-purple-light text-dtktmt-purple-dark">
                        Kiểm tra cuối khóa
                      </span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dtktmt-blue-light text-dtktmt-blue-dark">
                        Kiểm tra chương
                      </span>
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-700">
                    <BookOpen size={14} className="mr-1 text-dtktmt-blue-medium" />
                    <span>{test.course_title || "Chưa có thông tin"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-700">
                    <Calendar size={14} className="mr-1 text-dtktmt-blue-medium" />
                    <span>{test.date || new Date(test.completed_at || test.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{test.score}/{test.total || 100}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(test.passed !== undefined ? test.passed : (test.score || 0) >= 70) ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check size={12} className="mr-1" />
                      Đạt
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <X size={12} className="mr-1" />
                      Không đạt
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
