// vite.config.mjs
import { defineConfig, loadEnv } from "file:///D:/FPTAptech/HK4-Aptech/VirtualCourse/virtual-course-frontend-admin/node_modules/vite/dist/node/index.js";
import react from "file:///D:/FPTAptech/HK4-Aptech/VirtualCourse/virtual-course-frontend-admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///D:/FPTAptech/HK4-Aptech/VirtualCourse/virtual-course-frontend-admin/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = env.VITE_APP_BASE_NAME || "/";
  const PORT = 3e3;
  return {
    // Server dev
    server: {
      open: true,
      // Tự động mở trình duyệt
      port: PORT
      // Mặc định chạy cổng 3000
    },
    // Gán global = window để fix một số package legacy
    define: {
      global: "window"
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
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
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
      include: ["jwt-decode"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRlBUQXB0ZWNoXFxcXEhLNC1BcHRlY2hcXFxcVmlydHVhbENvdXJzZVxcXFx2aXJ0dWFsLWNvdXJzZS1mcm9udGVuZC1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRlBUQXB0ZWNoXFxcXEhLNC1BcHRlY2hcXFxcVmlydHVhbENvdXJzZVxcXFx2aXJ0dWFsLWNvdXJzZS1mcm9udGVuZC1hZG1pblxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0ZQVEFwdGVjaC9ISzQtQXB0ZWNoL1ZpcnR1YWxDb3Vyc2UvdmlydHVhbC1jb3Vyc2UtZnJvbnRlbmQtYWRtaW4vdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSAndml0ZS1qc2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHUwMTEwXHUxRUNEYyBiaVx1MUVCRm4gbVx1MDBGNGkgdHJcdTAxQjBcdTFFRERuZyB0XHUxRUVCIGZpbGUgLmVudi4qIHRcdTAxQjBcdTAxQTFuZyBcdTFFRTluZyB2XHUxRURCaSBtb2RlXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuXG4gIC8vIExcdTFFQTV5IGJpXHUxRUJGbiBtXHUwMEY0aSB0clx1MDFCMFx1MUVERG5nLCB2XHUwMEVEIGRcdTFFRTUgVklURV9BUFBfQkFTRV9OQU1FIChuXHUxRUJGdSBjXHUwMEYzKVxuICAvLyBNXHUxRUI3YyBcdTAxMTFcdTFFQ0JuaCwgdGEgZ1x1MDBFMW4gYmFzZVVSTCA9ICcvdmlydHVhbGNvdXJzZS8nIGhvXHUxRUI3YyAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ1xuICAvLyBUXHUwMEY5eSBiXHUxRUExbiBjXHUxRUE1dSBoXHUwMEVDbmguIERcdTAxQjBcdTFFREJpIFx1MDExMVx1MDBFMnkgdlx1MDBFRCBkXHUxRUU1OiBiYXNlID0gZW52LlZJVEVfQVBQX0JBU0VfTkFNRSB8fCAnLydcbiAgY29uc3QgQVBJX1VSTCA9IGVudi5WSVRFX0FQUF9CQVNFX05BTUUgfHwgJy8nO1xuXG4gIC8vIE5cdTFFQkZ1IGJcdTFFQTFuIG11XHUxRUQxbiBjXHUwMEUwaSBjXHUxRUU5bmcgcG9ydCA9IDMwMDAsIGNcdTAwRjMgdGhcdTFFQzMgXHUwMTExXHUxRUMzOlxuICBjb25zdCBQT1JUID0gMzAwMDtcblxuICByZXR1cm4ge1xuICAgIC8vIFNlcnZlciBkZXZcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIG9wZW46IHRydWUsICAgIC8vIFRcdTFFRjEgXHUwMTExXHUxRUQ5bmcgbVx1MUVERiB0clx1MDBFQ25oIGR1eVx1MUVDN3RcbiAgICAgIHBvcnQ6IFBPUlQgICAgIC8vIE1cdTFFQjdjIFx1MDExMVx1MUVDQm5oIGNoXHUxRUExeSBjXHUxRUQ1bmcgMzAwMFxuICAgIH0sXG5cbiAgICAvLyBHXHUwMEUxbiBnbG9iYWwgPSB3aW5kb3cgXHUwMTExXHUxRUMzIGZpeCBtXHUxRUQ5dCBzXHUxRUQxIHBhY2thZ2UgbGVnYWN5XG4gICAgZGVmaW5lOiB7XG4gICAgICBnbG9iYWw6ICd3aW5kb3cnXG4gICAgfSxcblxuICAgIC8vIFRoaVx1MUVCRnQgbFx1MUVBRHAgYWxpYXMgKG5cdTFFQkZ1IGNcdTFFQTduKS4gXHUwMTEwb1x1MUVBMW4gYWxpYXMgXHUwMTExYW5nIFx1MDExMVx1MDFCMFx1MUVFM2MgY29tbWVudCwgblx1MUVCRnUgY1x1MUVBN24gdGhcdTAwRUMgYlx1MUVDRiBjaFx1MDBGQSB0aFx1MDBFRGNoXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAgLypcbiAgICAgICAgLy8gVlx1MDBFRCBkXHUxRUU1IGFsaWFzOlxuICAgICAgICAvLyB7IGZpbmQ6ICdAJywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSB9LFxuICAgICAgICAvLyB7IGZpbmQ6ICdhc3NldHMnLCByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzJykgfSxcbiAgICAgICAgKi9cbiAgICAgIF1cbiAgICB9LFxuXG4gICAgLy8gQ1x1MUVBNXUgaFx1MDBFQ25oIENTU1xuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgY2hhcnNldDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgbGVzczoge1xuICAgICAgICAgIGNoYXJzZXQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGFyc2V0OiBmYWxzZSxcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBvc3Rjc3NQbHVnaW46ICdpbnRlcm5hbDpjaGFyc2V0LXJlbW92YWwnLFxuICAgICAgICAgICAgQXRSdWxlOiB7XG4gICAgICAgICAgICAgIGNoYXJzZXQ6IChhdFJ1bGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXRSdWxlLm5hbWUgPT09ICdjaGFyc2V0Jykge1xuICAgICAgICAgICAgICAgICAgYXRSdWxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBiYXNlIFVSTCBjaG8gYnVpbGRcbiAgICAvLyBOXHUxRUJGdSBnXHUwMEY1IGxcdTFFQzduaCBidWlsZCwgY1x1MDBFMWMgYXNzZXQgc1x1MUVCRCByZWxhdGl2ZSB0aGVvIGJhc2Ugblx1MDBFMHlcbiAgICBiYXNlOiBBUElfVVJMLFxuXG4gICAgLy8gUGx1Z2luXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIGpzY29uZmlnUGF0aHMoKVxuICAgICAgLy8gLi4uY1x1MDBFMWMgcGx1Z2luIGtoXHUwMEUxYyBuXHUxRUJGdSBjXHUwMEYzXG4gICAgXSxcblxuICAgIC8vIEJcdTAwRTFvIGNobyBWaXRlIHByZS1idW5kbGUgJ2p3dC1kZWNvZGUnIGRcdTAxQjBcdTFFREJpIGRcdTFFQTFuZyBFU00sIHRyXHUwMEUxbmggbFx1MUVEN2kgZGVmYXVsdCBleHBvcnRcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsnand0LWRlY29kZSddXG4gICAgfVxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVZLFNBQVMsY0FBYyxlQUFlO0FBQzdhLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFLM0MsUUFBTSxVQUFVLElBQUksc0JBQXNCO0FBRzFDLFFBQU0sT0FBTztBQUViLFNBQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxJQUNSO0FBQUE7QUFBQSxJQUdBLFFBQVE7QUFBQSxNQUNOLFFBQVE7QUFBQSxJQUNWO0FBQUE7QUFBQSxJQUdBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFNUDtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBR0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osU0FBUztBQUFBLFFBQ1g7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFVBQ1A7QUFBQSxZQUNFLGVBQWU7QUFBQSxZQUNmLFFBQVE7QUFBQSxjQUNOLFNBQVMsQ0FBQyxXQUFXO0FBQ25CLG9CQUFJLE9BQU8sU0FBUyxXQUFXO0FBQzdCLHlCQUFPLE9BQU87QUFBQSxnQkFDaEI7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUEsSUFJQSxNQUFNO0FBQUE7QUFBQSxJQUdOLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQTtBQUFBLElBRWhCO0FBQUE7QUFBQSxJQUdBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxZQUFZO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
