import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard Component
 * 
 * A reusable card component for displaying statistics with trend indicators
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the statistic
 * @param {string|number} props.count - The value to display
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.trend - Trend value (e.g. "5.2%")
 * @param {boolean} props.trendUp - Whether the trend is positive (up) or negative (down)
 * @param {string} props.color - Color theme to use (primary, secondary, success, error, warning, info)
 * @param {Function} props.onClick - Click handler for the card
 */
const StatsCard = ({ 
  title, 
  count, 
  icon, 
  trend, 
  trendUp = true, 
  color = 'primary',
  onClick 
}) => {
  const theme = useTheme();
  
  // Determine colors based on the color prop
  const getColors = () => {
    const colorMap = {
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      success: theme.palette.success,
      error: theme.palette.error,
      warning: theme.palette.warning,
      info: theme.palette.info
    };
    
    const selectedColor = colorMap[color] || colorMap.primary;
    
    return {
      bgColor: alpha(selectedColor.main, 0.1),
      iconBg: alpha(selectedColor.main, 0.2),
      iconColor: selectedColor.main,
      borderColor: alpha(selectedColor.main, 0.2)
    };
  };
  
  const colors = getColors();
  
  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: 2,
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: `1px solid ${colors.borderColor}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          cursor: onClick ? 'pointer' : 'default'
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" color="textSecondary" fontWeight="medium">
            {title}
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: colors.iconBg,
              color: colors.iconColor,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h4" component="div" fontWeight="bold" mb={1}>
          {count}
        </Typography>
        
        <Box display="flex" alignItems="center">
          <Chip
            icon={trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            label={trend}
            size="small"
            sx={{
              bgcolor: trendUp ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
              color: trendUp ? theme.palette.success.main : theme.palette.error.main,
              fontWeight: 'medium',
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
            vs previous period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;