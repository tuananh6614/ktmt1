import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  Trash, 
  Pencil, 
  Plus, 
  FileText, 
  Upload, 
  Search, 
  X, 
  Download,
  ExternalLink,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Document {
  id: number;
  title: string;
  description: string;
  category_id: number;
  price: number;
  file_path: string;
  created_at: string;
  category_name?: string;
}

interface Category {
  id: number;
  category_name: string;
}

const API_URL = 'http://localhost:3000/api';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    category_id: "",
    price: ""
  });
  
  const [newCategory, setNewCategory] = useState("");
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  
  // File upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/documents`);
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách tài liệu');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Lỗi khi tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/document-categories`);
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách danh mục');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Lỗi khi tải danh sách danh mục');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Kiểm tra kích thước file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      title: "",
      description: "",
      category_id: "",
      price: ""
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDocument = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const handleEditDocument = (doc: Document) => {
    setFormData({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category_id: doc.category_id.toString(),
      price: doc.price.toString()
    });
    setCurrentDocument(doc);
    setShowEditDialog(true);
  };

  const handleDeleteDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setShowDeleteDialog(true);
  };

  const handleAddCategory = () => {
    setNewCategory("");
    setShowCategoryDialog(true);
  };

  const submitAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category_id || !formData.price || !selectedFile) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn file');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Sử dụng FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('price', formData.price);
      if (selectedFile) {
        formDataToSend.append('document_file', selectedFile);
      }

      const response = await fetch(`${API_URL}/admin/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Không thể thêm tài liệu');
      }

      await response.json();
      toast.success('Thêm tài liệu mới thành công');
      setShowAddDialog(false);
      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Lỗi khi thêm tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category_id || !formData.price) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      let responseData;
      
      // Nếu có file mới, sử dụng endpoint upload
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('document_file', selectedFile);

        const response = await fetch(`${API_URL}/admin/documents/${formData.id}/upload`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật tài liệu');
        }

        responseData = await response.json();
      } else {
        // Nếu không có file mới, sử dụng endpoint cập nhật thông thường
        const response = await fetch(`${API_URL}/admin/documents/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category_id: parseInt(formData.category_id),
            price: parseFloat(formData.price)
          })
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật tài liệu');
        }

        responseData = await response.json();
      }

      toast.success('Cập nhật tài liệu thành công');
      setShowEditDialog(false);
      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Lỗi khi cập nhật tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteDocument = async () => {
    if (!currentDocument) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/admin/documents/${currentDocument.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa tài liệu');
      }

      toast.success(`Đã xóa tài liệu "${currentDocument.title}"`);
      setShowDeleteDialog(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Lỗi khi xóa tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/admin/document-categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category_name: newCategory })
      });

      if (!response.ok) {
        throw new Error('Không thể thêm danh mục');
      }

      await response.json();
      toast.success('Thêm danh mục mới thành công');
      setShowCategoryDialog(false);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Lỗi khi thêm danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc tài liệu theo từ khóa tìm kiếm
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.category_name && doc.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý tài liệu</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleAddCategory}
          >
            <FolderPlus className="h-4 w-4" />
            Thêm danh mục
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleAddDocument}
          >
            <Plus className="h-4 w-4" />
            Thêm tài liệu
          </Button>
        </div>
      </div>
      
      {isLoading && !documents.length ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Tên tài liệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>Không có tài liệu nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map(doc => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.category_name || `Danh mục ${doc.category_id}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {doc.description}
                    </TableCell>
                    <TableCell>
                      {formatPrice(doc.price)}
                    </TableCell>
                    <TableCell>
                      {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(doc.file_path, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditDocument(doc)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDocument(doc)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Dialog Thêm tài liệu */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm tài liệu mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitAddDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên tài liệu</label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên tài liệu"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <Select 
                  name="category_id" 
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({...formData, category_id: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn về tài liệu"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá (VNĐ)</label>
                <Input 
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá tài liệu"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">File tài liệu</label>
                <div 
                  className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <p className="text-sm text-gray-500">Nhấn để chọn file hoặc kéo thả file vào đây</p>
                    <p className="text-xs text-gray-400">Chấp nhận file: PDF, DOC, DOCX</p>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-500">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Thêm tài liệu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Sửa tài liệu */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEditDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên tài liệu</label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên tài liệu"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <Select 
                  name="category_id" 
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({...formData, category_id: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn về tài liệu"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá (VNĐ)</label>
                <Input 
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá tài liệu"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">File tài liệu (tùy chọn)</label>
                <div 
                  className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <p className="text-sm text-gray-500">Nhấn để chọn file hoặc kéo thả file vào đây</p>
                    <p className="text-xs text-gray-400">Để trống nếu không thay đổi file</p>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-500">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Xóa tài liệu */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{currentDocument?.title}"?<br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Đang xử lý...' : 'Xóa tài liệu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog Thêm danh mục */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitAddCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên danh mục</label>
                <Input 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Thêm danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement; 