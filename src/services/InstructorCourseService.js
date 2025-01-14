// src/services/instructorCourseService.js
import api from '../untils/api';

const createCourseForInstructor = (instructorId, courseData) => {
    return api.post(`/instructors/${instructorId}/courses`, courseData);
};

// Các phương thức khác như cập nhật, xóa, lấy danh sách khóa học của giảng viên...

export default {
    createCourseForInstructor,
    // ...
};
