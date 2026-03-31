import { Response } from "express";

export const responseToClient = (
  res: Response,
  success: boolean,
  status: number,
  message: string,
  data?: unknown,
): void => {
  res.status(status).json({
    success,
    status,
    message,
    data: data ?? null,
  });
};

export const serverError = (res: Response): void => {
  res.status(500).json({
    success: false,
    status: 500,
    message: "Opps Sorry! Server is down",
  });
};

export const responseWithPagination = (
  res: Response,
  data: unknown,
  total: number,
  message: string,
  page: number,
  limit: number,
) => {
  return res.status(200).json({
    success: true,
    message,
    data: data ?? null,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    },
  });
};
