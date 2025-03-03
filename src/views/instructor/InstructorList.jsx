// src/components/instructor/InstructorList.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Menu,
  Pagination,
  FormControlLabel,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Collapse,
  Avatar
} from '@mui/material';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  List as ListIcon,
  Grid as GridIcon,
  Mail,
  Phone,
  Calendar,
  User,
  Settings
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { useInstructors } from '../../hooks/useInstructors';
import { useInstructorMetrics } from '../../hooks/useInstructorMetrics';
import InstructorCard from './InstructorCard';
import { format } from 'date-fns';
import { UPLOAD_PATH, DEFAULT_IMAGES } from '../../config/endpoints';

// Custom Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Alert 
    severity="error" 
    action={
      <Button onClick={resetErrorBoundary}>Try again</Button>
    }
  >
    <AlertTriangle size={20} style={{ marginRight: 8 }} />
    {error.message}
  </Alert>
);

// TabPanel Component
const TabPanel = React.memo(({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`instructor-tabpanel-${index}`}
    aria-labelledby={`instructor-tab-${index}`}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
));

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'PENDING': return 'warning';
    case 'INACTIVE': return 'default';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

// Main Component
const InstructorList = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    verified: false,
    hasCourses: false,
    dateRange: null,
    page: 1,
    rowsPerPage: 10,
    orderBy: 'createdAt',
    order: 'desc'
  });
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [expandedInstructor, setExpandedInstructor] = useState(null);

  // Status mapping for tabs
  const statusMap = {
    0: 'all',
    1: 'PENDING',
    2: 'ACTIVE',
    3: 'INACTIVE',
    4: 'REJECTED'
  };

  // Fetch instructors with status filter
  const {
    instructors,
    isLoading,
    isError,
    error,
    approveInstructor,
    rejectInstructor,
    refetch
  } = useInstructors(statusMap[tabValue]);

  // Helper function to get sortable value
  const getSortableValue = (instructor, field) => {
    switch (field) {
      case 'name':
        return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim().toLowerCase();
      case 'email':
        return (instructor.email || instructor.accountEmail || '').toLowerCase();
      case 'status':
        return instructor.status || '';
      case 'courseCount':
        return instructor.courseCount || 0;
      case 'createdAt':
        return instructor.createdAt ? new Date(instructor.createdAt).getTime() : 0;
      default:
        return instructor[field] || '';
    }
  };

  // Filter and sort instructors
  const filteredAndSortedInstructors = useMemo(() => {
    if (!Array.isArray(instructors)) return [];

    // First filter the instructors
    const filtered = instructors.filter(instructor => {
      // Text search
      const searchMatch = 
        (instructor.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (instructor.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (instructor.email || instructor.accountEmail || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = filters.status === 'all' || instructor.status === filters.status;

      // Verification filter
      const verifiedMatch = !filters.verified || instructor.verifiedPhone;

      // Course filter
      const coursesMatch = !filters.hasCourses || (instructor.courseCount > 0);

      return searchMatch && statusMatch && verifiedMatch && coursesMatch;
    });

    // Then sort the filtered instructors
    return [...filtered].sort((a, b) => {
      const aValue = getSortableValue(a, filters.orderBy);
      const bValue = getSortableValue(b, filters.orderBy);
      
      // For string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.order === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For numeric values
      return filters.order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [instructors, searchTerm, filters]);

  // Pagination
  const paginatedInstructors = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.rowsPerPage;
    return filteredAndSortedInstructors.slice(
      startIndex,
      startIndex + filters.rowsPerPage
    );
  }, [filteredAndSortedInstructors, filters.page, filters.rowsPerPage]);

  // Event Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFilters(prev => ({ ...prev, status: 'all', page: 1 }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleSortRequest = (property) => {
    const isAsc = filters.orderBy === property && filters.order === 'asc';
    setFilters(prev => ({
      ...prev,
      orderBy: property,
      order: isAsc ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      verified: false,
      hasCourses: false,
      dateRange: null,
      page: 1,
      rowsPerPage: 10,
      orderBy: 'createdAt',
      order: 'desc'
    });
    setSearchTerm('');
  };

  const toggleExpandRow = (instructorId) => {
    setExpandedInstructor(expandedInstructor === instructorId ? null : instructorId);
  };

  // Loading State
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        }
      >
        <AlertTriangle size={20} style={{ marginRight: 8 }} />
        {error?.message || 'Failed to load instructors'}
      </Alert>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        handleResetFilters();
        refetch();
      }}
    >
      <Card>
        <Box p={3}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Instructor Management
            </Typography>
            
            {/* Search and Filters */}
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Search instructors..."
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<Filter size={20} />}
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                size="small"
              >
                Filters
              </Button>

              <Box display="flex" border={1} borderColor="divider" borderRadius={1}>
                <Tooltip title="Grid View">
                  <IconButton
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  >
                    <GridIcon size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="List View">
                  <IconButton
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                  >
                    <ListIcon size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Instructors" />
              <Tab label="Pending" />
              <Tab label="Active" />
              <Tab label="Inactive" />
              <Tab label="Rejected" />
            </Tabs>
          </Box>

          {/* Content */}
          {paginatedInstructors.length === 0 ? (
            <Alert severity="info">
              No instructors found matching your criteria
            </Alert>
          ) : (
            viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {paginatedInstructors.map((instructor) => (
                  <Grid item xs={12} md={6} key={instructor.id}>
                    <InstructorCard
                      instructor={instructor}
                      onApprove={() => approveInstructor(instructor.id)}
                      onReject={() => rejectInstructor(instructor.id)}
                      onViewDetail={() => navigate(`/dashboard/instructor/detail/${instructor.id}`)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell>
                        <TableSortLabel
                          active={filters.orderBy === 'name'}
                          direction={filters.orderBy === 'name' ? filters.order : 'asc'}
                          onClick={() => handleSortRequest('name')}
                        >
                          Instructor
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={filters.orderBy === 'email'}
                          direction={filters.orderBy === 'email' ? filters.order : 'asc'}
                          onClick={() => handleSortRequest('email')}
                        >
                          Contact
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={filters.orderBy === 'courseCount'}
                          direction={filters.orderBy === 'courseCount' ? filters.order : 'asc'}
                          onClick={() => handleSortRequest('courseCount')}
                        >
                          Courses
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={filters.orderBy === 'status'}
                          direction={filters.orderBy === 'status' ? filters.order : 'asc'}
                          onClick={() => handleSortRequest('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={filters.orderBy === 'createdAt'}
                          direction={filters.orderBy === 'createdAt' ? filters.order : 'asc'}
                          onClick={() => handleSortRequest('createdAt')}
                        >
                          Joined
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedInstructors.map((instructor) => {
                      // Determine image URL with fallback
                      const imageUrl = instructor.photo
                        ? instructor.photo.startsWith('http')
                          ? instructor.photo
                          : `${UPLOAD_PATH.INSTRUCTOR}/${instructor.photo}`
                        : DEFAULT_IMAGES.INSTRUCTOR;
                        
                      return (
                        <React.Fragment key={instructor.id}>
                          <TableRow hover>
                            <TableCell padding="checkbox">
                              <IconButton
                                size="small"
                                onClick={() => toggleExpandRow(instructor.id)}
                              >
                                {expandedInstructor === instructor.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
  <Box display="flex" alignItems="center">
    <Avatar 
      src={imageUrl} 
      alt={`${instructor.firstName} ${instructor.lastName}`}
      sx={{ width: 40, height: 40, mr: 2 }}
    >
      {instructor.firstName?.[0]}
    </Avatar>
    <Box>
      <Typography variant="body2" fontWeight="medium">
        {instructor.firstName} {instructor.lastName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {instructor.title || 'Instructor'}
      </Typography>
    </Box>
  </Box>
</TableCell>
<TableCell>
  <Box display="flex" flexDirection="column">
    <Box display="flex" alignItems="center">
      <Mail size={14} style={{ marginRight: 8, opacity: 0.7 }} />
      <Typography variant="body2">
        {instructor.email || instructor.accountEmail}
      </Typography>
    </Box>
    {instructor.phone && (
      <Box display="flex" alignItems="center" mt={0.5}>
        <Phone size={14} style={{ marginRight: 8, opacity: 0.7 }} />
        <Typography variant="body2">
          {instructor.phone}
        </Typography>
      </Box>
    )}
  </Box>
</TableCell>
<TableCell>
  <Typography variant="body2">
    {instructor.courseCount || 0}
  </Typography>
</TableCell>
<TableCell>
  <Chip 
    label={instructor.status} 
    size="small"
    color={getStatusColor(instructor.status)}
  />
</TableCell>
<TableCell>
  <Typography variant="body2">
    {instructor.createdAt 
      ? format(new Date(instructor.createdAt), 'MMM dd, yyyy')
      : 'N/A'
    }
  </Typography>
</TableCell>
<TableCell align="right">
  <Box display="flex" justifyContent="flex-end">
    <Tooltip title="View Details">
      <IconButton
        size="small"
        onClick={() => navigate(`/dashboard/instructor/detail/${instructor.id}`)}
      >
        <Eye size={18} />
      </IconButton>
    </Tooltip>
    
    {instructor.status === 'PENDING' && (
      <>
        <Tooltip title="Approve">
          <IconButton
            size="small"
            color="success"
            onClick={() => approveInstructor(instructor.id)}
          >
            <CheckCircle size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject">
          <IconButton
            size="small"
            color="error"
            onClick={() => rejectInstructor(instructor.id)}
          >
            <XCircle size={18} />
          </IconButton>
        </Tooltip>
      </>
    )}
    
    <Tooltip title="More Actions">
      <IconButton size="small">
        <MoreVertical size={18} />
      </IconButton>
    </Tooltip>
  </Box>
</TableCell>
</TableRow>
<TableRow>
  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
    <Collapse in={expandedInstructor === instructor.id} timeout="auto" unmountOnExit>
      <Box sx={{ py: 2, px: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Instructor Details
            </Typography>
            {instructor.bio && (
              <Typography variant="body2" paragraph>
                {instructor.bio}
              </Typography>
            )}
            {instructor.address && (
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight="medium" mr={1}>
                  Address:
                </Typography>
                <Typography variant="body2">
                  {instructor.address}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" fontWeight="medium" mr={1}>
                Verified:
              </Typography>
              <Typography variant="body2">
                {instructor.verifiedPhone ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Course Statistics
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Courses:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {instructor.courseCount || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Active Courses:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {instructor.activeCourseCount || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Students:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {instructor.studentCount || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Average Rating:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {instructor.averageRating?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={() => navigate(`/dashboard/instructor/detail/${instructor.id}`)}
          >
            View Full Profile
          </Button>
        </Box>
      </Box>
    </Collapse>
  </TableCell>
</TableRow>
</React.Fragment>
);
})}
</TableBody>
</Table>
</TableContainer>
)
)}

{/* Pagination */}
<Box display="flex" justifyContent="center" mt={3}>
<Pagination
  count={Math.ceil(filteredAndSortedInstructors.length / filters.rowsPerPage)}
  page={filters.page}
  onChange={handlePageChange}
  color="primary"
/>
</Box>
</Box>

{/* Filter Menu */}
<Menu
  anchorEl={filterMenuAnchor}
  open={Boolean(filterMenuAnchor)}
  onClose={() => setFilterMenuAnchor(null)}
  PaperProps={{ sx: { width: 250, p: 1 } }}
>
  <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
    Advanced Filters
  </Typography>
  <Divider sx={{ mb: 1 }} />
  
  <FormControlLabel
    control={
      <Checkbox
        checked={filters.verified}
        onChange={(e) => handleFilterChange('verified', e.target.checked)}
      />
    }
    label="Verified instructors only"
    sx={{ px: 1, display: 'block' }}
  />
  
  <FormControlLabel
    control={
      <Checkbox
        checked={filters.hasCourses}
        onChange={(e) => handleFilterChange('hasCourses', e.target.checked)}
      />
    }
    label="Has published courses"
    sx={{ px: 1, display: 'block' }}
  />

  <Box display="flex" justifyContent="flex-end" mt={2} px={1}>
    <Button
      size="small"
      onClick={handleResetFilters}
    >
      Reset
    </Button>
    <Button
      size="small"
      variant="contained"
      onClick={() => setFilterMenuAnchor(null)}
      sx={{ ml: 1 }}
    >
      Apply
    </Button>
  </Box>
</Menu>
</Card>
</ErrorBoundary>
);
};

export default InstructorList;