import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  Eye, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

/**
 * DocumentsTab component displays a list of documents associated with an instructor
 * with filtering, pagination, and preview capabilities.
 * 
 * @param {Object} props
 * @param {Array} props.documents - Array of document objects
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Function} props.onPreview - Callback function when Preview button is clicked
 * @returns {JSX.Element}
 */
const DocumentsTab = ({ documents = [], isLoading = false, onPreview }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page of documents
  const currentDocuments = filteredDocuments
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Status chip color mapping
  const statusColors = {
    verified: 'success',
    pending: 'warning',
    rejected: 'error',
    expired: 'default'
  };

  // Status icon mapping
  const statusIcons = {
    verified: <CheckCircle size={16} />,
    pending: <AlertTriangle size={16} />,
    rejected: <XCircle size={16} />,
    expired: <Calendar size={16} />
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            <FileText size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Instructor Documents
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {documents.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography color="textSecondary">
              No documents found for this instructor.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.documentId}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {doc.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={statusIcons[doc.status.toLowerCase()]}
                          label={doc.status} 
                          size="small"
                          color={statusColors[doc.status.toLowerCase()] || 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Tooltip title="Preview Document">
                            <IconButton 
                              size="small" 
                              onClick={() => onPreview(doc)}
                              color="primary"
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Document">
                            <IconButton 
                              size="small"
                              href={doc.fileUrl}
                              download
                              color="primary"
                            >
                              <Download size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDocuments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;