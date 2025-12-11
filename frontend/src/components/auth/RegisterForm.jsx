import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import Header from '../../components/common/Header';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Create Account
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Join our platform and register your company
            </Typography>
            
            <RegisterForm />
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                By signing up, you agree to our{' '}
                <MuiLink component={RouterLink} to="/terms" color="primary">
                  Terms of Service
                </MuiLink>{' '}
                and{' '}
                <MuiLink component={RouterLink} to="/privacy" color="primary">
                  Privacy Policy
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default RegisterPage;