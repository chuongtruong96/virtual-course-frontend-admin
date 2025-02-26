// src/components/ErrorBoundary.jsx

import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error details to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Something went wrong.</Alert.Heading>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
