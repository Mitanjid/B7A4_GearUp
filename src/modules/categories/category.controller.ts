import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category fetched successfully",
    data: category,
  });
});

const updateCategory = catchAsync(async (req: Request , res: Response) => {
    const category = await categoryService.updateCategory(req.params.id as string , req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message : "Categore updated sucessfully",
        data: category,
    })
});

const deleteCategory = catchAsync(async (req: Request , res: Response) => {
    const category = await categoryService.deleteCategory(req.params.id as string); 

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message : "Category deleted successfully",
        data: category,
    })
});

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}