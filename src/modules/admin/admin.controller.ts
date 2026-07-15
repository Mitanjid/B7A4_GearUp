import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await adminService.updateUserStatus(
    req.params.id as string,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: user,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await adminService.getAllGear();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear items fetched successfully",
    data: gear,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const rentals = await adminService.getAllRentals();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders fetched successfully",
    data: rentals,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
