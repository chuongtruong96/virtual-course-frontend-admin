import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import CategoryService from '../../services/categoryService';
import CourseService from '../../services/courseService';
import CourseForm from './CourseForm';
import { NotificationContext } from '../../contexts/NotificationContext';

const AddCourse = () => {
  const { accountId } = useParams(); // instructorId
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialData = {
    titleCourse: '',
    description: '',
    categoryId: '',
    level: 'BEGINNER',
    basePrice: '0',
    duration: '1',
    status: 'ACTIVE',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await CategoryService.fetchAll({ signal: null });
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrorMessage('Failed to load categories.');
        addNotification('Failed to load categories.', 'danger');
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, [addNotification]);

  // handleSubmit => addCourseForInstructor
  const handleSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      // data = {titleCourse, description, categoryId, ...}
      await CourseService.addCourseForInstructor({
        instructorId: accountId,
        data,
      });
      addNotification('Course added successfully!', 'success');
      // Quay về instructor list 
      navigate('/dashboard/instructor/list-instructor');
    } catch (err) {
      console.error('Error adding course:', err);
      const msg = err.response?.data?.message || 'Failed to add course.';
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

  if (loadingCats) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading categories...</span>
        </Spinner>
      </div>
    );
  }

  if (errorMessage) {
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  return (
    <div className="add-course-container">
      <h2 className="mb-4">Add Course for Instructor #{accountId}</h2>
      <CourseForm
        course={initialData}    // => pass as prop "course"
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddCourse;
