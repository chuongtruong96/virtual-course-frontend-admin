// src/components/StyledButton.jsx
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const StyledButton = styled(Button)`
  background-color: ${(props) => props.bg || '#007bff'};
  border-color: ${(props) => props.bg || '#007bff'};
  
  &:hover {
    background-color: ${(props) => props.hoverBg || '#0056b3'};
    border-color: ${(props) => props.hoverBg || '#0056b3'};
  }
`;

export default StyledButton;
