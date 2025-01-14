import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Row, Col, Spinner, Alert, Form, Button, Image, Card } from 'react-bootstrap';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import { UPLOAD_BASE } from '../../config/endpoint';

import InstructorService from '../../services/instructorService';
import FileService from '../../services/fileService';
import { NotificationContext } from '../../contexts/NotificationContext';
import useInstructors from '../../hooks/useInstructors';

const EditInstructorForm = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const { editInstructor, editInstructorStatus } = useInstructors();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Photo state
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    // fetch instructor detail
    const fetchData = async () => {
      try {
        const instructor = await InstructorService.fetchById({ id: instructorId, signal: null });
        // setValue into form
        setValue('firstName', instructor.firstName);
        setValue('lastName', instructor.lastName);
        setValue('gender', instructor.gender);
        setValue('address', instructor.address);
        setValue('phone', instructor.phone);
        setValue('bio', instructor.bio);
        setValue('title', instructor.title);
        setValue('workplace', instructor.workplace);
        setValue('status', instructor.status);
        setValue('accountId', instructor.accountId);

        if (instructor.photo) {
          setUploadedFileName(instructor.photo);
          setImagePreview(`${UPLOAD_BASE}/instructor/${instructor.photo}`);
        }
      } catch (err) {
        console.error('Error fetching instructor:', err);
        setFetchError('Không thể tải dữ liệu Instructor.');
        addNotification('Không thể tải dữ liệu Instructor. Vui lòng thử lại.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId, setValue, addNotification]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
      setUploadedFileName(''); // reset
    }
  };

  const handleUpload = async () => {
    if (!file) {
      addNotification('Vui lòng chọn ảnh để tải lên.', 'warning');
      return;
    }
    try {
      const filename = await FileService.uploadPhoto({ file, entity: 'instructor' });
      setUploadedFileName(filename);
      setValue('photo', filename);
      setImagePreview(`${UPLOAD_BASE}/instructor/${filename}`);
      addNotification('Ảnh đã được tải lên thành công!', 'success');
    } catch (err) {
      console.error('Error uploading photo:', err);
      addNotification('Không thể tải lên ảnh. Vui lòng thử lại.', 'danger');
    }
  };

  const onSubmit = (formData) => {
    // convert
    const updatedData = {
      ...formData,
      photo: uploadedFileName,
    };
    // edit
    editInstructor(
      { id: instructorId, data: updatedData },
      {
        onSuccess: () => {
          // Done => back to list instructor
          addNotification('Đã cập nhật Instructor!', 'success');
          navigate('/dashboard/instructor/list-instructor');
        },
        onError: (err) => {
          console.error('Failed to update instructor:', err);
          addNotification('Không thể cập nhật Instructor. Vui lòng thử lại.', 'danger');
        }
      }
    );
  };

  const handleCancel = () => {
    navigate('/dashboard/instructor/list-instructor');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Instructor...</span>
        </Spinner>
      </div>
    );
  }

  if (fetchError) {
    return <Alert variant="danger">{fetchError}</Alert>;
  }

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <Card.Header>
            <Card.Title>Edit Instructor</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* firstName */}
              <Form.Group controlId="formFirstName" className="mb-3">
                <Form.Label>First Name <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên"
                  {...register('firstName', { required: true })}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  Tên là bắt buộc
                </Form.Control.Feedback>
              </Form.Group>

              {/* lastName */}
              <Form.Group controlId="formLastName" className="mb-3">
                <Form.Label>Last Name <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ"
                  {...register('lastName', { required: true })}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  Họ là bắt buộc
                </Form.Control.Feedback>
              </Form.Group>

              {/* gender */}
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  as="select"
                  {...register('gender', { required: true })}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Gender is required.
                </Form.Control.Feedback>
              </Form.Group>

              {/* status */}
              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Trạng Thái <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  as="select"
                  {...register('status', { required: true })}
                  isInvalid={!!errors.status}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </Form.Control>
              </Form.Group>

              {/* address */}
              <Form.Group controlId="formAddress" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Nhập địa chỉ" {...register('address')} />
              </Form.Group>

              {/* phone */}
              <Form.Group controlId="formPhone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" placeholder="Nhập số điện thoại" {...register('phone')} />
              </Form.Group>

              {/* bio */}
              <Form.Group controlId="formBio" className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('bio')} />
              </Form.Group>

              {/* title */}
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Position, e.g. 'Senior Dev'" {...register('title')} />
              </Form.Group>

              {/* workplace */}
              <Form.Group controlId="formWorkplace" className="mb-3">
                <Form.Label>Workplace</Form.Label>
                <Form.Control type="text" placeholder="Company or Institution" {...register('workplace')} />
              </Form.Group>

              {/* accountId (readOnly) */}
              <Form.Group controlId="formAccountId" className="mb-3">
                <Form.Label>Account ID</Form.Label>
                <Form.Control
                  type="number"
                  readOnly
                  disabled
                  {...register('accountId')}
                />
              </Form.Group>

              {/* Photo */}
              <Form.Group controlId="formPhoto" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  <Button variant="outline-secondary" className="ms-2" onClick={handleUpload}>
                    Upload
                  </Button>
                </div>
                {imagePreview && (
                  <Image src={imagePreview} alt="Preview" className="mt-3" width="120" height="120" rounded />
                )}
              </Form.Group>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={handleCancel} disabled={editInstructorStatus === 'loading'}>
                  <FaTimesCircle /> Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={editInstructorStatus === 'loading'}>
                  {editInstructorStatus === 'loading' ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EditInstructorForm;
