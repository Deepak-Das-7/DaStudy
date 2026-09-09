import type { NextFunction, Request, Response } from "express";

import { API_ERROR_CODES } from "../constants/apiErrorCodes";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    console.error("Unhandled server error:", error);

    return sendError(
        res,
        500,
        "Internal server error",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR
    );
};