
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { User, Phone, School, Lock, Save, LogOut } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { user, updateUser, updatePassword, logout, isLoading } = useAuth();
  
  // Thông tin người dùng
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [school, setSchool] = useState(user?.school || "");
  
  // Mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        full_name: fullName,
        phone_number: phoneNumber,
        school: school
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    try {
      await updatePassword({
        currentPassword,
        newPassword
      });
      
      // Xoá form sau khi cập nhật thành công
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <>
      <NavBar />
      
      <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dtktmt-blue-dark mb-8">
              Tài khoản của tôi
            </h1>
            
            <Card className="shadow-lg border border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin cá nhân và bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 max-w-[400px] mx-4">
                  <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                  <TabsTrigger value="security">Bảo mật</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-4">
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={user?.email}
                            disabled
                            className="pl-10 bg-gray-50"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Email không thể thay đổi sau khi đăng ký
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Họ và tên
                        </label>
                        <div className="relative">
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="school"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Trường/Cơ quan
                        </label>
                        <div className="relative">
                          <Input
                            id="school"
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="pl-10"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <School className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Đang cập nhật...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="security" className="p-4">
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="currentPassword"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Đang cập nhật...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            <span>Đổi mật khẩu</span>
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default ProfilePage;
