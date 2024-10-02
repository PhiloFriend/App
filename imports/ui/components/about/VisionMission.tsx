import React from 'react';
import { Box, Typography, Grid } from '@mui/joy';

interface VisionMissionProps {
  title: string;
  vision: string;
  mission: string;
  image: string;
}

export const VisionMission: React.FC<VisionMissionProps> = ({ title, vision, mission, image }) => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography level="h2" component="h2" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} md={6}>
          <Typography fontWeight="bold" mb={1}>Vision:</Typography>
          <Typography mb={2}>{vision}</Typography>
          <Typography fontWeight="bold" mb={1}>Mission:</Typography>
          <Typography>{mission}</Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};