import React, { useState } from "react";
import { Box, Typography, Switch, Button, styled, Grid } from "@mui/joy";

const Card = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: theme.radius.md,
  display: "flex",
  flexDirection: "column",
  height: "100%", // Changed to 100% for better responsiveness
  width: "100%", // Changed to 100% for better responsiveness
  position: "relative",
  overflow: "hidden",
}));

const plans = [
  {
    title: "Premium",
    image: "/premium.webp",
    credits: 60,
    monthlyPrice: 14.99,
    yearlyPrice: 139.99,
    features: [
      "Access to premium reflections",
      "Priority support",
      "Exclusive content",
    ],
    ctaText: "Choose Premium",
    popular: true,
  },
  {
    title: "Premium Plus",
    image: "/premium-plus.webp",
    credits: 150,
    monthlyPrice: 24.99,
    yearlyPrice: 199.99,
    features: [
      "All Premium features",
      "Higher priority support",
      "Early access to new features",
      "Personalized content",
    ],
    ctaText: "Choose Premium Plus",
    bestValue: true,
  },
];

const SubscriptionPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: 3,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          level="h1"
          sx={{ mb: 1, position: "relative", display: "inline-block" }}
        >
          Choose Your Magical Journey
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: -10,
              height: 8,
              width: 8,
              bgcolor: "warning.300",
              borderRadius: "50%",
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
              "@keyframes ping": {
                "75%, 100%": {
                  transform: "scale(2)",
                  opacity: 0,
                },
              },
            }}
          />
        </Typography>
        <Typography level="body-lg" sx={{ color: "text.secondary" }}>
          Unlock deeper insights with our premium plans.
        </Typography>
      </Box>

      {/* Add back the yearly-monthly switch */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}>
        <Typography
          sx={{ mr: 1, color: isYearly ? "text.secondary" : "primary.main", fontWeight: isYearly ? "normal" : "bold" }}
        >
          Monthly
        </Typography>
        <Switch checked={isYearly} onChange={(event) => setIsYearly(event.target.checked)} />
        <Typography
          sx={{ ml: 1, color: isYearly ? "primary.main" : "text.secondary", fontWeight: isYearly ? "bold" : "normal" }}
        >
          Yearly
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid key={plan.title} xs={12} sm={6} md={6} lg={4}>
            <Card>
              {plan.popular && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "background.body",
                    color: "text.primary",
                    fontSize: "xs",
                    fontWeight: "bold",
                    px: 1,
                    py: 0.5,
                    borderRadius: "md",
                    zIndex: 1,
                  }}
                >
                  Most Popular
                </Box>
              )}
              {plan.bestValue && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "warning.300",
                    color: "warning.800",
                    fontSize: "xs",
                    fontWeight: "bold",
                    px: 1,
                    py: 0.5,
                    borderRadius: "md",
                    zIndex: 1,
                  }}
                >
                  Best Value
                </Box>
              )}
              <Box sx={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                <img
                  src={plan.image}
                  alt={plan.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </Box>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Typography level="h2" sx={{ textAlign: "center", mb: 2 }}>
                  {plan.title}
                </Typography>
                <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Typography level="body-lg" fontWeight="bold" sx={{ mb: 2 }}>
                    {plan.credits} Credits per Month
                  </Typography>
                  <Typography level="h3" sx={{ mb: 1 }}>
                    $
                    {isYearly
                      ? plan.yearlyPrice.toFixed(2)
                      : plan.monthlyPrice.toFixed(2)}
                    <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                      {isYearly ? "/year" : "/month"}
                    </Typography>
                  </Typography>
                  {isYearly && (
                    <Typography
                      level="body-sm"
                      sx={{ color: "success.main", mb: 2 }}
                    >
                      Save{" "}
                      {(
                        (1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) *
                        100
                      ).toFixed(0)}
                      % annually!
                    </Typography>
                  )}
                  <Box component="ul" sx={{ textAlign: "left", mt: 3, pl: 0 }}>
                    {plan.features.map((feature, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Box
                          component="span"
                          sx={{ mr: 1, color: "success.main", fontSize: "1.2em" }}
                        >
                          ✓
                        </Box>
                        <Typography>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant={plan.bestValue ? "solid" : "outlined"}
                  color={plan.bestValue ? "primary" : "neutral"}
                  sx={{ mt: "auto", py: 1.5 }}
                >
                  {plan.ctaText}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
          30-day money-back guarantee. Cancel anytime.
        </Typography>
        <Typography
          level="body-sm"
          component="a"
          href="#"
          sx={{
            color: "text.secondary",
            textDecoration: "underline",
            "&:hover": { color: "primary.main" },
          }}
        >
          View full terms and conditions
        </Typography>
      </Box>
    </Box>
  );
};

export default SubscriptionPlans;
