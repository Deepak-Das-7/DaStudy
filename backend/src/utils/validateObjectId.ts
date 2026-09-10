import type { NextFunction, Request, Response } from "express";

import { API_ERROR_CODES } from "../constants/apiErrorCodes";
import { sendError } from "../utils/apiResponse";
import { isValidObjectId } from "../utils/validation";

export const validateObjectId = (
    parameterName: string
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const value = req.params[parameterName];

        if (typeof value !== "string" || !isValidObjectId(value)) {
            sendError(
                res,
                400,
                `Invalid ${parameterName}`,
                API_ERROR_CODES.INVALID_ID
            );

            return;
        }

        next();
    };
};