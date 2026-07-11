import { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong!";
  let errorDetails: any = err.stack;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided or missing required fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Related record not found (foreign key constraint failed)";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  } else if (err.message?.includes("logged in")) {
    statusCode = 401;
  } else if (
    err.message?.includes("Forbidden") ||
    err.message?.includes("not allowed")
  ) {
    statusCode = 403;
  } else if (err.message?.includes("not found")) {
    statusCode = 404;
  } else if (
    err.message?.includes("already exists") ||
    err.message?.includes("Incorrect password") ||
    err.message?.includes("suspended")
  ) {
    statusCode = 400;
  }

  
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails:
      err instanceof ZodError
        ? err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }))
        : process.env.NODE_ENV === "production"
          ? undefined
          : err.message,
  });
};
