import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  // Đọc biến môi trường từ file .env.* tương ứng với mode
  const env = loadEnv(mode, process.cwd(), '');

  // Lấy biến môi trường, ví dụ VITE_APP_BASE_NAME (nếu có)
  // Mặc định, ta gán baseURL = '/virtualcourse/' hoặc 'http://localhost:3000'
  // Tùy bạn cấu hình. Dưới đây ví dụ: base = env.VITE_APP_BASE_NAME || '/'
  const API_URL = env.VITE_APP_BASE_NAME || '/';

  // Nếu bạn muốn cài cứng port = 3000, có thể để:
  const PORT = 3000;

  return {
    // Server dev
    server: {
      open: true,    // Tự động mở trình duyệt
      port: PORT     // Mặc định chạy cổng 3000
    },

    // Gán global = window để fix một số package legacy
    define: {
      global: 'window'
    },

    // Thiết lập alias (nếu cần). Đoạn alias đang được comment, nếu cần thì bỏ chú thích
    resolve: {
      alias: [
        /*
        // Ví dụ alias:
        // { find: '@', replacement: path.resolve(__dirname, 'src') },
        // { find: 'assets', replacement: path.join(process.cwd(), 'src/assets') },
        */
      ]
    },

    // Cấu hình CSS
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },

    // base URL cho build
    // Nếu gõ lệnh build, các asset sẽ relative theo base này
    base: API_URL,

    // Plugin
    plugins: [
      react(),
      jsconfigPaths()
      // ...các plugin khác nếu có
    ],

    // Báo cho Vite pre-bundle 'jwt-decode' dưới dạng ESM, tránh lỗi default export
    optimizeDeps: {
      include: ['jwt-decode']
    }
  };
});
