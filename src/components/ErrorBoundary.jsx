// src/components/ErrorBoundary.jsx
import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error){
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo){
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  
  render(){
    if(this.state.hasError){
      return <Alert variant="danger">Something went wrong. Please try again later.</Alert>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
