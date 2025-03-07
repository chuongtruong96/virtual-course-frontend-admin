import api from '../utils/api';

/**
 * Service for fetching and processing student performance data
 */
class StudentStatisticsService {
  /**
   * Get comprehensive student performance statistics
   * @returns {Promise<Object>} Student performance data
   */
  async getStudentPerformanceStatistics() {
    try {
      // Fetch overall student statistics
      const { data: overallStats } = await api.get('/statistics/students');
      
      // Fetch top performing students
      const { data: topStudents } = await api.get('/statistics/students/top');
      
      // Combine and format the data
      return {
        totalQuizzes: overallStats.totalQuizzesTaken || 0,
        totalCompletedCourses: overallStats.totalCompletedCourses || 0,
        averageScore: overallStats.averageQuizScore || 0,
        topStudents: this.formatTopStudents(topStudents)
      };
    } catch (error) {
      console.error('Error fetching student performance statistics:', error);
      throw error;
    }
  }

  /**
   * Format top students data to match component requirements
   * @param {Array} students - Raw student data from API
   * @returns {Array} Formatted student data
   */
  formatTopStudents(students = []) {
    return students.map(student => ({
      studentId: student.studentId,
      studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      avatarImage: student.avatar ? `http://localhost:8080/uploads/student/${student.avatar}` : null,
      totalEnrolledCourses: student.totalEnrolledCourses || 0,
      completedCourses: student.completedCourses || 0,
      totalStudyTimeMinutes: student.totalStudyTimeMinutes || 0,
      averageScore: student.averageScore || 0
    }));
  }

  /**
   * Export student performance data to CSV
   */
  async exportStudentPerformanceData() {
    try {
      const response = await api.get('/statistics/students/export', {
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-performance-data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting student performance data:', error);
      throw error;
    }
  }

  /**
   * Refresh student performance data
   */
  async refreshStudentPerformanceData() {
    try {
      await api.post('/statistics/students/refresh');
      return this.getStudentPerformanceStatistics();
    } catch (error) {
      console.error('Error refreshing student performance data:', error);
      throw error;
    }
  }
}

export default new StudentStatisticsService();