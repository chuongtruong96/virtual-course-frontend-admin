// src/hooks/Instructor/useInstructors.js
import { useState, useEffect } from 'react';

const useInstructors = () => {
  const [instructorData, setInstructorData] = useState([]);
  const [filters, setFilters] = useState({ firstName: '', lastName: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/instructors'); // Adjust this to your API endpoint
        const data = await response.json();
        setInstructorData(data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (event, field) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: event.target.value,
    }));
  };

  const filteredData = instructorData.filter((instructor) => {
    return (
      instructor.firstName.includes(filters.firstName) &&
      instructor.lastName.includes(filters.lastName)
    );
  });

  return {
    instructorData: filteredData,
    loading,
    error,
    filters,
    currentPage,
    setCurrentPage,
    handleFilterChange,
  };
};

export default useInstructors;
