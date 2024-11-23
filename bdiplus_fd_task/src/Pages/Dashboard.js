import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, createTheme, ThemeProvider } from '@mui/material';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Logo from '../assert/BDIPlus-Full-Color.png'; // Adjust path accordingly
import BackImage from '../assert/Layer-3-1024x801.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005A9C', // Custom primary color
    },
    secondary: {
      main: '#FFD700', // Custom secondary color
    },
    background: {
      default: '#F5F5F5', // Light gray for background
    },
    text: {
      primary: '#333333', // Dark gray for primary text
      secondary: '#005A9C', // Match primary for secondary text
    },
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`,
  },
});

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Validate fields
  const validateFields = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  // Open add user modal
  const handleAddUserOpen = () => {
    setIsEditMode(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setOpen(true);
  };

  // Open edit user modal
  const handleEditUserOpen = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, password: '', confirmPassword: '' });
    setErrors({});
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Handle submit (add or edit user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      if (isEditMode) {
        await axiosInstance.put(`/user/${selectedUser.id}`, formData);
      } else {
        await axiosInstance.post('/register', formData);
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: `url(${BackImage}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 1200, alignItems: 'center', mb: 3 }}>
          <img src={Logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
          <Typography variant="h4" color="text.primary">User Management</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
        </Box>

        {/* User Table */}
        <Box sx={{ width: '100%', maxWidth: 1200, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 3, borderRadius: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddUserOpen} sx={{ mb: 2 }}>Add User</Button>
          <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleEditUserOpen(user)} sx={{ mr: 1 }}>Edit</Button>
                    <Button variant="contained" color="error" onClick={() => deleteUser(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Add/Edit User Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            {!isEditMode && (
              <>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary">{isEditMode ? 'Save Changes' : 'Add User'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
