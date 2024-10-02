import React from 'react';
import { Box, Typography, Grid } from '@mui/joy';

interface IntroductionProps {
  title: string;
  content: string;
  image: string;
}

export const Introduction: React.FC<IntroductionProps> = ({ title, content, image }) => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography level="h2" component="h2" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} md={6}>
          <Typography>{content}</Typography>
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