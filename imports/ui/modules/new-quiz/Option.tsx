// Option.tsx
import React, { useState } from "react";
import { Option as OptionType } from "./types";
// Import Joy UI component
import { Box, Typography, Skeleton } from "@mui/joy";

interface OptionProps {
  option: OptionType;
  onClick: (option: OptionType) => void;
  disabled?: boolean;
}

export const Option: React.FC<OptionProps> = ({
  option,
  disabled = false,
  onClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleOptionSelect = () => {
    onClick(option);
  };

  return (
    <Box
      onClick={handleOptionSelect}
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid",
        borderColor: "divider",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        "&:hover": {
          backgroundColor: disabled ? "transparent" : "primary.50",
        },
        transition: "background-color 0.3s, opacity 0.3s",
      }}
    >
      <Box
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {!imageLoaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ borderRadius: 0 }}
            />
          </Box>
        )}
        <img
          src={option.image?.mini}
          alt={option.title}
          onLoad={() => {
            console.log("image loaded");
            handleImageLoad();
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imageLoaded ? "block" : "none",
          }}
        />
      </Box>
      <Box
        sx={{
          padding: "1em",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          level="h4"
          sx={{ mb: option.description ? 1 : 0, fontSize: "1em" }}
        >
          {option.title}
        </Typography>
        {option.description ? (
          <Typography level="body-sm" sx={{ mb: 1, fontSize: "1em" }}>
            {option.description}
          </Typography>
        ) : null}
        {/* Add description if needed */}
      </Box>
    </Box>
  );

  //return (
  //  <Button onClick={handleOptionSelect} variant="outlined" sx={{ margin: '8px' }}>
  //    {option.title}
  //    {option.description && <p>{option.description}</p>}
  //    {option.image && <img src={option.image.url} alt={option.title} />}
  //  </Button>
  //);
};

export default Option;
