import "./auth.scss";

import { ClickEvent } from "../../types/ReactTypes";

import Overlay from "./Overlay";
import { Copyright } from "./Copyright";

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

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { register } from "../../store/authSlice";

interface SignUpProps {
  closeModal: ClickEvent;
  switchModal: ClickEvent;
}

export default function SignUp({ closeModal, switchModal }: SignUpProps) {
  const dispatch: AppDispatch = useDispatch();
  
  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const credentials = {
      username: data.get("username") as string,
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    if (credentials.password !== data.get("confirm-password")) {
      window.alert("password don't match")
      return;
    }

    dispatch(register(credentials));
    
    closeModal();
  };

  return (
    <Overlay closeModal={closeModal}>
      <ThemeProvider theme={defaultTheme}>
        <Container
          className="container"
          component="main"
          maxWidth="xs"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseIcon className="close-icon" onClick={() => closeModal()} />
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
                    autoComplete="username"
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    autoComplete="confirm-password"
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
                  <Link href="#" variant="body2" onClick={() => switchModal()}>
                    Already have an account? Sign in
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
