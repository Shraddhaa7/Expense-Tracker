import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // Import Firestore (db)
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Get the created user object

      // Create user info in Firestore
      await createUserInfo(user.uid);

      alert("Account created successfully!");
    } catch (error) {
      console.error("Error during signup:", error.message);
      setError(error.message); // Display the error message
    } finally {
      setLoading(false);
    }
  };

  const createUserInfo = async (userId) => {
    try {
      // Create a new document in the 'users' collection under the user's UID
      const userInfoRef = doc(db, "users", userId);

      // Set default user info data
      await setDoc(userInfoRef, {
        name: "User", // Default name, can extend the form later for custom input
        email: email,
        createdAt: new Date(),
      });

      console.log("User info created in Firestore.");
    } catch (error) {
      console.error("Error creating user info:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
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
        Sign Up
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

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading} // Disable button while loading
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>

      {/* Login Link */}
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
        color="text.secondary"
      >
        Already have an account?{" "}
        <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
          Login
        </a>
      </Typography>
    </Box>
  );
};

export default Signup;