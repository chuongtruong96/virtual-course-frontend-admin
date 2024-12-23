import React, { useState, useEffect } from 'react';
import { fetchInstructors } from '../../services/instructorService';
import { Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import ExpandedRowDetails from './ExpandedRowDetails';
import AdvancedFilterModal from './AdvancedFilterModal';
import ExportButtons from './ExportButtons';
import './BootstrapTable.css'; // Ensure dark mode styles are included here
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BootstrapTable = () => {
  const [instructorData, setInstructorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ firstName: '', lastName: '', address: '', minAge: '', maxAge: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columnsVisible, setColumnsVisible] = useState({
    firstName: true,
    lastName: true,
    address: true,
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [columnOrder, setColumnOrder] = useState(['firstName', 'lastName', 'address']);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInstructors();
        setInstructorData(data);
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key, type) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sortedData = [...instructorData].sort((a, b) => {
      if (type === 'string') {
        return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      if (type === 'number') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
      return 0;
    });
    setSortConfig({ key, direction });
    setInstructorData(sortedData);
  };

  const handleFilterChange = (event, field) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleToggleColumn = (column) => {
    console.log(`Toggling column: ${column}`);
    setColumnsVisible((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(columnOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setColumnOrder(items);
  };

  const filteredData = instructorData.filter((instructor) => {
    return (
      instructor.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
      instructor.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
      instructor.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (!filters.minAge || instructor.age >= Number(filters.minAge)) &&
      (!filters.maxAge || instructor.age <= Number(filters.maxAge))
    );
  });

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <Row className={darkMode ? 'dark-mode' : ''}>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Instructor Table</Card.Title>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="First Name"
                value={filters.firstName}
                onChange={(e) => handleFilterChange(e, 'firstName')}
              />
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={filters.lastName}
                onChange={(e) => handleFilterChange(e, 'lastName')}
              />
              <Form.Control
                type="text"
                placeholder="Address"
                value={filters.address}
                onChange={(e) => handleFilterChange(e, 'address')}
              />
              <Form.Control
                type="number"
                placeholder="Min Age"
                value={filters.minAge}
                onChange={(e) => handleFilterChange(e, 'minAge')}
              />
              <Form.Control
                type="number"
                placeholder="Max Age"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange(e, 'maxAge')}
              />
              <Form.Check 
                type="switch" 
                id="dark-mode-switch" 
                label="Dark Mode" 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
              />
            </div>
            <ColumnVisibilityToggle
              columnsVisible={columnsVisible}
              toggleColumnVisibility={handleToggleColumn}
            />
            <ExportButtons filteredData={filteredData} />
            <Button onClick={() => setShowFilterModal(true)}>Advanced Filters</Button>
            <AdvancedFilterModal
              show={showFilterModal}
              handleClose={() => setShowFilterModal(false)}
              applyFilters={(newFilters) => {
                setFilters({ ...filters, ...newFilters });
              }}
            />
          </Card.Header>
          <Card.Body>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Table responsive striped bordered hover ref={provided.innerRef} {...provided.droppableProps}>
                    <thead>
                      <tr>
                        <th>#</th>
                        {columnOrder.map((column, index) => (
                          columnsVisible[column] && (
                            <Draggable key={column} draggableId={column} index={index}>
                              {(provided) => (
                                <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => handleSort(column, 'string')}>
                                  {column.charAt(0).toUpperCase() + column.slice(1)}
                                </th>
                              )}
                            </Draggable>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((instructor, index) => (
                        <React.Fragment key={instructor.id}>
                          <tr onClick={() => toggleRowExpansion(instructor.id)} style={{ backgroundColor: selectedRows.includes(instructor.id) ? '#f0f8ff' : '' }}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedRows.includes(instructor.id)}
                                onChange={() => handleRowSelection(instructor.id)}
                              />
                            </td>
                            {columnsVisible.firstName && <td>{instructor.firstName}</td>}
                            {columnsVisible.lastName && <td>{instructor.lastName}</td>}
                            {columnsVisible.address && <td>{instructor.address}</td>}
                          </tr>
                          {expandedRows.includes(instructor.id) && (
                            <tr>
                              <td colSpan={Object.values(columnsVisible).filter(Boolean).length + 1}>
                                <ExpandedRowDetails instructor={instructor} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default BootstrapTable;
