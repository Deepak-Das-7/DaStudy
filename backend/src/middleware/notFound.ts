import type { Request, Response } from "express";

import { API_ERROR_CODES } from "../constants/apiErrorCodes";
import { sendError } from "../utils/apiResponse";

export const notFound = (
    req: Request,
    res: Response
): Response => {
    return sendError(
        res,
        404,
        `Route not found: ${req.method} ${req.originalUrl}`,
        API_ERROR_CODES.ROUTE_NOT_FOUND
    );
};