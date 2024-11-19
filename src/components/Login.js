import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // For navigation
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors
    try {
      // Sign in using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully!");
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (err) {
      console.error("Error logging in:", err.message);
      setError("Invalid email or password."); // Display user-friendly error message
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        px: 4,
        py: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Sign In
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Email Input */}
      <TextField
        label="Email Address"
        type="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password Input */}
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Remember Me Checkbox */}
      <FormControlLabel
        control={<Checkbox />}
        label="Remember me"
        sx={{ mt: 1 }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>

      {/* Forgot Password */}
      {/* <Typography
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
        color="text.secondary"
      >
        Forgot your password?{" "}
        <a href="#" style={{ textDecoration: "none", color: "#1976d2" }}>
          Click here
        </a>
      </Typography> */}

      {/* Signup Link */}
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
        color="text.secondary"
      >
        Don't have an account?{" "}
        <a
          href="/signup"
          style={{ textDecoration: "none", color: "#1976d2" }}
        >
          Sign up
        </a>
      </Typography>
    </Box>
  );
};

export default Login;