import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: review,
  });
});

const getReviewsByGearId = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getReviewsByGearId(
    req.params.gearItemId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews fetched successfully",
    data: reviews,
  });
});

export const reviewController = {
  createReview,
  getReviewsByGearId,
};
