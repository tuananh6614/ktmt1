
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, User, Lock, Mail, Phone, School, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Đăng nhập thành công!");
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-dtktmt-blue-medium to-dtktmt-purple-medium p-8 items-center justify-center">
        <div className="max-w-md text-white">
          <div className="flex items-center mb-8">
            <div className="bg-white rounded-full p-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dtktmt-blue-medium">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold">DT&KTMT1</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Học liệu chất lượng cho sinh viên Điện Tử
          </h2>
          <p className="mb-8">
            Tham gia ngay để truy cập vào kho tàng học liệu đa dạng và chất lượng cao về Điện tử và Kỹ thuật máy tính.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M15.5 9.5 12 6 8.5 9.5"></path>
                  <path d="m12 6-2 2h4l-2-2z"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                  <path d="M22 8h-4"></path>
                  <path d="M6 18h12"></path>
                  <path d="M12 12v4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Học mọi lúc, mọi nơi</h3>
                <p className="text-white/80 text-sm">
                  Truy cập dễ dàng vào các khóa học và tài liệu từ mọi thiết bị
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Hỗ trợ 24/7</h3>
                <p className="text-white/80 text-sm">
                  Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Cập nhật liên tục</h3>
                <p className="text-white/80 text-sm">
                  Nội dung được cập nhật thường xuyên để bắt kịp công nghệ mới
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="bg-dtktmt-blue-medium rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </div>
              <span className="font-montserrat font-bold text-xl text-dtktmt-blue-dark">DT&KTMT1</span>
            </Link>
            <h2 className="text-2xl font-bold text-dtktmt-blue-dark">
              Chào mừng bạn quay trở lại
            </h2>
            <p className="text-gray-600">
              Đăng nhập hoặc đăng ký để trải nghiệm đầy đủ
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="flex items-center gap-2 py-3">
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2 py-3">
                <UserPlus size={16} />
                <span>Đăng ký</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Mật khẩu"
                      type="password"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-dtktmt-blue-medium focus:ring-dtktmt-blue-medium"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark">
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn size={18} />
                        <span>Đăng nhập</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-gray-500 text-sm">hoặc đăng nhập với</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25526 2.69 1.28027 6.60998L5.27026 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25537 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Họ và tên"
                      type="text"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Số điện thoại"
                      type="tel"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Trường/Cơ quan"
                      type="text"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Mật khẩu"
                      type="password"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Xác nhận mật khẩu"
                      type="password"
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-dtktmt-blue-medium focus:ring-dtktmt-blue-medium"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      Tôi đồng ý với <a href="#" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark">Điều khoản sử dụng</a> và <a href="#" className="text-dtktmt-blue-medium hover:text-dtktmt-blue-dark">Chính sách bảo mật</a>
                    </label>
                  </div>
                  
                  <Button
                    className="w-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang đăng ký...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus size={18} />
                        <span>Đăng ký</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
