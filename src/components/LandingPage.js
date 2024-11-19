import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CssBaseline, Box, Typography, Button, IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { lightTheme, darkTheme } from "../theme"; // Import themes

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 2,
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        {/* Dark Mode Toggle */}
        <IconButton
          onClick={toggleTheme}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Typography variant="h3" component="h1" gutterBottom>
           Expense Tracker
        </Typography>
        <Typography variant="body1" gutterBottom>
          Manage your expenses efficiently and stay in control of your finances.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            sx={{ width: 200 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/signup"
            sx={{ width: 200 }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;