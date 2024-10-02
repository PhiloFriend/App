import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/joy';

interface Testimonial {
  name: string;
  quote: string;
}

interface TestimonialsProps {
  title: string;
  content: string;
  testimonials: Testimonial[];
  image: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ title, content, testimonials, image }) => {
  return (
    <Box sx={{ my: 6 }}>
      <Typography level="h2" component="h2" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} md={6}>
          <Typography mb={2}>{content}</Typography>
          {testimonials.map((testimonial, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography fontStyle="italic" mb={1}>"{testimonial.quote}"</Typography>
                <Typography fontWeight="bold">— {testimonial.name}</Typography>
              </CardContent>
            </Card>
          ))}
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