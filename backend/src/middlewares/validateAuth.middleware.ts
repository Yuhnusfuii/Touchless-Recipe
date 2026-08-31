import type { Request, Response, NextFunction } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password, confirmPassword } = req.body;
  const errors: string[] = [];

  // Validate Name
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Your name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (name.trim().length > 50) {
    errors.push("Name cannot exceed 50 characters");
  }

  // Validate Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Invalid email format (e.g. user@example.com)");
  }

  // Validate Password
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Validate Confirm Password
  if (!confirmPassword || typeof confirmPassword !== "string") {
    errors.push("Confirm password is required");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  const errors: string[] = [];

  // Validate Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Invalid email format");
  }

  // Validate Password
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
    return;
  }

  next();
};
