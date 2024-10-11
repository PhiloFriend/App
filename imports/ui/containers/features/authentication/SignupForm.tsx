import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
  Alert,
  Divider,
  Checkbox,
  Link,
  Typography,
} from "@mui/joy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate, Link as RouterLink } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
  acceptTerms: boolean;
  acceptEmails: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface SignupFormProps {
  philosophies?: Array<string>;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  philosophies,
}: SignupFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    acceptTerms: true,
    acceptEmails: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Perform validation on change for password
    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const { email, password, acceptEmails } = formData;
      setRegistrationStatus("idle");
      Accounts.createUser(
        {
          email,
          password,
          profile: {
            philosophies,
            acceptEmails,
          },
        },
        (error) => {
          if (error) {
            console.error("Registration error:", error);
            setRegistrationStatus("error");
            //@ts-ignore
            if (error.reason === "Email already exists.") {
              setErrors({
                ...errors,
                email: "This email is already registered",
              });
            } else {
              //@ts-ignore
              setErrors({
                ...errors,
                general:
                  //@ts-ignore
                  error.reason || "Registration failed. Please try again.",
              });
            }
          } else {
            console.log("Registration successful");
            setRegistrationStatus("success");
            // Send verification email
            //@ts-ignore
            Meteor.call("sendVerificationEmail", (error) => {
              if (error) {
                console.error("Error sending verification email:", error);
                setErrors({
                  ...errors,
                  general:
                    "Registration successful, but failed to send verification email.",
                });
              } else {
                navigate("/");
                console.log("Verification email sent");
              }
            });
          }
        }
      );
    } else {
      console.log("Form has errors");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleSignup = () => {
    if (!formData.acceptTerms) {
      setErrors({
        ...errors,
        general: "You must accept the Terms and Conditions to sign up.",
      });
      return;
    }

    Meteor.loginWithGoogle(
      {
        requestPermissions: ["email"],
        requestOfflineToken: true,
        loginStyle: "popup",
      },
      (error) => {
        if (error) {
          console.error("Google signup error:", error);
          setErrors({
            ...errors,
            general: "Google signup failed. Please try again.",
          });
        } else {
          // Update user profile with acceptEmails
          Meteor.call(
            "updateUserProfile",
            { acceptEmails: formData.acceptEmails },
            //@ts-ignore
            (error) => {
              if (error) {
                console.error("Error updating user profile:", error);
              }
              navigate("/");
            }
          );
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {registrationStatus === "error" && errors.general && (
        <Alert color="danger" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}
      {registrationStatus === "success" && (
        <Alert color="success" sx={{ mb: 2 }}>
          Registration successful! Please check your email to verify your
          account.
        </Alert>
      )}
      <FormControl sx={{ mb: "1em" }} error={touched.email && !!errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          required
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={touched.email && !!errors.email}
        />
        {touched.email && errors.email && (
          <FormHelperText>{errors.email}</FormHelperText>
        )}
      </FormControl>
      <FormControl
        sx={{ mb: "1em" }}
        error={touched.password && !!errors.password}
      >
        <FormLabel>Password</FormLabel>
        <Input
          required
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          error={touched.password && !!errors.password}
          endDecorator={
            <IconButton onClick={handleTogglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          }
        />
        {touched.password && errors.password && (
          <FormHelperText>{errors.password}</FormHelperText>
        )}
      </FormControl>

      <FormControl size="sm" sx={{ width: "100%", mb: 2 }}>
        <Checkbox
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          label={
            <Typography>
              I have read and agree to the{" "}
              <Typography sx={{ fontWeight: "md" }}>
                terms and conditions
              </Typography>
              .
            </Typography>
          }
        />
        <FormHelperText>
          <Typography level="body-sm">
            Read our{" "}
            <Link component={RouterLink} to="/terms-and-conditions">
              terms and conditions
            </Link>
            .
          </Typography>
        </FormHelperText>
      </FormControl>

      <FormControl size="sm" sx={{ width: "100%", mb: 2 }}>
        <Checkbox
          name="acceptEmails"
          checked={formData.acceptEmails}
          onChange={handleChange}
          label={
            <Typography>
              Embark on a journey of daily wisdom. Allow us to send you
              enchanting reminders, guiding you towards moments of reflection
              and self-discovery.
            </Typography>
          }
        />
      </FormControl>

      <Button
        type="submit"
        fullWidth
        disabled={registrationStatus === "success" || !formData.acceptTerms}
      >
        Sign Up
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <Button
        fullWidth
        variant="outlined"
        color="neutral"
        startDecorator={<GoogleIcon />}
        onClick={handleGoogleSignup}
        disabled={!formData.acceptTerms}
      >
        Sign up with Google
      </Button>
    </form>
  );
};
