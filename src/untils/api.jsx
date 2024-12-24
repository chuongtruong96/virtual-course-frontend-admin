// src/utils/api.js
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// Interceptor để thêm Authorization header
api.interceptors.request.use(
    (config) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.jwt) {
            config.headers.Authorization = `Bearer ${storedUser.jwt}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi response
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
