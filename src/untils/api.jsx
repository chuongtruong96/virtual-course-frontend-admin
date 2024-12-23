import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:8080/api",
    // timeout: 10000,
    // headers: {
    //     "Content-Type": "application/json",
    // },
    baseURL: 'http://localhost:8080/api',
    // Loại bỏ headers mặc định
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Ví dụ: Gửi token nếu cần authentication
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi request
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Xử lý phản hồi nếu cần
        return response;
    },
    (error) => {
        // Xử lý lỗi response, ví dụ: thông báo lỗi
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
