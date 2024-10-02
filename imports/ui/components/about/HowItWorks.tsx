import React from 'react';
import { Box, Typography, Grid, List, ListItem } from '@mui/joy';

interface HowItWorksProps {
  title: string;
  content: string;
  steps: string[];
  image: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ title, content, steps, image }) => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography level="h2" component="h2" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} md={6}>
          <Typography mb={2}>{content}</Typography>
          <List>
            {steps.map((step, index) => (
              <ListItem key={index}>{step}</ListItem>
            ))}
          </List>
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