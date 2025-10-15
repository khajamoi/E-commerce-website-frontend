import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Gradient table header
const GradientTableCell = styled(TableCell)({
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
});

// Styled row with hover effect
const HoverTableRow = styled(TableRow)({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
});

// Role badge colors
const roleColors = {
  admin: 'primary',
  user: 'success',
  moderator: 'warning',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ textAlign: 'center', color: '#333' }}
      >
        Manage Users
      </Typography>

      <TableContainer
        component={Paper}
        elevation={6}
        sx={{ borderRadius: 3, overflow: 'hidden' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <GradientTableCell>ID</GradientTableCell>
              <GradientTableCell>Name</GradientTableCell>
              <GradientTableCell>Email</GradientTableCell>
              <GradientTableCell>Phone Number</GradientTableCell>
              <GradientTableCell>Role</GradientTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <HoverTableRow key={user.id}>
                <TableCell align="center">{user.id}</TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.phoneNumber || '-'}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.role.toUpperCase()}
                    color={roleColors[user.role] || 'default'}
                    variant="filled"
                  />
                </TableCell>
              </HoverTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
