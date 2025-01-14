// src/views/ticket/ListTicket.jsx
import React, { useEffect, useState } from 'react';
import ticketService from '../../services/ticketService';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const ListTicket = () => {
    const { courseId } = useParams();
    console.log("CourseId:", courseId); // Debug giá trị courseId
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await ticketService.fetchAllTickets();
        setTickets(data);
      } catch (error) {
        setNotification({ type: 'danger', message: 'Failed to load tickets.' });
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const handleResolve = async (ticketId) => {
    try {
      await ticketService.resolveTicket(ticketId);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
      );
      setNotification({ type: 'success', message: 'Ticket resolved' });
    } catch (err) {
      setNotification({ type: 'danger', message: 'Failed to resolve ticket' });
    }
  };

  const handleClose = async (ticketId) => {
    try {
      await ticketService.closeTicket(ticketId);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: 'CLOSED' } : t))
      );
      setNotification({ type: 'success', message: 'Ticket closed' });
    } catch (err) {
      setNotification({ type: 'danger', message: 'Failed to close ticket' });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>List of Support Tickets</h2>
      {notification && <Alert variant={notification.type}>{notification.message}</Alert>}
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>CreatorEmail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.creatorEmail}</td>
                <td>
                  {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                    <Button variant="info" className="me-2" onClick={() => handleResolve(ticket.id)}>
                      Resolve
                    </Button>
                  )}
                  {ticket.status !== 'CLOSED' && (
                    <Button variant="danger" onClick={() => handleClose(ticket.id)}>
                      Close
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No tickets found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ListTicket;
