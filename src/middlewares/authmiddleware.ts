import { NextFunction, Request, Response } from "express";
import { generateAccessToken, verifyToken } from "../utils/jwt";
import { client } from "../client";

export const authMiddlewareJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken || !refreshToken) {
      throw new Error("Access token and refresh token are missing");
    }

    if (!accessToken) {
      res.status(401).json({ message: "Access token missing or invalid" });
      return;
    }

    const userFromAccessToken = verifyToken(accessToken);

    if (userFromAccessToken) {
      // Access token is valid, proceed to the next handler
      req.user = userFromAccessToken.userId; // Attach user data to request for downstream access
      next();
      return;
    }

    const userFromRefreshToken = verifyToken(refreshToken);

    if (!userFromRefreshToken) {
      res
        .status(401)
        .json({ message: "Invalid refresh token. Please login again" });
      return;
    }
    const userId: number = userFromRefreshToken.userId;
    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ message: "Refresh token mismatch" });
      return;
    }

    const newAccessToken = generateAccessToken(userId);

    // Set the new access token in the cookies
    res.cookie("access_token", newAccessToken);
    req.user = userId;
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(401).json({ message: "Unauthorized" });
  }
};
