import { Button } from "@/components/ui/button";
import { Check, X, BookOpen, Calendar, Award, TrendingUp, BarChart4, FileText, AlertCircle, Bookmark } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/config";

interface TestResult {
  id: string;
  title: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  course_title?: string;
  chapter_id?: number | null;
  course_id?: number;
  exam_id?: number;
  incorrect_answers?: number;
}

interface TestResultsProps {
  results: TestResult[];
}

const TestResults = ({ results }: TestResultsProps) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>("all"); // "all", "final", "chapter"
  const [filterPassed, setFilterPassed] = useState<string>("all"); // "all", "passed", "failed"
  
  // Xem chi tiết kết quả bài kiểm tra
  const handleViewDetail = (test: TestResult) => {
    if (test.course_id && test.exam_id) {
      navigate(`/khoa-hoc/${test.course_id}/kiem-tra/${test.exam_id}/ket-qua`, {
        state: {
          testResult: test
        }
      });
    } else {
      // Nếu không có course_id hoặc exam_id, mở dialog thông báo
      alert('Chi tiết bài kiểm tra không khả dụng');
    }
  };
  
  // Tính toán số liệu thống kê
  const stats = useMemo(() => {
    const totalTests = results.length;
    const finalTests = results.filter(r => r.chapter_id === null).length;
    const chapterTests = results.filter(r => r.chapter_id !== null).length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;
    const avgScore = totalTests > 0 
      ? Math.round(results.reduce((sum, test) => sum + test.score, 0) / totalTests) 
      : 0;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    // Tổng số câu sai
    const totalIncorrectAnswers = results.reduce((sum, test) => 
      sum + (test.incorrect_answers || Math.round((test.total * (100 - test.score)) / 100)), 0);
    
    // Sắp xếp theo khóa học
    const courseStats: Record<string, {count: number, passed: number, avgScore: number, incorrectAnswers: number}> = {};
    results.forEach(result => {
      const courseName = result.course_title || "Không xác định";
      if (!courseStats[courseName]) {
        courseStats[courseName] = { count: 0, passed: 0, avgScore: 0, incorrectAnswers: 0 };
      }
      courseStats[courseName].count += 1;
      if (result.passed) courseStats[courseName].passed += 1;
      courseStats[courseName].avgScore += result.score;
      courseStats[courseName].incorrectAnswers += (result.incorrect_answers || 
        Math.round((result.total * (100 - result.score)) / 100));
    });
    
    // Tính điểm trung bình cho mỗi khóa học
    Object.keys(courseStats).forEach(course => {
      courseStats[course].avgScore = Math.round(
        courseStats[course].avgScore / courseStats[course].count
      );
    });
    
    return {
      totalTests,
      finalTests,
      chapterTests,
      passedTests,
      failedTests,
      avgScore,
      passRate,
      courseStats,
      totalIncorrectAnswers
    };
  }, [results]);
  
  // Lọc kết quả dựa trên bộ lọc
  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    // Lọc theo loại bài kiểm tra
    if (filterType === "final") {
      filtered = filtered.filter(r => r.chapter_id === null);
    } else if (filterType === "chapter") {
      filtered = filtered.filter(r => r.chapter_id !== null);
    }
    
    // Lọc theo trạng thái pass/fail
    if (filterPassed === "passed") {
      filtered = filtered.filter(r => r.passed);
    } else if (filterPassed === "failed") {
      filtered = filtered.filter(r => !r.passed);
    }
    
    // Sắp xếp theo thời gian mới nhất
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [results, filterType, filterPassed]);

  return (
    <div className="space-y-6">
      {/* Thống kê tổng hợp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="mr-2 h-5 w-5 text-dtktmt-blue-medium" />
              Tổng quan kết quả
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Tổng số bài kiểm tra</p>
                <p className="text-2xl font-bold">{stats.totalTests}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-2xl font-bold">{stats.avgScore}/100</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Tỷ lệ đạt</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{stats.passRate}%</p>
                  <Progress value={stats.passRate} className="h-2 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Câu trả lời sai</p>
                <p className="text-xl font-bold text-red-500">
                  {stats.totalIncorrectAnswers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart4 className="mr-2 h-5 w-5 text-dtktmt-purple-medium" />
              Thống kê theo loại bài thi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bài kiểm tra chương</span>
                <Badge variant="outline" className="bg-dtktmt-blue-light/30">
                  {stats.chapterTests}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bài kiểm tra cuối khóa</span>
                <Badge variant="outline" className="bg-dtktmt-purple-light/30">
                  {stats.finalTests}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Phân bố bài kiểm tra</p>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  {stats.totalTests > 0 && (
                    <>
                      <div 
                        className="h-full bg-dtktmt-blue-medium float-left" 
                        style={{ width: `${(stats.chapterTests / stats.totalTests) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-dtktmt-purple-medium float-left" 
                        style={{ width: `${(stats.finalTests / stats.totalTests) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
                <div className="flex text-xs mt-1 justify-between">
                  <span className="text-dtktmt-blue-medium">Bài kiểm tra chương</span>
                  <span className="text-dtktmt-purple-medium">Bài kiểm tra cuối khóa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="space-x-1">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("all")}
          >
            Tất cả
          </Button>
          <Button 
            variant={filterType === "final" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("final")}
          >
            Kiểm tra cuối khóa
          </Button>
          <Button 
            variant={filterType === "chapter" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterType("chapter")}
          >
            Kiểm tra chương
          </Button>
        </div>
        <div className="space-x-1">
          <Button 
            variant={filterPassed === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterPassed("all")}
          >
            Tất cả
          </Button>
          <Button 
            variant={filterPassed === "passed" ? "default" : "outline"} 
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setFilterPassed("passed")}
          >
            Đạt
          </Button>
          <Button 
            variant={filterPassed === "failed" ? "default" : "outline"} 
            size="sm"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => setFilterPassed("failed")}
          >
            Không đạt
          </Button>
        </div>
      </div>

      {/* Bảng kết quả */}
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
                  Câu sai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{test.title}</div>
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
                        <span>{test.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{test.score}/{test.total}</div>
                        <Progress value={(test.score/test.total)*100} className="h-1.5 w-24" 
                          style={{color: test.passed ? 'var(--dtktmt-green)' : 'var(--dtktmt-red)'}}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-red-500">
                        <AlertCircle size={14} className="mr-1" />
                        <span>
                          {test.incorrect_answers || Math.round((test.total * (100 - test.score)) / 100)} câu
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.passed ? (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={() => handleViewDetail(test)}
                      >
                        <FileText size={14} className="mr-1" />
                        Xem bài làm
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không có kết quả nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Phần phân tích theo khóa học */}
      {Object.keys(stats.courseStats).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-dtktmt-green" />
              Phân tích theo khóa học
            </CardTitle>
            <CardDescription>
              Tổng hợp kết quả bài kiểm tra theo từng khóa học
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.courseStats).map(([course, data]) => (
                <div key={course} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium">{course}</h4>
                    <Badge variant="outline">
                      {data.count} bài thi
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Điểm trung bình</p>
                      <p className="text-lg font-bold">{data.avgScore}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Đạt/Tổng số</p>
                      <p className="text-lg font-bold">
                        {data.passed}/{data.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Câu trả lời sai</p>
                      <p className="text-lg font-bold text-red-500">
                        {data.incorrectAnswers}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={(data.passed / data.count) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestResults;
