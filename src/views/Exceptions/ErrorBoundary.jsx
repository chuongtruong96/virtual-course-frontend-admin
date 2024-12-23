import React, { Component } from 'react';
import { Grid, Alert } from '@mui/material';  // Thêm import cho Alert

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Alert severity="error">Something went wrong. Please try again later.</Alert>  {/* Hiển thị thông báo lỗi */}
        </Grid>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
