import React, { useEffect } from "react";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import { Box, Button, IconButton, Menu, MenuItem } from "@mui/joy";
import { Logo } from "../common/Logo";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const user = useTracker(() => Meteor.user());

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5em 2em",
        borderBottom: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <Logo />
      </Box>
      {user ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => navigate("/reflect")}
            sx={{ mr: "0.5em" }}
            variant="solid"
          >
            Reflect (5)
          </Button>

          <Box>
            {
              <IconButton
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                variant="outlined"
                color="primary"
                sx={{ borderRadius: "100%" }}
              >
                <img
                  style={{ borderRadius: "100%" }}
                  height={24}
                  width={24}
                  src="/profile.svg"
                />
              </IconButton>
            }
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/");
                  handleClose();
                }}
              >
                My Reflections
              </MenuItem>
              <MenuItem
                onClick={() => {
                  Meteor.logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      ) : (
        <Box>
          <Button
            onClick={() => navigate("/login")}
            variant="outlined"
            sx={{ mr: "0.5em" }}
          >
            Log In
          </Button>
          <Button onClick={() => navigate("/signup")} variant="solid">
            Register
          </Button>
        </Box>
      )}
    </Box>
  );
};
