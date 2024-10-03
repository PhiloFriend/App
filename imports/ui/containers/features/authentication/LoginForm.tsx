import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
  Link,
  Divider,
} from "@mui/joy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { Navigate, useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        setErrors({ password: "Invalid email or password" });
      } else {
        // Redirect or handle successful login
        navigate("/");
        console.log("Login successful");
      }
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleLogin = () => {
    Meteor.loginWithGoogle({}, (error) => {
      if (error) {
        console.error("Google login error:", error);
        setErrors({
          ...errors,
          //@ts-ignore
          general: "Google login failed. Please try again.",
        });
      } else {
        navigate("/");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        sx={{ mb: "1em", borderRadius: "10px" }}
        error={!!errors.email}
      >
        <FormLabel>Email</FormLabel>
        <Input
          required
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl sx={{ mb: "1em" }} error={!!errors.password}>
        <FormLabel>Password</FormLabel>
        <Input
          required
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          endDecorator={
            <IconButton onClick={handleTogglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          }
        />
        {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
      </FormControl>
      <Link
        component="button"
        type="button"
        onClick={() => navigate("/forgot-password")}
        sx={{ display: "block", textAlign: "right", mb: 2 }}
      >
        Forgot Password?
      </Link>
      <Button type="submit" fullWidth>
        Log In
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <Button
        fullWidth
        variant="outlined"
        color="neutral"
        startDecorator={<GoogleIcon />}
        onClick={handleGoogleLogin}
      >
        Log in with Google
      </Button>
    </form>
  );
};
