import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import InstructorService from '../../services/instructorService';

const TableRowDetail = ({ instructorId }) => {
  const [instructor, setInstructor] = React.useState(null);

  React.useEffect(() => {
    const fetchInstructorDetail = async () => {
      const data = await InstructorService.fetchInstructorById(instructorId);
      setInstructor(data);
    };

    fetchInstructorDetail();
  }, [instructorId]);

  if (!instructor) {
    return <Typography>Loading details...</Typography>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Instructor Details</Typography>
        <Typography>Name: {instructor.firstName} {instructor.lastName}</Typography>
        <Typography>Gender: {instructor.gender}</Typography>
        <Typography>Title: {instructor.title}</Typography>
        <Typography>Status: {instructor.status}</Typography>
        <Typography>Bio: {instructor.bio}</Typography>
      </CardContent>
    </Card>
  );
};

export default TableRowDetail;
