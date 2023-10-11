import { useState, useEffect } from "react";
import "./auth.scss";

import { loginUser } from "../../store/authSlice";

// types
import { ClickEvent } from "../../types/ReactTypes";

// components
import Overlay from "./Overlay";
import { Copyright } from "./Copyright";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setLoginStatus } from "../../store/authSlice";

// mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

interface LoginProps {
  closeModal: ClickEvent;
  switchModal: ClickEvent;
}

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Login({ closeModal, switchModal }: LoginProps) {
  const dispatch: AppDispatch = useDispatch();
  const loginStatus = useSelector((state: RootState) => state.auth.loginStatus);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const data = new FormData(e.currentTarget);
    const credentials = {
      username: data.get('username') as string,
      password: data.get('password') as string,
    };

    dispatch(setLoginStatus(null));
    setErrorMessage("");
    setLoading(true);
    dispatch(loginUser(credentials));
  };

  useEffect(() => {
    if (loginStatus) {
      if (loginStatus === 200) {
        setErrorMessage("");
        closeModal();
        dispatch(setLoginStatus(null));
      }

      if (loginStatus === 401) {
        setErrorMessage("Incorrect username or password.");
      }

      if (loginStatus === 408) {
        setErrorMessage("408 Request Timeout. Please try again.");
      }

      setLoading(false);
    }
  }, [loginStatus]);

  const closerModal = () => {
    if (loading) return;
    dispatch(setLoginStatus(null));
    setErrorMessage("");
    closeModal();
  };

  const preventSwitch = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (loading) return;
    dispatch(setLoginStatus(null));
    setErrorMessage("");
    switchModal();
  };

  return (
    <Overlay closeModal={closerModal}>
      <ThemeProvider theme={defaultTheme}>
        <Container
          className="container"
          component="main"
          maxWidth="xs"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? null : (
            <CloseIcon className="close-icon" onClick={closerModal} />
          )}
          <Box
            sx={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                disabled={loading}
                error={Boolean(loginStatus)}
                // helperText={errorMessage}
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
                disabled={loading}
                error={Boolean(loginStatus)}
                helperText={errorMessage}
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
                disabled={loading}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={(e) => preventSwitch(e)}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Overlay>
  );
}
