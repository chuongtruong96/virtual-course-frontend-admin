// src/hooks/useTickets.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ticketService from '../services/ticketService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useTickets = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all tickets
  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.fetchAllTickets(undefined),
    onError: (err) => {
      console.error('Error fetching tickets:', err);
      addNotification('Không thể tải danh sách ticket.', 'danger');
    },
  });

  // Fetch ticket by ID
  const fetchTicketById = (ticketId) => {
    return useQuery({
      queryKey: ['ticket', ticketId],
      queryFn: () => ticketService.fetchTicketById(ticketId, undefined),
      enabled: !!ticketId,
      onError: (err) => {
        console.error(`Error fetching ticket ${ticketId}:`, err);
        addNotification('Không thể tải thông tin ticket.', 'danger');
      },
    });
  };

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      addNotification('Ticket đã được tạo thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
      addNotification('Không thể tạo ticket. Vui lòng thử lại.', 'danger');
    },
  });

  // Resolve ticket mutation
  const resolveTicketMutation = useMutation({
    mutationFn: ticketService.resolveTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      addNotification('Ticket đã được giải quyết!', 'success');
    },
    onError: (error) => {
      console.error('Failed to resolve ticket:', error);
      addNotification('Không thể giải quyết ticket.', 'danger');
    },
  });

  // Close ticket mutation
  const closeTicketMutation = useMutation({
    mutationFn: ticketService.closeTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      addNotification('Ticket đã được đóng!', 'success');
    },
    onError: (error) => {
      console.error('Failed to close ticket:', error);
      addNotification('Không thể đóng ticket.', 'danger');
    },
  });

  return {
    tickets,
    isLoading,
    isError,
    error,

    fetchTicketById,

    createTicket: createTicketMutation.mutate,
    resolveTicket: resolveTicketMutation.mutate,
    closeTicket: closeTicketMutation.mutate,

    createTicketStatus: createTicketMutation.status,
    resolveTicketStatus: resolveTicketMutation.status,
    closeTicketStatus: closeTicketMutation.status,
  };
};

export default useTickets;
