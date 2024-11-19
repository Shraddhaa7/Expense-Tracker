// src/index.js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { lightTheme, darkTheme } from "./theme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const Root = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={currentTheme}>
      <StyledThemeProvider theme={currentTheme}>
        <App toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));