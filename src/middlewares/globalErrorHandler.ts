import { NextFunction, Request, Response } from "express";
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

  if (err instanceof Prisma.PrismaClientValidationError) {
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
  } else if (
    err.message?.includes("logged in") ||
    err.message?.includes("Forbidden")
  ) {
    statusCode = err.message.includes("Forbidden") ? 403 : 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails:
      process.env.NODE_ENV === "production" ? undefined : errorDetails,
  });
};
