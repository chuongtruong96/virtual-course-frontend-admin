import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Alert, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ENDPOINTS from '../../config/endpoints';
import MainCard from './MainCard';
import { formatCurrency, formatDate } from '../../utils/format';
import { Link } from 'react-router-dom';
import { FaDownload, FaFilter, FaSearch, FaCalendarAlt, FaEye } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const TransactionDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalRevenue: 0,
      totalTransactions: 0,
      pendingWithdrawals: 0,
      failedTransactions: 0
    },
    recentTransactions: [],
    monthlyRevenue: [],
    transactionsByType: [],
    transactionsByStatus: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filterOptions, setFilterOptions] = useState({
    transactionType: 'all',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all transactions for all students
      // Note: This might need to be modified if you need to get transactions for a specific student
      const response = await axios.get(`${API_BASE}/transactions/history/1`); // Using a dummy student ID for admin view
      
      // Transform the data to match the expected dashboard format
      const transactions = response.data || [];
      
      // Calculate summary
      const totalRevenue = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const totalTransactions = transactions.length;
      const pendingWithdrawals = transactions.filter(t => t.status === 'PENDING').length;
      const failedTransactions = transactions.filter(t => t.status === 'FAILED').length;
      
      // Group by month for monthly revenue
      const monthlyRevenueMap = {};
      transactions.forEach(t => {
        const date = new Date(t.paymentDate);
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + parseFloat(t.amount || 0);
      });
      
      const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({ month, amount }));
      
      // Group by type
      const typeMap = {};
      transactions.forEach(t => {
        const type = t.paymentMethod || 'Unknown';
        typeMap[type] = (typeMap[type] || 0) + 1;
      });
      
      const transactionsByType = Object.entries(typeMap).map(([type, count]) => ({ type, count }));
      
      // Group by status
      const statusMap = {};
      transactions.forEach(t => {
        const status = t.status || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      
      const transactionsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));
      
      // Format the data to match the expected structure
      const formattedData = {
        summary: {
          totalRevenue,
          totalTransactions,
          pendingWithdrawals,
          failedTransactions
        },
        recentTransactions: transactions.slice(0, 5), // Get the 5 most recent transactions
        monthlyRevenue,
        transactionsByType,
        transactionsByStatus
      };
      
      setDashboardData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching transaction dashboard data:', err);
      setError('Failed to load transaction dashboard data. Please try again later.');
      
      // Keep the previous data if there was an error
      setDashboardData(prev => prev);
    } finally {
      setLoading(false);
    }
  };
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchDashboardData();
  };

  const resetFilters = () => {
    setDateRange({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    setFilterOptions({
      transactionType: 'all',
      minAmount: '',
      maxAmount: ''
    });
  };

  const exportData = (format) => {
    // Implementation for exporting data in different formats (CSV, PDF, etc.)
    console.log(`Exporting data in ${format} format`);
    // This would typically call an API endpoint or use a library to generate the export
  };

  // Safely access summary data
  const getSummaryValue = (key, defaultValue = 0) => {
    return dashboardData?.summary?.[key] ?? defaultValue;
  };

  // Calculate metrics safely
  const calculateAverageTransactionValue = () => {
    const revenue = getSummaryValue('totalRevenue');
    const transactions = getSummaryValue('totalTransactions');
    return transactions > 0 ? revenue / transactions : 0;
  };

  const calculateSuccessRate = () => {
    const total = getSummaryValue('totalTransactions');
    const failed = getSummaryValue('failedTransactions');
    return total > 0 ? Math.round(((total - failed) / total) * 100) : 0;
  };

  const calculatePendingApprovalRate = () => {
    const pending = getSummaryValue('pendingWithdrawals');
    const total = getSummaryValue('totalTransactions');
    return total > 0 ? Math.round((pending / total) * 100) : 0;
  };

  // Prepare chart data for monthly revenue with null checks
  const monthlyRevenueData = {
    labels: Array.isArray(dashboardData.monthlyRevenue) ? dashboardData.monthlyRevenue.map(item => item?.month || '') : [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: Array.isArray(dashboardData.monthlyRevenue) ? dashboardData.monthlyRevenue.map(item => item?.amount || 0) : [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4
      }
    ]
  };

  // Prepare chart data for transactions by type with null checks
  const transactionsByTypeData = {
    labels: Array.isArray(dashboardData.transactionsByType) ? dashboardData.transactionsByType.map(item => item?.type || '') : [],
    datasets: [
      {
        label: 'Transactions by Type',
        data: Array.isArray(dashboardData.transactionsByType) ? dashboardData.transactionsByType.map(item => item?.count || 0) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare chart data for transactions by status with null checks
  const transactionsByStatusData = {
    labels: Array.isArray(dashboardData.transactionsByStatus) ? dashboardData.transactionsByStatus.map(item => item?.status || '') : [],
    datasets: [
      {
        label: 'Transactions by Status',
        data: Array.isArray(dashboardData.transactionsByStatus) ? dashboardData.transactionsByStatus.map(item => item?.count || 0) : [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const renderStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    // Extract the status string if it's an object
    const statusStr = typeof status === 'object' ? status.name || status.toString() : status;
    
    let variant;
    switch (statusStr.toLowerCase()) {
        case 'completed':
        case 'success':
            variant = 'success';
            break;
        case 'pending':
            variant = 'warning';
            break;
        case 'failed':
            variant = 'danger';
            break;
        case 'refunded':
        case 'cancelled':
            variant = 'info';
            break;
        default:
            variant = 'secondary';
    }
    return <Badge bg={variant}>{statusStr}</Badge>;
};

  if (loading) {
    return (
      <MainCard title="Transaction Dashboard">
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard title="Transaction Dashboard">
        <Alert variant="danger">{error}</Alert>
      </MainCard>
    );
  }

  return (
    <MainCard 
      title="Transaction Dashboard" 
      headerClass="d-flex justify-content-between align-items-center flex-wrap"
      secondary={
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
              <FaDownload className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportData('csv')}>CSV</Dropdown.Item>
              <Dropdown.Item onClick={() => exportData('pdf')}>PDF</Dropdown.Item>
              <Dropdown.Item onClick={() => exportData('excel')}>Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="primary" as={Link} to="/dashboard/finance/transactions">
            View All Transactions
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6} lg={3} className="mb-3">
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6} lg={3} className="mb-3">
              <Form.Group>
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select
                  name="transactionType"
                  value={filterOptions.transactionType}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="refund">Refund</option>
                  <option value="deposit">Deposit</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} lg={3} className="mb-3 d-flex align-items-end">
              <div className="d-flex gap-2 w-100">
                <Button variant="primary" onClick={applyFilters} className="flex-grow-1">
                  <FaFilter className="me-1" /> Apply Filters
                </Button>
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 border-left-primary">
            <Card.Body>
              <h6 className="mb-3 text-muted">Total Revenue</h6>
              <h3 className="text-primary">{formatCurrency(getSummaryValue('totalRevenue'))}</h3>
              <div className="mt-2 text-success">
                +12.5% from last period
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-left-success">
            <Card.Body>
              <h6 className="mb-3 text-muted">Total Transactions</h6>
              <h3 className="text-success">{getSummaryValue('totalTransactions')}</h3>
              <div className="mt-2 text-success">
                +8.3% from last period
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-left-warning">
            <Card.Body>
              <h6 className="mb-3 text-muted">Pending Withdrawals</h6>
              <h3 className="text-warning">{getSummaryValue('pendingWithdrawals')}</h3>
              <div className="mt-2 text-danger">
                +15.2% from last period
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-left-danger">
            <Card.Body>
              <h6 className="mb-3 text-muted">Failed Transactions</h6>
              <h3 className="text-danger">{getSummaryValue('failedTransactions')}</h3>
              <div className="mt-2 text-success">
                -3.7% from last period
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>Monthly Revenue</div>
              <div>
                <Form.Select size="sm" className="d-inline-block w-auto">
                  <option>Last 6 Months</option>
                  <option>Last 12 Months</option>
                  <option>Year to Date</option>
                  <option>Custom Range</option>
                </Form.Select>
                </div>
              </Card.Header>
              <Card.Body>
                {Array.isArray(dashboardData.monthlyRevenue) && dashboardData.monthlyRevenue.length > 0 ? (
                  <div style={{ height: '300px' }}>
                    <Line 
                      data={monthlyRevenueData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `Revenue: ${formatCurrency(context.raw || 0)}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return formatCurrency(value || 0, 'USD', 0);
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">No monthly revenue data available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Header>Transactions by Status</Card.Header>
              <Card.Body>
                {Array.isArray(dashboardData.transactionsByStatus) && dashboardData.transactionsByStatus.length > 0 ? (
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={transactionsByStatusData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + (b || 0), 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">No status data available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Transactions by Type</Card.Header>
              <Card.Body>
                {Array.isArray(dashboardData.transactionsByType) && dashboardData.transactionsByType.length > 0 ? (
                  <div style={{ height: '300px' }}>
                    <Bar 
                      data={transactionsByTypeData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `Count: ${context.raw || 0}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">No transaction type data available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>Recent Transactions</div>
                <Button variant="link" className="p-0" as={Link} to="/dashboard/finance/transactions">
                  View All <FaEye className="ms-1" />
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {Array.isArray(dashboardData.recentTransactions) && dashboardData.recentTransactions.length > 0 ? (
                  <Table responsive hover className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentTransactions.map((transaction) => (
                        <tr key={transaction?.id || Math.random()}>
                          <td>#{transaction?.id || 'N/A'}</td>
                          <td>{formatCurrency(transaction?.amount || 0)}</td>
                          <td>{transaction?.type || 'N/A'}</td>
                          <td>{renderStatusBadge(transaction?.status)}</td>
                          <td>{formatDate(transaction?.createdAt || new Date())}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              as={Link}
                              to={`/dashboard/finance/transactions/${transaction?.id || ''}`}
                              disabled={!transaction?.id}
                            >
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">No recent transactions available</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Insights */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>Transaction Insights</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Average Transaction Value</h6>
                      <h4>{formatCurrency(calculateAverageTransactionValue())}</h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Success Rate</h6>
                      <h4>{calculateSuccessRate()}%</h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Pending Approval Rate</h6>
                      <h4>{calculatePendingApprovalRate()}%</h4>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </MainCard>
    );
};

export default TransactionDashboard;