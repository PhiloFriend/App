// Import Playfair Display font
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/900.css";

// Import Lato font
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";

import { extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  fontFamily: {
    display: '"Playfair Display", var(--joy-fontFamily-fallback)',
    body: '"Playfair Display", var(--joy-fontFamily-fallback)',
  },
  components: {
    JoyTypography: {
      defaultProps: {
        fontFamily: "Playfair Display",
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Helvetica", sans-serif',
          fontWeight: 700, // Increased font weight for better button appearance
          borderRadius: 0, // Remove border radius
        },
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#cccccc",
          300: "#b8b8b8",
          400: "#a3a3a3",
          500: "#252422", // Set primary color to #252422
          600: "#1e1d1b",
          700: "#161614",
          800: "#0f0f0e",
          900: "#080807",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#e6f0ff",
          100: "#b3d1ff",
          200: "#80b3ff",
          300: "#4d94ff",
          400: "#1a75ff",
          500: "#0056e6",
          600: "#0047bf",
          700: "#003999",
          800: "#002a73",
          900: "#001c4d",
        },
      },
    },
  },
});

export default theme;