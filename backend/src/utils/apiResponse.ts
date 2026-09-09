import type { Response } from "express";

import type {
    ApiError,
    PaginationMeta,
} from "../types/apiResponse";

export const sendSuccess = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
    pagination?: PaginationMeta
): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(pagination ? { pagination } : {}),
    });
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    code: string,
    details?: unknown
): Response => {
    const error: ApiError = {
        code,
        ...(details !== undefined ? { details } : {}),
    };

    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};