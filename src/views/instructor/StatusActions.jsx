import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  UserCheck,
  UserX
} from 'lucide-react';

/**
 * StatusActions component provides action buttons based on instructor status
 * 
 * @param {Object} props
 * @param {string} props.status - Current instructor status
 * @param {Function} props.onAction - Callback when an action is selected
 * @returns {JSX.Element}
 */
const StatusActions = ({ status, onAction }) => {
  // Define actions based on current status
  const getActions = () => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return [
          {
            action: 'approve',
            label: 'Approve',
            icon: <CheckCircle size={16} />,
            color: 'success',
            tooltip: 'Approve this instructor'
          },
          {
            action: 'reject',
            label: 'Reject',
            icon: <XCircle size={16} />,
            color: 'error',
            tooltip: 'Reject this instructor'
          }
        ];
      
      case 'ACTIVE':
        return [
          {
            action: 'deactivate',
            label: 'Deactivate',
            icon: <Clock size={16} />,
            color: 'warning',
            tooltip: 'Temporarily deactivate this instructor'
          }
        ];
      
      case 'INACTIVE':
        return [
          {
            action: 'activate',
            label: 'Activate',
            icon: <UserCheck size={16} />,
            color: 'success',
            tooltip: 'Reactivate this instructor'
          }
        ];
      
      case 'REJECTED':
        return [
          {
            action: 'approve',
            label: 'Reconsider',
            icon: <AlertTriangle size={16} />,
            color: 'info',
            tooltip: 'Reconsider this rejected instructor'
          }
        ];
      
      default:
        return [];
    }
  };

  const actions = getActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <ButtonGroup>
      {actions.map((action) => (
        <Tooltip key={action.action} title={action.tooltip}>
          <Button
            variant="contained"
            color={action.color}
            startIcon={action.icon}
            onClick={() => onAction(action.action)}
          >
            {action.label}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};

export default StatusActions;