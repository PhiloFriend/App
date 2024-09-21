import React, { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
} from "@mui/joy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Accounts } from "meteor/accounts-base";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface SignupFormProps {
  philosophies?: Array<string>;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  philosophies,
}: SignupFormProps) => {
  console.log(philosophies);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const { email, password } = formData;
      Accounts.createUser({
        email,
        password,
        profile: {
          philosophies,
        },
      });
    } else {
      console.log("Form has errors");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <Button type="submit" fullWidth>
        Sign Up
      </Button>
    </form>
  );
};
