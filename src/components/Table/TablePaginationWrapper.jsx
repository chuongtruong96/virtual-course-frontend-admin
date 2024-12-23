// src/components/instructor/TablePaginationWrapper.js
import React from 'react';
import { TablePagination } from '@mui/material';

const TablePaginationWrapper = ({ count, rowsPerPage, page, setPage, setRowsPerPage }) => {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(event, newPage) => setPage(newPage)}
      onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
    />
  );
};

export default TablePaginationWrapper;
