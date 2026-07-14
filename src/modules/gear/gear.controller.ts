import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearService } from "./gear.service";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await gearService.createGear(req.user!.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear item added successfully",
    data: gear,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await gearService.getAllGear(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear items fetched successfully",
    data: gear,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const gear = await gearService.getGearById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear item fetched successfully",
    data: gear,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await gearService.updateGear(
    req.params.id as string,
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear item updated successfully",
    data: gear,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  await gearService.deleteGear(req.params.id as string, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear item deleted successfully",
    data: null,
  });
});

const getProviderGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await gearService.getProviderGear(req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider gear fetched successfully",
    data: gear,
  });
});

export const gearController = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
  getProviderGear,
};
