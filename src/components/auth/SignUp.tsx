import { useEffect, useState } from "react";
import "./auth.scss";

import { ClickEvent } from "../../types/index";

import Overlay from "./Overlay";

// mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { register, setRegisterStatus } from "../../store/authSlice";

interface SignUpProps {
  closeModal: ClickEvent;
  switchModal: ClickEvent;
}

export default function SignUp({ closeModal, switchModal }: SignUpProps) {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const registerStatus = useSelector(
    (state: RootState) => state.auth.registerStatus
  );

  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const credentials = {
      username: data.get("username") as string,
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    if (credentials.password !== data.get("confirm-password")) {
      dispatch(setRegisterStatus({...registerStatus, password: ["Passwords do not match."]}));
      return;
    } else {
      dispatch(setRegisterStatus({}));
      setLoading(true);
      dispatch(register(credentials));
    }
  };

  useEffect(() => {
    if (!registerStatus) {
      dispatch(setRegisterStatus({}));
      closeModal();
    }

    setLoading(false);
  }, [registerStatus]);

  const closerModal = () => {
    if (loading) return;
    dispatch(setRegisterStatus({}));
    closeModal();
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
          <CloseIcon className="close-icon" onClick={closerModal} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="off"
                    autoFocus
                    disabled={loading}
                    error={Boolean(registerStatus?.username)}
                    helperText={registerStatus?.username?.join(" ")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    disabled={loading}
                    error={Boolean(registerStatus?.email)}
                    helperText={registerStatus?.email?.join(" ")}
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
                    disabled={loading}
                    error={Boolean(registerStatus?.password?.join(" "))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    autoComplete="confirm-password"
                    disabled={loading}
                    error={Boolean(registerStatus?.password)}
                    helperText={registerStatus?.password?.join(" ")}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={() => switchModal()}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Overlay>
  );
}
