import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axiosInstance, { setAuthToken } from '../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

import logoImage from '../assert/BDIPlus-Full-Color.png'; // Adjust path accordingly
import BackImage from '../assert/Layer-3-1024x801.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Validate email
    if (!credentials.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is not valid';
      isValid = false;
    }

    // Validate password
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) return;

    try {
      const response = await axiosInstance.post('/login', credentials);
      const token = response.data.access_token;
  
      // Store token in localStorage
      localStorage.setItem('access_token', token);
  
      // Set the token in Axios
      setAuthToken(token);
  
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      if (err.response) {
        // Check for email or password errors from the backend
        if (err.response.data.message === 'Email not registered') {
          setMessage('Email is not registered. Please register first.');
        } else if (err.response.data.message === 'Incorrect password') {
          setMessage('The password is incorrect. Please try again.');
        } else {
          setMessage('Login failed. Please check your credentials.');
        }
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `url(${BackImage}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <img src={logoImage} alt="Logo" style={{ width: '250px', height: 'auto', paddingLeft:"83px" }} />
      </Box>

      {/* Login Form */}
      <Box sx={{ width: 300, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email" 
            name="email" 
            value={credentials.email}
            onChange={handleChange}
            error={Boolean(errors.email)} 
            helperText={errors.email}
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Password" 
            name="password" 
            type="password" 
            value={credentials.password}
            onChange={handleChange}
            error={Boolean(errors.password)} 
            helperText={errors.password}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 2 }}>Login</Button>
          <Typography variant="body2" align="center" color="secondary" mt={2}>{message}</Typography>
        </form>
        <Button fullWidth variant="outlined" color="primary" onClick={handleRegisterRedirect} sx={{ mt: 2 }}>
          Go to Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
