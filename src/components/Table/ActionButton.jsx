import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaBan } from 'react-icons/fa';
import '../../styles/ActionButton.css';

const ActionButton = ({ type, onClick }) => {
  const renderIcon = () => {
    switch (type) {
      case 'edit':
        return <FaEdit size={20} />;
      case 'delete':
        return <FaTrash size={20} />;
      case 'enable':
        return <FaCheckCircle size={20} />;
      case 'disable':
        return <FaBan size={20} />;
      default:
        return null;
    }
  };

  const renderText = () => {
    switch (type) {
      case 'edit':
        return 'Edit';
      case 'delete':
        return 'Delete';
      case 'enable':
        return 'Enable';
      case 'disable':
        return 'Disable';
      default:
        return '';
    }
  };

  return (
    <button
      className={`action-btn ${type}`}
      onClick={onClick}
    >
      {renderIcon()} {renderText()}
    </button>
  );
};

export default ActionButton;
