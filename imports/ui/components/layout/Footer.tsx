import React from "react";
import {
  Box,
  Typography,
  Link,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
} from "@mui/joy";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FaDiscord } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.50",
        color: "text.primary",
        py: 6,
        mt: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid xs={12} sm={12} md={12}>
            <Typography level="h4" fontWeight="bold" mb={2}>
              About Us
            </Typography>
            <Typography level="body-lg" mb={2}>
              We are dedicated to helping you reflect on your experiences and
              grow as an individual.
            </Typography>
            <Box>
              <IconButton
                component={Link}
                href="https://www.instagram.com/philo_friend?igsh=MThwZXo2NHFkcnJpMQ=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://x.com/philofriend?s=21&t=lfOUaC1UjsDXZnMKPkIQRQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.facebook.com/share/EWYoETKjGHGJszXe/?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.linkedin.com/company/philofriend/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://discord.gg/UrJqmKR9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord style={{ color: "#636B74", width: 24, height: 24 }} />
              </IconButton>
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={12}>
            <Typography level="body-md" mb={2}>
              We're excited to introduce the initial release of our product. As
              we continue to develop and expand our offerings, we'll be adding
              more features, links, and resources.
            </Typography>
            <Typography level="body-md" fontWeight="bold" mb={1}>
              To stay updated on our progress and connect with our team:
            </Typography>
            <List
              size="md"
              marker="disc"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ListItem>
                Follow us on social media for the latest news and updates
              </ListItem>
              <ListItem>
                Join our community to share your feedback and ideas
              </ListItem>
            </List>
            <Typography level="body-md" mt={2}>
              Your input is invaluable as we grow and improve. Thank you for
              being part of our journey!
            </Typography>

            <Box
              sx={{
                borderTop: 1,
                borderColor: "divider",
                pt: 3,
                mt: 3,
              }}
            >
              <Typography level="body-sm">
                © {new Date().getFullYear()} PhiloFriend. All rights reserved.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
