// src/views/tables/EditInstructor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import instructorService from '../../services/instructorService'; // Sửa lại import

const EditInstructor = () => {
  const { instructorId } = useParams();  // Retrieve instructor ID from URL
  const navigate = useNavigate();
  
  const [instructor, setInstructor] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    phone: '',
    bio: '',
    title: '',
    workplace: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await instructorService.fetchInstructorById(instructorId); // Sử dụng service
        setInstructor(data);
      } catch (error) {
        setError('Error fetching instructor data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instructorService.editInstructor(instructorId, instructor); // Sửa phương thức
      navigate('/instructor/list-instructor');  // Redirect to the table after successful update
    } catch (error) {
      setError('Error updating instructor. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Edit Instructor</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={instructor.firstName}
            onChange={(e) => setInstructor({ ...instructor, firstName: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={instructor.lastName}
            onChange={(e) => setInstructor({ ...instructor, lastName: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="formGender">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            value={instructor.gender}
            onChange={(e) => setInstructor({ ...instructor, gender: e.target.value })}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={instructor.address}
            onChange={(e) => setInstructor({ ...instructor, address: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={instructor.phone}
            onChange={(e) => setInstructor({ ...instructor, phone: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            value={instructor.bio}
            onChange={(e) => setInstructor({ ...instructor, bio: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={instructor.title}
            onChange={(e) => setInstructor({ ...instructor, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formWorkplace">
          <Form.Label>Workplace</Form.Label>
          <Form.Control
            type="text"
            value={instructor.workplace}
            onChange={(e) => setInstructor({ ...instructor, workplace: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default EditInstructor;
