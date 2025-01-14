// src/components/Pagination.jsx
import React from 'react';
import ReactPaginate from 'react-paginate';
// import './Pagination.css'; // Custom styles

const PaginationComponent = ({ pageCount, onPageChange }) => (
  <ReactPaginate
    previousLabel={'Previous'}
    nextLabel={'Next'}
    breakLabel={'...'}
    breakClassName={'break-me'}
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={5}
    onPageChange={onPageChange}
    containerClassName={'pagination'}
    activeClassName={'active'}
    aria-label="Pagination Navigation"
  />
);

export default PaginationComponent;
