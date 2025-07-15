import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: 'SELLER' | 'BUYER'; // adjust as needed
}

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
export function verifyJwtToken(token: string): UserJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      return decoded as UserJwtPayload;
    }

    return null;
  } catch (err) {
    return null;
  }
}
