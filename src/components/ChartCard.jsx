import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { BarChart, LineChart, PieChart } from 'lucide-react';

/**
 * ChartCard Component
 * 
 * A reusable card component for displaying charts with a consistent style
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the chart
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.children - Chart content
 * @param {string} props.chartType - Type of chart (bar, line, pie)
 * @param {Object} props.sx - Additional styles
 */
const ChartCard = ({ 
  title, 
  subtitle, 
  children, 
  chartType = 'line',
  sx = {} 
}) => {
  const theme = useTheme();
  
  // Get the appropriate icon based on chart type
  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart size={18} />;
      case 'pie':
        return <PieChart size={18} />;
      case 'line':
      default:
        return <LineChart size={18} />;
    }
  };
  
  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: 3,
        height: '100%',
        ...sx
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 1.5
            }}
          >
            {getChartIcon()}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="medium">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ pt: 1 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;