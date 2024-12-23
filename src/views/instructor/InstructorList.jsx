import React, { useState, useEffect } from 'react';
import { CircularProgress, TablePagination, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import InstructorService from '../../services/instructorService';
import ColumnVisibilityToggle from '../../components/Table/ColumnVisibilityToggle';
import ErrorBoundary from '../Exceptions/ErrorBoundary';
import { TableWrapper, PaginationWrapper, SearchInput } from './styled/TableStyles';
import InstructorCard from './InstructorCard'; // Import InstructorCard
import './styled/TableStyles';
import './styled/Card.css';

const ListInstructor = () => {
  const [instructorData, setInstructorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await InstructorService.fetchInstructors();
        setInstructorData(data);
      } catch (error) {
        console.error('Failed to load instructors:', error);
        alert('Failed to load instructors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const filteredData = instructorData.filter(
    (instructor) =>
      instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const csvContent = instructorData
      .map((instructor) => {
        return `${instructor.firstName || ''},${instructor.lastName || ''},${instructor.gender || ''},${instructor.status || ''},${instructor.phone || ''},${instructor.workplace || ''}`;
      })
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'instructors.csv');
  };

  const handleEdit = (id) => {
    navigate(`/instructor/edit-instructor/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await InstructorService.deleteInstructor(id);
      alert('Instructor deleted');
      const updatedData = await InstructorService.fetchInstructors(); // Re-fetch data
      setInstructorData(updatedData);
    } catch (error) {
      alert('Failed to delete instructor');
    }
  };

  const handleEnable = async (instructorId) => {
    try {
      await InstructorService.enableInstructor(instructorId);
      alert('Instructor enabled');
      const updatedData = await InstructorService.fetchInstructors(); // Re-fetch data
      setInstructorData(updatedData);
    } catch (error) {
      alert('Failed to enable instructor');
    }
  };

  const handleDisable = async (instructorId) => {
    try {
      await InstructorService.disableInstructor(instructorId);
      alert('Instructor disabled');
      const updatedData = await InstructorService.fetchInstructors(); // Re-fetch data
      setInstructorData(updatedData);
    } catch (error) {
      alert('Failed to disable instructor');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <ErrorBoundary>
      <SearchInput
        variant="outlined"
        placeholder="Search Instructors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <IconButton position="start">
              <Search />
            </IconButton>
          )
        }}
      />
      <ColumnVisibilityToggle />
      <TableWrapper>
        <div className="instructor-list">
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEnable={handleEnable}
              onDisable={handleDisable}
            />
          ))}
        </div>
        <PaginationWrapper>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </PaginationWrapper>
      </TableWrapper>
      <button onClick={downloadCSV}>Export CSV</button>
    </ErrorBoundary>
  );
};

export default ListInstructor;
