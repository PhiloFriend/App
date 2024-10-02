import React from 'react';
import { Box, Typography, Button } from '@mui/joy';

interface Link {
  text: string;
  url: string;
}

interface CallToActionProps {
  title: string;
  content: string;
  links: Link[];
}

export const CallToAction: React.FC<CallToActionProps> = ({ title, content, links }) => {
  return (
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Typography level="h2" component="h2" mb={2}>
        {title}
      </Typography>
      <Typography mb={4}>{content}</Typography>
      <Box>
        {links.map((link, index) => (
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
  );
};