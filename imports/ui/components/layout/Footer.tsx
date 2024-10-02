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

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.50",
        color: "text.primary",
        py: 6,
        mt: "auto",
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
              <IconButton aria-label="Facebook" size="sm">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" size="sm">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" size="sm">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" size="sm">
                <LinkedInIcon />
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
          {/*<Grid xs={12} sm={6} md={3}>
            <Typography level="h4" fontWeight="bold" mb={2}>
              Quick Links
            </Typography>
            <Link level="body-sm" href="#" display="block" mb={1}>Home</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>About</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>Services</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>Contact</Link>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Typography level="h4" fontWeight="bold" mb={2}>
              Resources
            </Typography>
            <Link level="body-sm" href="#" display="block" mb={1}>Blog</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>FAQ</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>Support</Link>
            <Link level="body-sm" href="#" display="block" mb={1}>Privacy Policy</Link>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Typography level="h4" fontWeight="bold" mb={2}>
              Newsletter
            </Typography>
            <Typography level="body-sm" mb={2}>
              Subscribe to our newsletter for the latest updates and insights.
            </Typography>
          </Grid>*/}
        </Grid>
      </Container>
    </Box>
  );
};
