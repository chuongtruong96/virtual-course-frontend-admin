import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructorDocuments = (instructorId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [filters, setFilters] = useState({
    type: '',
    page: 0,
    size: 10,
    sort: 'uploadDate',
    direction: 'desc'
  });

  // Fetch documents
  const {
    data: documentsData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['instructor-documents', instructorId, filters],
    () => InstructorService.getDocuments(instructorId, filters),
    {
      enabled: !!instructorId,
      onError: (error) => {
        addNotification('Failed to load documents', 'error');
        console.error('Error fetching documents:', error);
      }
    }
  );

  // Upload document mutation
  const uploadDocument = useMutation(
    ({ file, type, description }) => 
      InstructorService.uploadDocument(instructorId, file, type, description),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['instructor-documents', instructorId]);
        addNotification('Document uploaded successfully', 'success');
      },
      onError: (error) => {
        addNotification('Failed to upload document', 'error');
        console.error('Error uploading document:', error);
      }
    }
  );

  // Delete document mutation
  const deleteDocument = useMutation(
    (documentId) => InstructorService.deleteDocument(documentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['instructor-documents', instructorId]);
        addNotification('Document deleted successfully', 'success');
      },
      onError: (error) => {
        addNotification('Failed to delete document', 'error');
        console.error('Error deleting document:', error);
      }
    }
  );

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    documents: documentsData?.content || [],
    totalElements: documentsData?.totalElements || 0,
    isLoading,
    error,
    filters,
    updateFilters,
    uploadDocument: uploadDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    refetchDocuments: refetch
  };
};
