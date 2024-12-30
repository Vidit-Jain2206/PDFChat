import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { client } from "../client";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Find user by email
    const user = await client.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error(`Invalid credentials`);
    }

    // Create access and refresh tokens
    const accessToken: string = generateAccessToken(user.id);
    const refreshToken: string = generateRefreshToken(user.id);

    // Store refresh token in DB
    await client.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Check if user already exists
    const existingUser = await client.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error(`User already exists`);
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await client.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Create access and refresh tokens
    const accessToken: string = generateAccessToken(newUser.id);
    const refreshToken: string = generateRefreshToken(newUser.id);

    // Store refresh token in DB
    await client.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    // Set cookies
    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
