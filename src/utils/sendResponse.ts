import { Response } from "express";

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
};

export const sendResponse = <T>(res: Response, payload: TResponseData<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
  });
};
