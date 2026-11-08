import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import User from '../model/User'
import { useForm } from 'react-hook-form';
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuth, error } = useSelector((state: RootState) => state.auth);
  const prevDataRef = useRef<User>(null);
  const navigate = useNavigate();

  console.log("LoginPage rendered");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const onSubmit = (data: User) => {
    if (!prevDataRef.current
        || prevDataRef.current.username !== data.username
        || prevDataRef.current.password !== data.password) {
      prevDataRef.current = data;
      dispatch(fetchUser(data));
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/dashboards');
    }
  }, [isAuth]);
  
  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: 8, 
          padding: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            autoFocus
            label="Username"
            id='username'
            {...register("username", { required: true })}
            error={!!errors.username}
            helperText={errors.username ? 'Username is required' : ''}
          />
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Password"
            id='password'
            {...register("password", { required: true })}
            error={!!errors.password}
            helperText={errors.password ? 'Password is required' : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;