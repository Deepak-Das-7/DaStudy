import type {
    ErrorRequestHandler,
    Request,
    Response,
} from "express";
import mongoose from "mongoose";

import { API_ERROR_CODES } from "../constants/apiErrorCodes";
import { sendError } from "../utils/apiResponse";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    res: Response
): Response => {
    console.error("Unhandled server error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
        return sendError(
            res,
            400,
            "Validation failed",
            API_ERROR_CODES.INVALID_QUERY,
            error.message
        );
    }

    if (error instanceof mongoose.Error.CastError) {
        return sendError(
            res,
            400,
            "Invalid value provided",
            API_ERROR_CODES.INVALID_ID
        );
    }

    return sendError(
        res,
        500,
        "Internal server error",
        API_ERROR_CODES.INTERNAL_SERVER_ERROR
    );
};