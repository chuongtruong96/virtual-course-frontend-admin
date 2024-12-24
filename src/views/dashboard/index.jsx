// src/views/dashboard/index.jsx

import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Box, LinearProgress, Tabs, Tab, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const dashSalesData = [
  { title: 'Daily Sales', amount: '$249.95', icon: 'arrow_upward', value: 50, color: 'primary' },
  { title: 'Monthly Sales', amount: '$2,942.32', icon: 'arrow_downward', value: 36, color: 'error' },
  { title: 'Yearly Sales', amount: '$8,638.32', icon: 'arrow_upward', value: 70, color: 'primary' },
];

const userActivityData = [
  { name: 'Silje Larsen', avatar: avatar1, change: 3784, trend: 'up', color: 'success' },
  { name: 'Julie Vad', avatar: avatar2, change: 3544, trend: 'up', color: 'success' },
  { name: 'Storm Hanse', avatar: avatar3, change: 2739, trend: 'down', color: 'error' },
  { name: 'Frida Thomse', avatar: avatar1, change: 1032, trend: 'down', color: 'error' },
  { name: 'Silje Larsen', avatar: avatar2, change: 8750, trend: 'up', color: 'success' },
  { name: 'Storm Hanse', avatar: avatar3, change: 8750, trend: 'down', color: 'error' },
];

const DashDefault = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {dashSalesData.map((data, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {data.title}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: data.color === 'primary' ? 'primary.main' : 'error.main', mr: 2 }}>
                    {data.icon === 'arrow_upward' ? <i className="fa fa-arrow-up" /> : <i className="fa fa-arrow-down" />}
                  </Avatar>
                  <Typography variant="h5" component="div">
                    {data.amount}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={data.value} color={data.color} />
                  <Typography variant="body2" color="text.secondary">
                    {data.value}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Users */}
        <Grid item xs={12} md={6} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              {userActivityData.map((user, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
                  <Box flexGrow={1}>
                    <Typography variant="subtitle1">{user.name}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <i className={`fa fa-caret-${user.trend === 'up' ? 'up' : 'down'}`} style={{ color: user.color === 'success' ? 'green' : 'red' }} />
                    <Typography variant="body2" color={user.color === 'success' ? 'green' : 'red'} sx={{ ml: 1 }}>
                      {user.change}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Button component={Link} to="#" variant="contained" color="primary">
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Widgets */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Event
              </Typography>
              <Typography variant="h4" gutterBottom>
                45 <Typography variant="subtitle2" component="span">Competitors</Typography>
              </Typography>
              <Typography variant="body2" gutterBottom>
                You can participate in event
              </Typography>
              <Avatar sx={{ bgcolor: 'purple.main', width: 56, height: 56 }}>
                <i className="fab fa-angellist" />
              </Avatar>
            </CardContent>
          </Card>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h5">235</Typography>
                  <Typography variant="subtitle2">Total Ideas</Typography>
                </Box>
                <Box>
                  <Typography variant="h5">26</Typography>
                  <Typography variant="subtitle2">Total Locations</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body2">Ideas</Typography>
                  <LinearProgress variant="determinate" value={70} color="primary" />
                </Box>
                <Box>
                  <Typography variant="body2">Locations</Typography>
                  <LinearProgress variant="determinate" value={35} color="secondary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          {/* Social Cards */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <i className="fab fa-facebook-f fa-2x" style={{ color: '#1877F2' }}></i>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5">12,281</Typography>
                  <Typography variant="body2" color="success.main">+7.2% Total Likes</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Target: 35,098</Typography>
                <LinearProgress variant="determinate" value={60} color="primary" />
                <Typography variant="body2" gutterBottom>Duration: 350</Typography>
                <LinearProgress variant="determinate" value={45} color="secondary" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <i className="fab fa-twitter fa-2x" style={{ color: '#1DA1F2' }}></i>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5">11,200</Typography>
                  <Typography variant="body2" color="success.main">+6.2% Total Likes</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Target: 34,185</Typography>
                <LinearProgress variant="determinate" value={40} color="primary" />
                <Typography variant="body2" gutterBottom>Duration: 800</Typography>
                <LinearProgress variant="determinate" value={70} color="primary" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <i className="fab fa-google-plus-g fa-2x" style={{ color: '#DB4437' }}></i>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5">10,500</Typography>
                  <Typography variant="body2" color="success.main">+5.9% Total Likes</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Target: 25,998</Typography>
                <LinearProgress variant="determinate" value={80} color="primary" />
                <Typography variant="body2" gutterBottom>Duration: 900</Typography>
                <LinearProgress variant="determinate" value={50} color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          {/* Rating Card */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h4">4.7 <Typography variant="subtitle1" component="span">★</Typography></Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="success.main">+0.4%</Typography>
                  <i className="fa fa-arrow-up" style={{ color: 'green', marginLeft: '5px' }}></i>
                </Box>
              </Box>
              <Box>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Box key={star} display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ width: '20px' }}>{star}★</Typography>
                    <LinearProgress variant="determinate" value={star === 5 ? 70 : star === 4 ? 35 : star === 3 ? 25 : star === 2 ? 10 : 0} sx={{ flexGrow: 1, mr: 2 }} />
                    <Typography variant="body2">{star === 5 ? 384 : star === 4 ? 145 : star === 3 ? 24 : star === 2 ? 1 : 0}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* User Activity with Tabs */}
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
                <Tab label="Today" />
                <Tab label="This Week" />
                <Tab label="All" />
              </Tabs>
              <Box mt={2}>
                {userActivityData.map((user, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1">{user.name}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <i className={`fa fa-caret-${user.trend === 'up' ? 'up' : 'down'}`} style={{ color: user.color === 'success' ? 'green' : 'red' }} />
                      <Typography variant="body2" color={user.color === 'success' ? 'green' : 'red'} sx={{ ml: 1 }}>
                        {user.change}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Button variant="contained" color="primary" fullWidth>
                  View All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashDefault;
