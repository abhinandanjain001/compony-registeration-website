// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email required"),
  password: yup.string().min(6, "6+ characters").required("Password required"),
  remember: yup.boolean(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email: values.email, password: values.password },
        { timeout: 10000 }
      );
      // save token securely (example: localStorage for demo; use httpOnly cookie in prod)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (values.remember) {
        localStorage.setItem("remember", "1");
      } else {
        localStorage.removeItem("remember");
      }
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Login failed, try again";
      setServerError(message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Company Login
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={<Checkbox color="primary" {...register("remember")} />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 2, mb: 1, py: 1.2 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={(e)=>e.preventDefault()}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>

          {/* Optional social/login helpers */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Or sign in with
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
              <Button variant="outlined" size="small" onClick={()=>alert('SAML/OAuth placeholder')}>
                SSO
              </Button>
              <Button variant="outlined" size="small" onClick={()=>alert('Google placeholder')}>
                Google
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
