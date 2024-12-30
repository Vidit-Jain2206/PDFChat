import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const ACCESS_TOKEN_EXPIRY = "15m"; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token expires in 7 days

// Generate an access token
export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate a refresh token
export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Verify a token
export const verifyToken = (token: string): { userId: number } => {
  try {
    const object = jwt.verify(token, SECRET_KEY) as {
      userId: number;
    };
    return object;
  } catch (error: any) {
    throw new Error(error);
  }
};
