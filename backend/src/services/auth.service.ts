import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { CreateUserDTO, RegisterDTO } from "../models/user.model.js";

export class AuthService {
  private generateToken(userId: string, email: string): string {
    const secret = process.env["JWT_SECRET"] || "default_jwt_secret";
    return jwt.sign({ id: userId, email }, secret, {
      expiresIn: "7d",
    });
  }

  async register(data: RegisterDTO) {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check existing email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      const error: any = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Save to Database
    const user = await User.create({
      name: data.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        dietaryPrefs: user.dietaryPrefs,
        kcalTarget: user.kcalTarget,
        streak: user.streak,
        createdAt: user.createdAt,
      },
      token,
      message: "Registration successful",
    };
  }

  async login(email: string, password?: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // Find user with password included
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.password) {
      const error: any = new Error("Account has no password set. Please log in using SSO.");
      error.statusCode = 400;
      throw error;
    }

    if (!password) {
      const error: any = new Error("Password is required");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        dietaryPrefs: user.dietaryPrefs,
        kcalTarget: user.kcalTarget,
        streak: user.streak,
        createdAt: user.createdAt,
      },
      token,
      message: "Login successful",
    };
  }

  async loginOrRegister(data: CreateUserDTO) {
    const normalizedEmail = data.email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        ...data,
        email: normalizedEmail,
        name: data.name || "Chef",
      });
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        dietaryPrefs: user.dietaryPrefs,
        kcalTarget: user.kcalTarget,
        streak: user.streak,
        createdAt: user.createdAt,
      },
      token,
      message: "Authentication successful",
    };
  }
}

export const authService = new AuthService();

