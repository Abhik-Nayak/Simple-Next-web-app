import jwt from "jsonwebtoken";

/**
 * JWT secret key from environment variables
 * @throws Error if JWT_SECRET is not defined
 */
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Signs a JWT token with the given payload
 * @param payload - The data to include in the token
 * @returns Signed JWT token that expires in 1 day
 */
export function signJwtToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded token payload if valid, null if invalid or expired
 */
export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
