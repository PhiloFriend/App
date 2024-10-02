import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/joy';

interface Founder {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface FoundersProps {
  founders: Founder[];
}

export const Founders: React.FC<FoundersProps> = ({ founders }) => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography level="h2" component="h2" textAlign="center" mb={4}>
        Who We Are
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {founders.map((founder, index) => (
          <Grid key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box
                  component="img"
                  src={founder.image}
                  alt={founder.name}
                  sx={{ width: '100%', height: 'auto', borderRadius: 2, mb: 2 }}
                />
                <Typography level="h4">{founder.name}</Typography>
                <Typography level="body-sm" mb={1}>{founder.role}</Typography>
                <Typography>{founder.bio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};