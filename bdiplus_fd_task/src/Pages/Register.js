import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

// Path to your logo and background image
import logoImage from '../assert/BDIPlus-Full-Color.png'; // Adjust path accordingly
import BackImage from '../assert/Rectangle-31.png';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset the error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Real-time validation for confirmPassword
    if (name === 'confirmPassword' && formData.password !== value) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await axiosInstance.post('/register', formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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
        padding: 3,
      }}
    >
      {/* Header with logo */}
      <Box sx={{ mb: 4 }}>
        <img
          src={logoImage}
          alt="Logo"
          style={{
            width: '250px',
            height: 'auto',
          }}
        />
      </Box>

      {/* Form Section */}
      <Box sx={{ width: 300, mx: 'auto', backgroundColor: 'white', padding: 3, borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h5" align="center" mb={2}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 2 }}>
            Register
          </Button>

          {/* Login Button */}
          <Button fullWidth variant="outlined" color="secondary" onClick={handleLoginRedirect} sx={{ mb: 2 }}>
            Already have an account? Login
          </Button>

          <Typography variant="body2" align="center" color="secondary" mt={2}>{message}</Typography>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
