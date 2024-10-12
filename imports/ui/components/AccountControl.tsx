import React from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { User } from "/imports/api/users/UserProfile";

const customerPortalUrls = {
  development: "https://billing.stripe.com/p/login/test_5kA6rBge36vD448144",
  production: "YOUR_PRODUCTION_CUSTOMER_PORTAL_URL",
};

export const AccountControl: React.FC = () => {
  const navigate = useNavigate();

  const { user, isPremium } = useTracker(() => {
    const user = Meteor.user() as User | null;
    const isPremium = user?.premiumTill
      ? new Date(user.premiumTill) > new Date()
      : false;

    console.log("is premium", isPremium);
    return { user, isPremium };
  });

  const handleSubscribe = () => {
    navigate("/subscription-plans");
  };

  const handleManageSubscription = () => {
    const portalUrl =
      process.env.NODE_ENV === "development"
        ? customerPortalUrls.development
        : customerPortalUrls.production;
    window.open(portalUrl, "_blank");
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "sm",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography level="h4">
          Account Status
        </Typography>
        {isPremium ? (
          <Button
            variant="plain"
            color="neutral"
            onClick={handleManageSubscription}
          >
            Change or cancel plan
          </Button>
        ) : (
          <Button variant="solid" color="primary" onClick={handleSubscribe}>
            Upgrade to Premium
          </Button>
        )}
      </Box>
      {isPremium ? (
        <>
          <Typography mb={1}>
            Your premium account is paid until{" "}
            {new Date(user.premiumTill!).toLocaleDateString()}.
          </Typography>
          <Typography>
            As a premium member, you receive 100 credits each month to use for
            reflections and insights.
          </Typography>
        </>
      ) : (
        <Typography>
          Upgrade to a premium account to receive 100 credits each month for
          deeper reflections and insights.
        </Typography>
      )}
    </Box>
  );
};
