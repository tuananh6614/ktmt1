-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 30, 2025 lúc 03:27 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `dbktmt1`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `chapter_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chapters`
--

INSERT INTO `chapters` (`id`, `course_id`, `title`, `chapter_order`, `created_at`, `updated_at`) VALUES
(2, 1, 'Giới thiệu về STM32', 1, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(3, 1, 'Lập trình GPIO', 2, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(4, 1, 'Timer và PWM', 3, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(5, 2, 'aa', 1, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(6, 2, 'bb', 2, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(7, 2, 'cc', 3, '2025-04-23 20:54:07', '2025-04-23 20:54:07');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `thumbnail`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Vi điều khiển STM32', 'Khóa học này cung cấp kiến thức từ cơ bản đến nâng cao về lập trình vi điều khiển STM32. Bạn sẽ học cách thiết lập và lập trình các dự án thực tế sử dụng nền tảng STM32.', 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'active', '2025-04-23 14:51:10', '2025-04-23 14:51:10'),
(2, 'Điện tử số và thiết kế mạch', 'Khóa học này giới thiệu về nguyên lý hoạt động của mạch điện tử số, các cổng logic, flip-flop, và cách thiết kế mạch số từ khâu vẽ sơ đồ đến thi công thực tế.', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'active', '2025-04-23 14:51:17', '2025-04-23 14:51:17'),
(3, 'Internet of Things (IoT) với ESP8266 và ESP32', 'Khóa học thực hành về IoT sử dụng các module ESP8266 và ESP32. Học viên sẽ được hướng dẫn xây dựng các dự án thông minh kết nối Internet như hệ thống giám sát môi trường, điều khiển thiết bị từ xa.', 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'active', '2025-04-23 14:51:22', '2025-04-23 14:51:22'),
(4, 'Xử lý tín hiệu số DSP', 'Khóa học chuyên sâu về xử lý tín hiệu số, từ lý thuyết đến ứng dụng thực tế. Các chủ đề bao gồm biến đổi Fourier, thiết kế bộ lọc số, và xử lý hình ảnh/âm thanh cơ bản.', 'https://images.unsplash.com/photo-1567301269952-7a7d57e0b58d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'active', '2025-04-23 14:51:28', '2025-04-23 14:51:28'),
(5, '[value-2]', '[value-3]', '[value-4]', 'active', '2025-05-22 15:19:12', '2025-04-23 15:19:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `documents`
--

INSERT INTO `documents` (`id`, `category_id`, `title`, `description`, `price`, `file_path`, `created_at`, `updated_at`) VALUES
(1, 1, 'Giáo trình Mạch điện tử cơ bản', 'Tổng hợp kiến thức cơ bản về mạch điện tử: linh kiện, phân tích mạch, và các bài tập thực hành.', 55000.00, '/uploads/documents/a.pdf', '2025-04-22 14:58:32', '2025-04-22 15:00:38'),
(2, 2, 'Bài tập Lập trình Arduino nâng cao', 'Tập hợp các bài tập từ cơ bản đến nâng cao về lập trình Arduino, kèm giải thích chi tiết.', 65000.00, '/uploads/documents/b.docx', '2025-04-22 14:58:32', '2025-04-22 15:03:00'),
(3, 2, 'Baor vệ đồ án', 'hhhhhhhh', 100000.00, '/uploads/documents/v.pptx\r\n', '0000-00-00 00:00:00', '2025-04-22 15:25:24'),
(4, 2, 'Baorzz vệ đồ án', 'hhhhhádasdasdhhh', 100000.00, '[value-6]', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `documents_categories`
--

CREATE TABLE `documents_categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `documents_categories`
--

INSERT INTO `documents_categories` (`id`, `category_name`, `created_at`, `updated_at`) VALUES
(1, 'Đề Cương', '2025-04-21 03:15:13', '2025-04-21 03:15:13'),
(2, 'Giáo trình', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `documents_user`
--

CREATE TABLE `documents_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enrollment`
--

CREATE TABLE `enrollment` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `progress_percent` decimal(5,2) DEFAULT NULL,
  `status` enum('enrolled','completed','dropped') NOT NULL DEFAULT 'enrolled',
  `enrolled_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `enrollment`
--

INSERT INTO `enrollment` (`id`, `course_id`, `user_id`, `progress_percent`, `status`, `enrolled_date`, `updated_at`) VALUES
(4, 1, 2, NULL, 'enrolled', '2025-04-29 04:36:24', '2025-04-29 04:36:24'),
(5, 2, 2, NULL, 'enrolled', '2025-04-29 13:31:24', '2025-04-29 13:31:24'),
(6, 1, 3, NULL, 'enrolled', '2025-04-29 14:57:24', '2025-04-29 14:57:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `time_limit` int(11) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `exams`
--

INSERT INTO `exams` (`id`, `course_id`, `chapter_id`, `title`, `time_limit`, `total_questions`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Bài kiểm tra chương 1', 25, 10, '2025-04-29 16:28:46', '2025-04-29 16:29:53'),
(2, 1, 3, 'Bài kiểm tra chương 2', 25, 10, '2025-04-29 16:28:46', '2025-04-29 16:29:53'),
(3, 1, NULL, 'Bài kiểm tra kết thúc', 30, 15, '2025-04-29 16:28:46', '2025-04-29 16:29:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `lesson_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lessons`
--

INSERT INTO `lessons` (`id`, `chapter_id`, `title`, `lesson_order`, `created_at`, `updated_at`) VALUES
(6, 2, 'Cấu trúc GPIO trên STM32', 1, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(7, 2, 'Điều khiển LED', 2, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(8, 2, 'Đọc nút nhấn', 3, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(9, 3, 'Giới thiệu về Timer', 1, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(10, 3, 'Cấu hình PWM cơ bản', 2, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(11, 3, 'Ứng dụng PWM điều khiển động cơ', 3, '2025-04-24 03:54:07', '2025-04-24 03:54:07'),
(12, 4, 'Điều khiển LED', 2, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(13, 4, 'Đọc nút nhấn', 3, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(14, 5, 'Giới thiệu về Timer', 1, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(15, 5, 'Cấu hình PWM cơ bản', 2, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(16, 5, 'Ứng dụng PWM điều khiển động cơ', 3, '2025-04-23 20:54:07', '2025-04-23 20:54:07'),
(17, 4, 'Cấu trúc GPIO trên STM32', 1, '2025-04-23 20:54:07', '2025-04-23 20:54:07');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `page_number` int(11) NOT NULL,
  `page_type` enum('text','video','other') NOT NULL DEFAULT 'text',
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `pages`
--

INSERT INTO `pages` (`id`, `lesson_id`, `page_number`, `page_type`, `content`, `created_at`, `updated_at`) VALUES
(1, 6, 1, 'text', 'import { useState, useEffect } from \"react\";\r\nimport { useParams, useNavigate } from \"react-router-dom\";\r\nimport { Book, Clock, CheckCircle, ChevronRight, ChevronDown, Users, Award, PlayCircle, FileText, Lock, Star } from \"lucide-react\";\r\nimport NavBar from \"@/components/NavBar\";\r\nimport Footer from \"@/components/Footer\";\r\nimport ChatBox from \"@/components/ChatBox\";\r\nimport { Button } from \"@/components/ui/button\";\r\nimport { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from \"@/components/ui/accordion\";\r\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from \"@/components/ui/tabs\";\r\nimport { Skeleton } from \"@/components/ui/skeleton\";\r\nimport { Alert, AlertDescription } from \"@/components/ui/alert\";\r\nimport { toast } from \"sonner\";\r\nimport { motion } from \"framer-motion\";\r\nimport { API_BASE_URL } from \"@/config/config\";\r\n\r\n// Định nghĩa interface cho dữ liệu\r\ninterface Page {\r\n  id: number;\r\n  lesson_id: number;\r\n  page_number: number;\r\n  page_type: \'text\' | \'video\' | \'other\';\r\n  content: string;\r\n  created_at: string;\r\n  updated_at: string;\r\n}\r\n\r\ninterface Lesson {\r\n  id: number;\r\n  chapter_id: number;\r\n  title: string;\r\n  lesson_order: number;\r\n  created_at: string;\r\n  updated_at: string;\r\n  pages?: Page[];\r\n}\r\n\r\ninterface Chapter {\r\n  id: number;\r\n  course_id: number;\r\n  title: string;\r\n  chapter_order: number;\r\n  created_at: string;\r\n  updated_at: string;\r\n  lessons: Lesson[];\r\n}\r\n\r\ninterface Course {\r\n  id: number;\r\n  title: string;\r\n  description: string;\r\n  thumbnail: string;\r\n  status: \'active\' | \'inactive\' | \'maintenance\';\r\n  created_at: string;\r\n  updated_at: string;\r\n  chapters: Chapter[];\r\n}\r\n\r\nconst CourseDetailPage = () => {\r\n  const { courseId } = useParams<{ courseId: string }>();\r\n  const navigate = useNavigate();\r\n  const [course, setCourse] = useState<Course | null>(null);\r\n  const [loading, setLoading] = useState(true);\r\n  const [error, setError] = useState<string | null>(null);\r\n  const [enrolling, setEnrolling] = useState(false);\r\n  const [isEnrolled, setIsEnrolled] = useState(false);\r\n\r\n  // Lấy dữ liệu khóa học bao gồm chương và bài học\r\n  useEffect(() => {\r\n    const fetchCourseStructure = async () => {\r\n      try {\r\n        setLoading(true);\r\n        const apiUrl = `${API_BASE_URL}/api/courses/${courseId}/structure`;\r\n        console.log(`Đang tải cấu trúc khóa học từ: ${apiUrl}`);\r\n        \r\n        const response = await fetch(apiUrl, {\r\n          headers: {\r\n            \'Accept\': \'application/json\',\r\n            \'Cache-Control\': \'no-cache\'\r\n          }\r\n        });\r\n        \r\n        if (!response.ok) {\r\n          throw new Error(`Không thể tải thông tin khóa học: ${response.status} ${response.statusText}`);\r\n        }\r\n        \r\n        const data = await response.json();\r\n        console.log(\"Đã nhận dữ liệu khóa học:\", data);\r\n        \r\n        // Kiểm tra nếu không có chapters hoặc mảng rỗng\r\n        if (!data.chapters || data.chapters.length === 0) {\r\n          console.warn(\"Cảnh báo: Khóa học không có chương nào\");\r\n        } else {\r\n          // Tải thông tin trang cho mỗi bài học\r\n          for (const chapter of data.chapters) {\r\n            if (chapter.lessons && chapter.lessons.length > 0) {\r\n              for (const lesson of chapter.lessons) {\r\n                try {\r\n                  console.log(`Đang tải trang cho bài học: ${lesson.id}`);\r\n                  const pagesUrl = `${API_BASE_URL}/api/lessons/${lesson.id}/pages`;\r\n                  \r\n                  const pagesResponse = await fetch(pagesUrl, {\r\n                    headers: {\r\n                      \'Accept\': \'application/json\',\r\n                      \'Cache-Control\': \'no-cache\'\r\n                    }\r\n                  });\r\n                  \r\n                  if (!pagesResponse.ok) {\r\n                    console.error(`Lỗi khi tải trang cho bài học ${lesson.id}: ${pagesResponse.status} ${pagesResponse.statusText}`);\r\n                    continue;\r\n                  }\r\n                  \r\n                  const pagesData = await pagesResponse.json();\r\n                  console.log(`Đã nhận dữ liệu trang cho bài học ${lesson.id}:`, pagesData);\r\n                  lesson.pages = pagesData;\r\n                } catch (pageErr) {\r\n                  console.error(`Lỗi khi tải trang cho bài học ${lesson.id}:`, pageErr);\r\n                }\r\n              }\r\n            }\r\n          }\r\n        }\r\n        \r\n        setCourse(data);\r\n        setError(null);\r\n      } catch (err) {\r\n        console.error(\"Lỗi khi tải thông tin khóa học:\", err);\r\n        setError(`Không thể tải thông tin khóa học: ${err instanceof Error ? err.message : \'Lỗi không xác định\'}`);\r\n      } finally {\r\n        setLoading(false);\r\n      }\r\n    };\r\n\r\n    // Kiểm tra xem người dùng đã đăng ký khóa học này chưa\r\n    const checkEnrollment = async () => {\r\n      const token = localStorage.getItem(\'token\');\r\n      if (!token) {\r\n        setIsEnrolled(false);\r\n        return;\r\n      }\r\n\r\n      try {\r\n        const response = await fetch(`${API_BASE_URL}/api/enrollments`, {\r\n          headers: {\r\n            \'Authorization\': `Bearer ${token}`\r\n          }\r\n        });\r\n\r\n        if (!response.ok) {\r\n          throw new Error(\'Failed to fetch enrollments\');\r\n        }\r\n\r\n        const enrollments = await response.json();\r\n        setIsEnrolled(enrollments.some(e => e.course_id === parseInt(courseId || \'0\')));\r\n      } catch (error) {\r\n        console.error(\'Error checking enrollment:\', error);\r\n        setIsEnrolled(false);\r\n      }\r\n    };\r\n    \r\n    fetchCourseStructure();\r\n    checkEnrollment();\r\n  }, [courseId]);\r\n\r\n  // Tính tổng số bài học\r\n  const totalLessons = course?.chapters.reduce((total, chapter) => {\r\n    return total + chapter.lessons.length;\r\n  }, 0) || 0;\r\n\r\n  // Đăng ký học\r\n  const handleEnroll = async () => {\r\n    setEnrolling(true);\r\n    \r\n    try {\r\n      const token = localStorage.getItem(\'token\');\r\n      if (!token) {\r\n        toast.error(\"Vui lòng đăng nhập để đăng ký khóa học\");\r\n        navigate(\'/login\');\r\n        return;\r\n      }\r\n\r\n      const response = await fetch(`${API_BASE_URL}/api/enrollments`, {\r\n        method: \'POST\',\r\n        headers: {\r\n          \'Authorization\': `Bearer ${token}`,\r\n          \'Content-Type\': \'application/json\'\r\n        },\r\n        body: JSON.stringify({ course_id: courseId })\r\n      });\r\n\r\n      if (!response.ok) {\r\n        const errorData = await response.json();\r\n        throw new Error(errorData.message || \'Đăng ký thất bại\');\r\n      }\r\n\r\n      setIsEnrolled(true);\r\n      toast.success(\"Đăng ký khóa học thành công!\");\r\n    } catch (error) {\r\n      console.error(\"Lỗi khi đăng ký khóa học:\", error);\r\n      toast.error(error.message || \"Đăng ký khóa học thất bại. Vui lòng thử lại sau!\");\r\n    } finally {\r\n      setEnrolling(false);\r\n    }\r\n  };\r\n\r\n  // Mở bài học đầu tiên\r\n  const startLearning = () => {\r\n    if (course?.chapters.length && course.chapters[0].lessons.length) {\r\n      const firstChapter = course.chapters[0];\r\n      const firstLesson = firstChapter.lessons[0];\r\n      navigate(`/khoa-hoc/${courseId}/noi-dung`);\r\n    }\r\n  };\r\n\r\n  return (\r\n    <div className=\"min-h-screen flex flex-col\">\r\n      <NavBar />\r\n\r\n      <main className=\"flex-1 bg-gradient-to-b from-blue-50 to-white\">\r\n        {loading ? (\r\n          <div className=\"container py-12\">\r\n            <CourseSkeleton />\r\n          </div>\r\n        ) : error ? (\r\n          <div className=\"container py-12\">\r\n            <Alert variant=\"destructive\" className=\"mb-6\">\r\n              <AlertDescription>{error}</AlertDescription>\r\n            </Alert>\r\n            <Button onClick={() => navigate(-1)} variant=\"outline\">Quay lại</Button>\r\n          </div>\r\n        ) : course ? (\r\n          <>\r\n            {/* Banner khóa học */}\r\n            <div className=\"bg-gradient-to-r from-dtktmt-blue-dark to-dtktmt-purple-dark text-white py-16\">\r\n              <div className=\"container\">\r\n                <div className=\"grid md:grid-cols-3 gap-8 items-center\">\r\n                  <div className=\"md:col-span-2\">\r\n                    <motion.h1 \r\n                      initial={{ opacity: 0, y: 20 }}\r\n                      animate={{ opacity: 1, y: 0 }}\r\n                      className=\"text-3xl md:text-4xl font-bold mb-4\"\r\n                    >\r\n                      {course.title}\r\n                    </motion.h1>\r\n                    <motion.p \r\n                      initial={{ opacity: 0, y: 20 }}\r\n                      animate={{ opacity: 1, y: 0 }}\r\n                      transition={{ delay: 0.1 }}\r\n                      className=\"text-white/80 mb-6\"\r\n                    >\r\n                      {course.description}\r\n                    </motion.p>\r\n                    <motion.div \r\n                      initial={{ opacity: 0, y: 20 }}\r\n                      animate={{ opacity: 1, y: 0 }}\r\n                      transition={{ delay: 0.2 }}\r\n                      className=\"flex flex-wrap gap-4 mb-6\"\r\n                    >\r\n                      <div className=\"bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center\">\r\n                        <Book className=\"mr-2 h-4 w-4\" />\r\n                        <span>{totalLessons} bài học</span>\r\n                      </div>\r\n                      <div className=\"bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center\">\r\n                        <Users className=\"mr-2 h-4 w-4\" />\r\n                        <span>500+ học viên</span>\r\n                      </div>\r\n                    </motion.div>\r\n                    <motion.div \r\n                      initial={{ opacity: 0, y: 20 }}\r\n                      animate={{ opacity: 1, y: 0 }}\r\n                      transition={{ delay: 0.3 }}\r\n                    >\r\n                      {isEnrolled ? (\r\n                        <Button \r\n                          onClick={startLearning}\r\n                          className=\"bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all\"\r\n                        >\r\n                          <PlayCircle className=\"mr-2 h-5 w-5\" />\r\n                          Tiếp tục học\r\n                        </Button>\r\n                      ) : (\r\n                        <Button \r\n                          onClick={handleEnroll}\r\n                          disabled={enrolling}\r\n                          className=\"bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all\"\r\n                        >\r\n                          {enrolling ? \"Đang đăng ký...\" : \"Đăng ký học ngay\"}\r\n                        </Button>\r\n                      )}\r\n                    </motion.div>\r\n                  </div>\r\n                  <div className=\"md:col-span-1\">\r\n                    <motion.div\r\n                      initial={{ opacity: 0, scale: 0.9 }}\r\n                      animate={{ opacity: 1, scale: 1 }}\r\n                      transition={{ delay: 0.2 }}\r\n                      className=\"rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300\"\r\n                    >\r\n                      <img \r\n                        src={course.thumbnail || \"/placeholder.svg\"} \r\n                        alt={course.title} \r\n                        className=\"w-full h-64 object-cover\"\r\n                      />\r\n                    </motion.div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            {/* Nội dung chi tiết */}\r\n            <div className=\"container py-12\">\r\n              <Tabs defaultValue=\"content\" className=\"w-full\">\r\n                <TabsList className=\"mb-8\">\r\n                  <TabsTrigger value=\"content\">Nội dung khóa học</TabsTrigger>\r\n                  <TabsTrigger value=\"overview\">Ngân hàng câu hỏi</TabsTrigger>\r\n                </TabsList>\r\n                \r\n                <TabsContent value=\"content\" className=\"space-y-6\">\r\n                  <div className=\"grid md:grid-cols-3 gap-8\">\r\n                    <div className=\"md:col-span-2\">\r\n                      <h2 className=\"text-2xl font-bold mb-6\">Nội dung khóa học</h2>\r\n\r\n                      {course.chapters && course.chapters.length > 0 ? (\r\n                        <Accordion type=\"single\" collapsible className=\"w-full\">\r\n                          {course.chapters.map((chapter, index) => (\r\n                            <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>\r\n                              <AccordionTrigger className=\"text-left py-4 hover:bg-dtktmt-blue-light/10 px-4 rounded-lg\">\r\n                                <div className=\"flex items-center\">\r\n                                  <div className=\"bg-dtktmt-blue-medium text-white w-8 h-8 rounded-full flex items-center justify-center mr-3\">\r\n                                    {index + 1}\r\n                                  </div>\r\n                                  <div>\r\n                                    <h3 className=\"font-semibold\">{chapter.title}</h3>\r\n                                    <p className=\"text-sm text-gray-500\">{chapter.lessons.length} bài học</p>\r\n                                  </div>\r\n                                </div>\r\n                              </AccordionTrigger>\r\n                              <AccordionContent className=\"pl-16 pr-4\">\r\n                                <ul className=\"space-y-3 py-2\">\r\n                                  {chapter.lessons.map((lesson, lessonIndex) => (\r\n                                    <li key={lesson.id} className=\"border-b border-gray-100 last:border-0 pb-4\">\r\n                                      <div className=\"flex items-center justify-between mb-2\">\r\n                                        <div className=\"flex items-center gap-3\">\r\n                                          {isEnrolled ? (\r\n                                            <Button\r\n                                              variant=\"ghost\"\r\n                                              size=\"sm\"\r\n                                              className=\"h-8 w-8 p-0 rounded-full\"\r\n                                              onClick={() => navigate(`/khoa-hoc/${courseId}/noi-dung`)}\r\n                                            >\r\n                                              <PlayCircle className=\"h-5 w-5 text-dtktmt-blue-medium\" />\r\n                                            </Button>\r\n                                          ) : (\r\n                                            <Lock className=\"h-4 w-4 text-gray-400 ml-1.5\" />\r\n                                          )}\r\n                                          <span className=\"text-sm font-semibold\">{lesson.title}</span>\r\n                                        </div>\r\n                                        \r\n                                      </div>\r\n                                      \r\n                                      {/* Danh sách các trang trong bài học */}\r\n                                      {lesson.pages && lesson.pages.length > 0 && (\r\n                                        <div className=\"ml-11 mt-2\">\r\n                                          <div className=\"border-l-2 border-gray-200 pl-4 space-y-2\">\r\n                                            {lesson.pages.map((page) => (\r\n                                              <div key={page.id} className=\"flex items-center gap-2 text-xs text-gray-600\">\r\n                                                {page.page_type === \'video\' ? (\r\n                                                  <PlayCircle className=\"h-3.5 w-3.5 text-dtktmt-blue-light\" />\r\n                                                ) : page.page_type === \'text\' ? (\r\n                                                  <FileText className=\"h-3.5 w-3.5 text-dtktmt-blue-light\" />\r\n                                                ) : (\r\n                                                  <FileText className=\"h-3.5 w-3.5 text-dtktmt-blue-light\" />\r\n                                                )}\r\n                                                <span>\r\n                                                  Trang {page.page_number}: {page.content.substring(0, 40)}\r\n                                                  {page.content.length > 40 ? \'...\' : \'\'}\r\n                                                </span>\r\n                                              </div>\r\n                                            ))}\r\n                                          </div>\r\n                                        </div>\r\n                                      )}\r\n                                    </li>\r\n                                  ))}\r\n                                </ul>\r\n                              </AccordionContent>\r\n                            </AccordionItem>\r\n                          ))}\r\n                        </Accordion>\r\n                      ) : (\r\n                        <div className=\"bg-gray-50 rounded-lg p-8 text-center\">\r\n                          <p className=\"text-gray-500\">Khóa học này chưa có nội dung. Vui lòng quay lại sau.</p>\r\n                        </div>\r\n                      )}\r\n                    </div>\r\n\r\n                    <div className=\"md:col-span-1\">\r\n                      <div className=\"bg-white rounded-xl shadow-lg p-6 sticky top-24\">\r\n                        <h3 className=\"text-xl font-bold mb-4\">Thông tin khóa học</h3>                        \r\n                        <div className=\"space-y-4 mb-6\">\r\n                          <div className=\"flex justify-between items-center pb-2 border-b\">\r\n                            <span className=\"text-gray-600\">Tổng số bài học</span>\r\n                            <span className=\"font-medium\">{totalLessons} bài</span>\r\n                          </div>\r\n                          <div className=\"flex justify-between items-center pb-2 border-b\">\r\n                            <span className=\"text-gray-600\">Cấp độ</span>\r\n                            <span className=\"font-medium\">Cơ bản</span>\r\n                          </div>\r\n                          <div className=\"flex justify-between items-center pb-2 border-b\">\r\n                            <span className=\"text-gray-600\">Ngôn ngữ</span>\r\n                            <span className=\"font-medium\">Tiếng Việt</span>\r\n                          </div>\r\n                          <div className=\"flex justify-between items-center\">\r\n                            <span className=\"text-gray-600\">Chứng chỉ</span>\r\n                            <span className=\"font-medium flex items-center text-dtktmt-blue-medium\">\r\n                              <Award className=\"h-4 w-4 mr-1\" />\r\n                              <span>Có</span>\r\n                            </span>\r\n                          </div>\r\n                        </div>\r\n                        \r\n                        {isEnrolled ? (\r\n                          <Button \r\n                            onClick={startLearning}\r\n                            className=\"w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark\"\r\n                          >\r\n                            <PlayCircle className=\"mr-2 h-4 w-4\" />\r\n                            Tiếp tục học\r\n                          </Button>\r\n                        ) : (\r\n                          <Button \r\n                            onClick={handleEnroll}\r\n                            disabled={enrolling}\r\n                            className=\"w-full bg-dtktmt-pink-medium hover:bg-dtktmt-pink-dark text-white\"\r\n                          >\r\n                            {enrolling ? \"Đang đăng ký...\" : \"Đăng ký học ngay\"}\r\n                          </Button>\r\n                        )}\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </TabsContent>\r\n                \r\n                <TabsContent value=\"overview\">\r\n                  <div className=\"bg-white rounded-xl shadow-lg p-8\">\r\n     \r\n                    {/* Nội dung mới sẽ được thêm vào đây */}\r\n                  </div>\r\n                </TabsContent>\r\n              </Tabs>\r\n            </div>\r\n          </>\r\n        ) : null}\r\n      </main>\r\n\r\n      <Footer />\r\n      <ChatBox />\r\n    </div>\r\n  );\r\n};\r\n\r\n// Skeleton loading\r\nconst CourseSkeleton = () => {\r\n  return (\r\n    <div className=\"space-y-8\">\r\n      <div className=\"grid md:grid-cols-3 gap-8 items-center\">\r\n        <div className=\"md:col-span-2 space-y-4\">\r\n          <Skeleton className=\"h-12 w-full\" />\r\n          <Skeleton className=\"h-24 w-full\" />\r\n          <div className=\"flex gap-4\">\r\n            <Skeleton className=\"h-10 w-32\" />\r\n            <Skeleton className=\"h-10 w-32\" />\r\n          </div>\r\n          <Skeleton className=\"h-14 w-40\" />\r\n        </div>\r\n        <div className=\"md:col-span-1\">\r\n          <Skeleton className=\"h-64 w-full rounded-xl\" />\r\n        </div>\r\n      </div>\r\n      \r\n      <div className=\"grid md:grid-cols-3 gap-8\">\r\n        <div className=\"md:col-span-2 space-y-4\">\r\n          <Skeleton className=\"h-10 w-64\" />\r\n          {[1, 2, 3].map((item) => (\r\n            <Skeleton key={item} className=\"h-20 w-full\" />\r\n          ))}\r\n        </div>\r\n        <div className=\"md:col-span-1\">\r\n          <Skeleton className=\"h-80 w-full rounded-xl\" />\r\n        </div>\r\n      </div>\r\n    </div>\r\n  );\r\n};\r\n\r\nexport default CourseDetailPage; ', '2025-04-24 03:59:57', '2025-04-24 14:20:19'),
(2, 6, 2, 'video', 'https://example.com/video1.mp4', '2025-04-24 03:59:57', '2025-04-24 03:59:57'),
(3, 6, 3, 'text', 'Ưu điểm của STM32 so với các dòng vi điều khiển khác...', '2025-04-24 03:59:57', '2025-04-24 03:59:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `questions`
--

INSERT INTO `questions` (`id`, `chapter_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `created_at`, `updated_at`) VALUES
(11, 4, 'STM32 sử dụng vi xử lý nào?', 'ARM Cortex-M', 'Intel x86', 'RISC-V', 'AMD Ryzen', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(12, 4, 'Công cụ phát triển chính thức cho STM32 là gì?', 'STM32CubeIDE', 'Arduino IDE', 'Visual Studio Code', 'Eclipse', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(13, 4, 'STM32 là sản phẩm của hãng nào?', 'STMicroelectronics', 'Texas Instruments', 'Microchip', 'NXP', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(14, 2, 'Chân GPIO trên STM32 có thể hoạt động ở chế độ nào?', 'Input và Output', 'Chỉ Output', 'Chỉ Input', 'Không có chế độ nào', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(15, 2, 'Để đọc trạng thái nút nhấn, bạn cần cấu hình GPIO là?', 'Input Pull-up', 'Output Push-pull', 'Analog', 'Input Floating', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(16, 2, 'Pull-up resistor được sử dụng để làm gì?', 'Giữ mức logic cao khi không có tín hiệu', 'Giảm dòng điện', 'Tăng tốc độ xử lý', 'Bảo vệ chân vi điều khiển', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(17, 3, 'PWM được sử dụng để làm gì?', 'Điều khiển tốc độ động cơ', 'Đọc giá trị cảm biến', 'Kết nối WiFi', 'Truyền dữ liệu UART', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(18, 3, 'Timer trên STM32 có thể được sử dụng để?', 'Tạo độ trễ chính xác', 'Chỉ để đếm thời gian', 'Chỉ để tạo ngắt', 'Không thể lập trình được', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(19, 3, 'Tần số PWM phụ thuộc vào yếu tố nào?', 'Cấu hình prescaler và period', 'Điện áp nguồn', 'Tốc độ CPU', 'RAM của vi điều khiển', 'A', '2025-04-29 03:00:51', '2025-04-29 03:00:51'),
(20, 5, '[value-3]', '[value-4]', '[value-5]', '[value-6]', '[value-7]', '[value-8]', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `question_test`
--

CREATE TABLE `question_test` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_exam_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `school` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `phone_number`, `school`, `role`, `status`, `created_at`, `updated_at`, `avatar_url`, `name`) VALUES
(1, 'a@gmail.com', '$2b$10$5uJMs2OMzdqpph3tZGoG9uQyYZ5uCkpH1ErJy8QAUnBGYK4BEFrIe', 'tuan anh', '123456', 'rrrrr', 'user', 'active', '2025-04-17 07:52:34', '2025-04-17 07:52:34', NULL, ''),
(2, 'b@gmail.com', '$2b$10$Ejp0Fu8nnrN6T6zZ94O8EOvRlXihQHkBaUrjfrCU8wQrYjPSPVVYK', 'Tuan ANhzz', '123', 'eezzzz', 'user', 'active', '2025-04-17 15:46:02', '2025-04-21 02:31:19', '/uploads/avatars/1745202679187-372458440.jpg', ''),
(3, 'd@gmail.com', '$2b$10$5eiKdrYwyLK3XSPtApXsouznpL5M63QuuvduBnnko2eoPmA5FAngS', 'Dũng', '0123456789', 'Đại học Điện lực', 'admin', 'active', '2025-04-29 14:56:14', '2025-04-29 15:30:23', '/uploads/avatars/1745940623002-272600946.jpg', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_exam`
--

CREATE TABLE `user_exam` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `attempt_count` int(11) DEFAULT 0,
  `score` float DEFAULT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Chỉ mục cho bảng `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `documents_categories`
--
ALTER TABLE `documents_categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `documents_user`
--
ALTER TABLE `documents_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `document_id` (`document_id`);

--
-- Chỉ mục cho bảng `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Chỉ mục cho bảng `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Chỉ mục cho bảng `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Chỉ mục cho bảng `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Chỉ mục cho bảng `question_test`
--
ALTER TABLE `question_test`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `question_id` (`question_id`,`user_exam_id`),
  ADD KEY `user_exam_id` (`user_exam_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `user_exam`
--
ALTER TABLE `user_exam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `user_exam_index_user_id` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `documents_categories`
--
ALTER TABLE `documents_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `documents_user`
--
ALTER TABLE `documents_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `question_test`
--
ALTER TABLE `question_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user_exam`
--
ALTER TABLE `user_exam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `documents_categories` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `documents_user`
--
ALTER TABLE `documents_user`
  ADD CONSTRAINT `documents_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `documents_user_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `question_test`
--
ALTER TABLE `question_test`
  ADD CONSTRAINT `question_test_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `question_test_ibfk_2` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exam` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `user_exam`
--
ALTER TABLE `user_exam`
  ADD CONSTRAINT `user_exam_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_exam_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
