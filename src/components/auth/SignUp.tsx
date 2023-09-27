import { useState } from "react";
import "./auth.scss";

// MUI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//////////////
// TODO: turn form into MUI components instead of custom styling
//////////////

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    // passwordConfirmation: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");

  function updateForm(value: Object) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // TODO: move to /utils or /hooks
  async function registerUser(e: any) {
    // TODO: not any
    e.preventDefault();
    // setReadOnly(true);
    // setLoading(true);

    const newSignup = { ...form };

    const response = await fetch("SERVER_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSignup),
    }).catch((error) => {
      console.log(error);
      // setAlert(true);
      // setReadOnly(false);
      // setLoading(false);
    });

    setForm({ username: "", email: "", password: "" });
    setPasswordConfirm("");

    if (response) {
      const data = await response.json();

      if (data.status === "ok") {
        // receive the JWT and store it in cookies/local storage
        // setAlert(false);
        // navigate('/login');
      } else {
        // console.error('error');
        // setAlert(true);
        // setReadOnly(false);
        // setLoading(false);
      }
    }
  }

  const defaultTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <div className="overlay">
      <ThemeProvider theme={defaultTheme}>
        <Container className="container" component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
