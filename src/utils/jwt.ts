import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const data = jwt.verify(token, secret);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const jwtUtils = { createToken, verifyToken };
