import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const rental = await rentalService.createRental(req.user!.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order placed successfully",
    data: rental,
  });
});

const getCustomerRentals = catchAsync(async (req: Request, res: Response) => {
  const rentals = await rentalService.getCustomerRentals(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders fetched successfully",
    data: rentals,
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const rental = await rentalService.getRentalById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order fetched successfully",
    data: rental,
  });
});

const getProviderRentals = catchAsync(async (req: Request, res: Response) => {
  const rentals = await rentalService.getProviderRentals(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider rental orders fetched successfully",
    data: rentals,
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const rental = await rentalService.updateRentalStatus(
    req.params.id as string,
    req.user!.id,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order status updated successfully",
    data: rental,
  });
});

const cancelRental = catchAsync(async (req: Request, res: Response) => {
  const rental = await rentalService.cancelRental(
    req.params.id as string,
    req.user!.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order cancelled successfully",
    data: rental,
  });
});

export const rentalController = {
  createRental,
  getCustomerRentals,
  getRentalById,
  getProviderRentals,
  updateRentalStatus,
  cancelRental,
};
