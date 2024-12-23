import styled from 'styled-components';
import { TextField, Button, TableCell, TableRow, TableSortLabel } from '@mui/material';

// Styled component for table container
export const TableWrapper = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// Styled table for better readability
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 16px;
  text-align: left;
`;

// Styled table row with hover effect
export const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f4f4f4;
  }
`;

// Styled table cell with padding and border
export const StyledTableCell = styled(TableCell)`
  padding: 12px 15px;
  border: 1px solid #ddd;
`;

// Search Input styled
export const SearchInput = styled(TextField)`
  margin: 20px 0;
  width: 300px;
`;

// Pagination styled wrapper
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

// Button styled for action buttons
export const ActionButton = styled(Button)`
  margin: 5px;
  background-color: ${({ color }) => (color === 'edit' ? '#4caf50' : color === 'disable' ? '#f44336' : '#2196f3')};
  color: white;
  &:hover {
    background-color: ${({ color }) => (color === 'edit' ? '#45a049' : color === 'disable' ? '#d32f2f' : '#1976d2')};
  }
`;

// Table sort label with custom style
export const CustomTableSortLabel = styled(TableSortLabel)`
  font-weight: bold;
  color: #333;
  &:hover {
    color: #1976d2;
  }
`;

// Nếu bạn đang sử dụng export named
export const ExpandButton = () => {
  return (
    <button className="expand-button">
      Expand
    </button>
  );
};