import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/joy';
import { aboutPageContent } from '../data/aboutPageContent';

export const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography level="h1" textAlign="center" mb={2}>
          {aboutPageContent.title}
        </Typography>
        <Typography level="h3" textAlign="center" mb={6}>
          {aboutPageContent.subtitle}
        </Typography>

        {aboutPageContent.sections.map((section, index) => (
          <Box key={index} sx={{ mb: 6 }}>
            <Typography level="h2" mb={2}>
              {section.title}
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={6}>
                <Typography>{section.content}</Typography>
                {section.steps && (
                  <Box component="ul" sx={{ pl: 2 }}>
                    {section.steps.map((step, stepIndex) => (
                      <Typography component="li" key={stepIndex}>{step}</Typography>
                    ))}
                  </Box>
                )}
                {section.benefits && (
                  <Box component="ul" sx={{ pl: 2 }}>
                    {section.benefits.map((benefit, benefitIndex) => (
                      <Typography component="li" key={benefitIndex}>{benefit}</Typography>
                    ))}
                  </Box>
                )}
                {section.testimonials && section.testimonials.map((testimonial, testIndex) => (
                  <Box key={testIndex} sx={{ mt: 2 }}>
                    <Typography fontStyle="italic">"{testimonial.quote}"</Typography>
                    <Typography fontWeight="bold">— {testimonial.name}</Typography>
                  </Box>
                ))}
                {section.vision && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Vision:</Typography>
                    <Typography>{section.vision}</Typography>
                  </Box>
                )}
                {section.mission && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="bold">Mission:</Typography>
                    <Typography>{section.mission}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid xs={12} md={6}>
                <Box
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography level="h2" mb={2}>
            {aboutPageContent.cta.title}
          </Typography>
          <Typography mb={4}>
            {aboutPageContent.cta.content}
          </Typography>
          <Box>
            {aboutPageContent.cta.links.map((link, index) => (
              <Button
                key={index}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mx: 1 }}
              >
                {link.text}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography level="h2" textAlign="center" mb={4}>
            Who We Are
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {aboutPageContent.founders.map((founder, index) => (
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
      </Box>
    </Container>
  );
};

export default AboutPage;