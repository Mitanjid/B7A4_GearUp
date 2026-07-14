import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentSession(
    req.user!.id,
    req.body.rentalOrderId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  const payment = await paymentService.confirmPayment(sessionId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: payment,
  });
});

const getCustomerPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await paymentService.getCustomerPayments(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history fetched successfully",
    data: payments,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment details fetched successfully",
    data: payment,
  });
});

export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getCustomerPayments,
  getPaymentById,
};
