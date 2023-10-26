import { FormEvent, JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/auth';
import { clearMessage } from '../../store/slices/message';
import { AppDispatch } from '../../store/store';

function Login(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: { auth: any }) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  async function loginUser(data: FormData) {
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    await dispatch(login({ username, password }));
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (event?.currentTarget instanceof HTMLFormElement) {
      const data = new FormData();
      const { username, password } = event.currentTarget;
      data.append('username', username.value);
      data.append('password', password.value);
      await loginUser(data);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          padding: '20%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/static/drive.png" alt="drive clone logo" />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            type="text"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;