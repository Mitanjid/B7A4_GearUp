import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: Role };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource.",
      );
    }

    const verified = jwtUtils.verifyToken(token, config.jwt_access_secret!);

    if (!verified.success) {
      throw new Error(verified.error);
    }

    const { id, email, role } = verified.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource.",
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }

    if (user.status === "SUSPENDED") {
      throw new Error(
        "Your account has been suspended. Please contact support.",
      );
    }

    req.user = { id, email, role };
    next();
  });
};
