import React, { useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/joy";

interface SecondaryInfoProps {}

export const SecondaryInfo: React.FC<SecondaryInfoProps> = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrollPosition = window.pageYOffset;
        // Change the sign of the translation to reverse the direction
        backgroundRef.current.style.transform = `translateY(${-scrollPosition * 0.25}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 4,
        overflow: 'hidden',
      }}
    >
      {/* Background image with reversed parallax effect */}
      <Box
        ref={backgroundRef}
        sx={{
          position: 'absolute',
          top: '-50%', // Start the image higher up
          left: 0,
          right: 0,
          bottom: '-50%', // Extend the image below
          backgroundImage: "url('/stoicism.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          zIndex: 0,
          transform: 'translateY(0)', // Initial position
          willChange: 'transform', // Optimize for animations
        }}
      />
      
      {/* White overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
          backdropFilter: 'blur(2px)',
        }}
      />
      
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '600px',
        }}
      >
        <Typography level="h2" sx={{ mb: 2, color: 'text.primary' }}>
          A Moment Each Day to Reflect and Grow
        </Typography>
        <Typography level="body-md" sx={{ mb: 4, color: 'text.secondary' }}>
          In the midst of life's pace, PhiloFriend offers a gentle pause—a space
          to turn inward and listen. With daily reflections guided by the essence
          of philosophical thought, we invite you to explore the landscape of your
          inner world and uncover insights that inspire growth and understanding.
        </Typography>
        <Button size="lg" >Reflect and Grow</Button>
      </Box>
    </Box>
  );
};

export default SecondaryInfo;
