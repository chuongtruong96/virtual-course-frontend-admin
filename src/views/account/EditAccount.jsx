// src/views/account/EditAccount.jsx
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import accountService from '../../services/accountService';
import roleService from '../../services/roleService';
import InstructorService from '../../services/instructorService';
import { NotificationContext } from '../../contexts/NotificationContext';

import AddInstructorModal from '../instructor/AddInstructor';
import DeleteInstructorModal from '../instructor/DeleteInstructorModal';

const EditAccount = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);

  // State điều khiển show/hide modal
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
  const [showDeleteInstructorModal, setShowDeleteInstructorModal] =
    useState(false);

  // Để lưu instructorId cho Delete
  const [instructorIdToDelete, setInstructorIdToDelete] = useState(null);

  // Fetch Account
  const {
    data: account,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
  } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountService.fetchById({ id: accountId }),
    enabled: !!accountId,
    onSuccess: (data) => {
      setValue('username', data.username || '');
      setValue('email', data.email || '');
      setValue('password', '');
      setValue('enable', data.enable ?? true);
      setValue('verifiedEmail', data.verifiedEmail ?? false);
      setValue('authenticationType', data.authenticationType ?? 'LOCAL');
      setValue('type', data.type ?? '');
      setValue('status', data.status ?? 'active');

      if (Array.isArray(data.roles)) {
        const roleNames = data.roles.map((r) =>
          typeof r === 'string' ? r : r.name
        );
        setValue('roles', roleNames);
      } else {
        setValue('roles', []);
      }
    },
    onError: (err) => {
      console.error('Error fetching account data:', err);
      addNotification(
        'Không thể tải dữ liệu tài khoản. Vui lòng thử lại.',
        'danger'
      );
    },
  });

  // Fetch Roles
  const {
    data: roles,
    isLoading: isRolesLoading,
    isError: isRolesError,
    error: rolesError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.fetchAll,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    enabled: !!accountId,
    onError: (err) => {
      console.error('Error fetching roles:', err);
      setError('Không thể tải danh sách vai trò. Vui lòng thử lại.');
      addNotification('Không thể tải danh sách vai trò. Vui lòng thử lại.', 'danger');
    },
  });

  // Edit Account Mutation
  const editMutation = useMutation({
    mutationFn: async (updatedData) => {
      const result = await accountService.edit({
        id: accountId,
        data: updatedData,
      });
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['account', accountId]);
      addNotification('Update account successfully!', 'success');

      // 1) Lấy roles mới
      const newRoles = data.roles.map((r) =>
        typeof r === 'string' ? r : r.name
      );
      // 2) Lấy roles cũ (từ biến tạm "oldRoles" ta lưu lại)
      const oldRoles = variables.__oldRoles; // ta sẽ gắn custom field __oldRoles

      const hadInstructor = oldRoles.includes('INSTRUCTOR');
      const hasInstructor = newRoles.includes('INSTRUCTOR');

      // TH1: cũ không có -> mới có => mở AddInstructor
      if (!hadInstructor && hasInstructor) {
        setShowAddInstructorModal(true);
      }
      // TH2: cũ có -> mới không => mở DeleteInstructor
      else if (hadInstructor && !hasInstructor) {
        // Nếu account.instructor có id
        if (account?.instructor?.id) {
          setInstructorIdToDelete(account.instructor.id);
          setShowDeleteInstructorModal(true);
        }
      }
    },
    onError: (err) => {
      console.error('Error updating account:', err);
      addNotification('Cannot update account. Please try again.', 'danger');
    },
  });

  // Remove Instructor Mutation
  const removeInstructorMutation = useMutation({
    mutationFn: (instructorId) =>
      InstructorService.delete({ id: instructorId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['account', accountId]);
      addNotification('Xóa Instructor thành công!', 'success');
    },
    onError: () => {
      addNotification('Không thể xóa Instructor. Vui lòng thử lại.', 'danger');
    },
  });

  // Form submit
  const onSubmit = (formValues) => {
    setError(null);
    if (!formValues.username || !formValues.email) {
      addNotification('Please fill all required fields.', 'warning');
      return;
    }

    // Lưu roles cũ
    const oldRoles = Array.isArray(account.roles)
      ? account.roles.map((r) => (typeof r === 'string' ? r : r.name))
      : [];

    // Bỏ ROLE_ prefix
    const updatedData = {
      ...formValues,
      roles: (formValues.roles || []).map((role) => role.toUpperCase()),
    };

    // Truyền oldRoles kèm theo variables
    editMutation.mutate({
      ...updatedData,
      __oldRoles: oldRoles, // custom field 
    });
  };

  // handleCloseAddInstructorModal
  const handleInstructorAdded = () => {
    setShowAddInstructorModal(false);
    addNotification('Successfully added Instructor!', 'success');
    // Tái fetch account / instructors
    queryClient.invalidateQueries(['account', accountId]);
    navigate('/dashboard/account/list'); 
  };

  // Xóa instructor => tắt modal + show noti
  const handleInstructorRemoved = () => {
    setShowDeleteInstructorModal(false);
    removeInstructorMutation.mutate(instructorIdToDelete);
  };

  // Cancel
  const handleCancel = () => {
    navigate('/dashboard/account/list');
  };

  if (isAccountLoading || isRolesLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" aria-label="Loading Account">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Đang tải dữ liệu tài khoản...</p>
      </div>
    );
  }
  if (isAccountError) {
    return (
      <Alert variant="danger">
        {accountError?.message || 'Không thể tải dữ liệu tài khoản. Vui lòng thử lại sau.'}
      </Alert>
    );
  }
  if (isRolesError) {
    return (
      <Alert variant="danger">
        {rolesError?.message || 'Không thể tải danh sách vai trò. Vui lòng thử lại sau.'}
      </Alert>
    );
  }

  return (
    <>
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <Card.Title>Edit Account</Card.Title>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit(onSubmit)} aria-label="Edit Account Form">
                {/* Username */}
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>
                    Username <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    {...register('username', { required: true })}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    Username is required.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>
                    Email <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register('email', { required: true })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    Email is required.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>New Password (leave blank if not changing)</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                </Form.Group>

                {/* Roles */}
                <Form.Group controlId="formRoles" className="mb-3">
                  <Form.Label>Roles</Form.Label>
                  <Form.Control as="select" multiple {...register('roles')}>
                    {roles?.map((role) => (
                      <option key={role.id} value={role.name.toUpperCase()}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Giữ Ctrl (Windows) hoặc Command (Mac) để chọn nhiều vai trò.
                  </Form.Text>
                </Form.Group>

                {/* Status */}
                <Form.Group controlId="formStatus" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" {...register('status', { required: true })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Control>
                </Form.Group>

                {/* Enable */}
                <Form.Group controlId="formEnable" className="mb-3">
                  <Form.Check type="checkbox" label="Enable Account" {...register('enable')} />
                </Form.Group>

                {/* Verified Email */}
                <Form.Group controlId="formVerifiedEmail" className="mb-3">
                  <Form.Check type="checkbox" label="Verified Email" {...register('verifiedEmail')} />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={editMutation.isLoading}
                    aria-label="Cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={editMutation.isLoading}
                    aria-label="Save Changes"
                  >
                    {editMutation.isLoading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL ADD INSTRUCTOR */}
      <AddInstructorModal
        show={showAddInstructorModal}
        handleClose={() => setShowAddInstructorModal(false)}
        addInstructorToList={handleInstructorAdded}
        accountId={accountId}
      />

      {/* MODAL DELETE INSTRUCTOR */}
      <DeleteInstructorModal
        show={showDeleteInstructorModal}
        handleClose={() => setShowDeleteInstructorModal(false)}
        instructorId={instructorIdToDelete}
        onDeleteSuccess={handleInstructorRemoved}
      />
    </>
  );
};

export default EditAccount;
