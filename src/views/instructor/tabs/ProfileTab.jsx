// src/components/instructor/tabs/ProfileTab.jsx
import React from 'react';
import {
  Grid,
  Card,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import {
  GraduationCap,
  Briefcase,
  Code,
  User
} from 'lucide-react';

const ProfileTab = ({ instructor }) => {
  return (
    <Grid container spacing={3}>
      {/* Education Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <GraduationCap size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Education
            </Typography>
            {/* Education content */}
          </Box>
        </Card>
      </Grid>

      {/* Work Experience Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          {/* Work experience content */}
        </Card>
      </Grid>

      {/* Skills Section */}
      <Grid item xs={12}>
        <Card variant="outlined">
          {/* Skills content */}
        </Card>
      </Grid>

      {/* Bio Section */}
      <Grid item xs={12}>
        <Card variant="outlined">
          {/* Bio content */}
        </Card>
      </Grid>
    </Grid>
  );
};

export default React.memo(ProfileTab);