// src/views/course/EditCourse.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import CategoryService from '../../services/categoryService';
import CourseService from '../../services/courseService';
import CourseForm from './CourseForm';
import { NotificationContext } from '../../contexts/NotificationContext';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, cats] = await Promise.all([
          CourseService.fetchCourseById({ id: courseId }),
          CategoryService.fetchAll({ signal: null }),
        ]);
        setCourse(courseData);
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching course or categories:', err);
        setErrorMessage('Failed to load course data.');
        addNotification('Failed to load course data.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, addNotification]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await CourseService.editCourse({ id: courseId, data });
      addNotification('Course updated successfully!', 'success');
      // Chỉnh sửa: Quay về instructor list thay vì course list
      navigate('/dashboard/instructor/list-instructor');
    } catch (err) {
      console.error('Error updating course:', err);
      const msg = err.response?.data?.message || 'Failed to update course.';
      setErrorMessage(msg);
      addNotification(msg, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Quay về instructor list
    navigate('/dashboard/instructor/list-instructor');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading course...</span>
        </Spinner>
      </div>
    );
  }

  if (!course) {
    return <p className="text-danger">Course not found or error loading.</p>;
  }

  return (
    <div className="edit-course-container">
      <h2 className="mb-4">Edit Course #{courseId}</h2>
      <CourseForm
        course={course}             // prop name "course"
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditCourse;
