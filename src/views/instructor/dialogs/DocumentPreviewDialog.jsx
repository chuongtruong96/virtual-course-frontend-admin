import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  FileText,
  Maximize,
  Minimize
} from 'lucide-react';

/**
 * DocumentPreviewDialog component for previewing document files
 * with zoom, rotate, and download capabilities.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {string} props.url - URL of the document to preview
 * @param {string} props.title - Title of the document
 * @param {string} props.type - MIME type of the document (optional)
 * @param {Function} props.onClose - Callback when dialog is closed
 * @returns {JSX.Element}
 */
const DocumentPreviewDialog = ({ 
  open, 
  url, 
  title, 
  type,
  onClose 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  // Handle document load success
  const handleLoadSuccess = () => {
    setLoading(false);
    setError(false);
  };

  // Handle document load error
  const handleLoadError = () => {
    setLoading(false);
    setError(true);
  };

  // Zoom in document
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.25, 3));
  };

  // Zoom out document
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.25, 0.5));
  };

  // Rotate document
  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setFullScreen(prev => !prev);
  };

  // Determine content type and render appropriate preview
  const renderPreview = () => {
    // If URL is not provided, show message
    if (!url) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <Typography color="textSecondary">
            No document URL provided
          </Typography>
        </Box>
      );
    }

    // If still loading, show spinner
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      );
    }

    // If error occurred, show error message
    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <Typography color="error">
            Failed to load document. The format may not be supported for preview.
          </Typography>
        </Box>
      );
    }

    // Determine file type from URL or provided type
    const fileType = type || url.split('.').pop().toLowerCase();
    
    // Style for transform based on zoom and rotation
    const transformStyle = {
      transform: `scale(${zoom}) rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease',
      transformOrigin: 'center center'
    };

    // Render based on file type
    if (['pdf'].includes(fileType)) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          sx={{ 
            height: fullScreen ? 'calc(100vh - 180px)' : 500,
            overflow: 'auto'
          }}
        >
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height="100%"
            style={transformStyle}
            onLoad={handleLoadSuccess}
            onError={handleLoadError}
          >
            <Typography>
              Your browser doesn't support PDF preview. <a href={url} target="_blank" rel="noopener noreferrer">Download</a> instead.
            </Typography>
          </object>
        </Box>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileType)) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          sx={{ 
            height: fullScreen ? 'calc(100vh - 180px)' : 500,
            overflow: 'auto'
          }}
        >
          <img
            src={url}
            alt={title || "Document preview"}
            style={{
              ...transformStyle,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
            onLoad={handleLoadSuccess}
            onError={handleLoadError}
          />
        </Box>
      );
    } else {
      // For other file types, show iframe or fallback
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          sx={{ 
            height: fullScreen ? 'calc(100vh - 180px)' : 500
          }}
        >
          <iframe
            src={url}
            title={title || "Document preview"}
            width="100%"
            height="100%"
            style={transformStyle}
            onLoad={handleLoadSuccess}
            onError={handleLoadError}
          >
            <Typography>
              Your browser doesn't support this file preview. <a href={url} target="_blank" rel="noopener noreferrer">Download</a> instead.
            </Typography>
          </iframe>
        </Box>
      );
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <FileText size={24} />
            <Typography variant="h6" component="span" ml={1}>
              {title || "Document Preview"}
            </Typography>
          </Box>
          <Box>
            <IconButton 
              color="primary" 
              onClick={toggleFullScreen} 
              aria-label={fullScreen ? "exit fullscreen" : "fullscreen"}
            >
              {fullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </IconButton>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 2 }}>
        <Paper 
          variant="outlined" 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {renderPreview()}
        </Paper>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 1, justifyContent: 'space-between' }}>
        <Box>
          <IconButton onClick={handleZoomOut} disabled={zoom <= 0.5} aria-label="zoom out">
            <ZoomOut size={20} />
          </IconButton>
          <Typography component="span" variant="body2" sx={{ mx: 1 }}>
            {Math.round(zoom * 100)}%
          </Typography>
          <IconButton onClick={handleZoomIn} disabled={zoom >= 3} aria-label="zoom in">
            <ZoomIn size={20} />
          </IconButton>
          <IconButton onClick={handleRotate} aria-label="rotate document">
            <RotateCw size={20} />
          </IconButton>
        </Box>
        <Box>
          <Button 
            startIcon={<Download size={18} />}
            href={url}
            download
            disabled={!url}
            variant="outlined"
          >
            Download
          </Button>
          <Button 
            onClick={onClose} 
            variant="contained" 
            color="primary"
            sx={{ ml: 1 }}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentPreviewDialog;