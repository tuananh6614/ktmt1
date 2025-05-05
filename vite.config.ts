import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Xác định cổng dựa trên biến môi trường hoặc tham số dòng lệnh
  const isAdmin = process.env.VITE_APP_TYPE === 'admin';
  const port = isAdmin ? 8081 : 8080;

  return {
    server: {
      host: "::",
      port: port,
      proxy: {
        // Cấu hình proxy để chuyển tiếp các request API đến backend
        '/api': {
          target: 'https://api.epulearn.xyz',
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Thêm các biến môi trường vào ứng dụng
      'process.env.VITE_APP_TYPE': JSON.stringify(process.env.VITE_APP_TYPE),
    }
  };
});
