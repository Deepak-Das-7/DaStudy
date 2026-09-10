import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { API_ERROR_CODES } from "../constants/apiErrorCodes";
import { sendError } from "../utils/apiResponse";
import { isValidObjectId } from "../utils/validation";

export const validateQueryObjectId = (
    parameterName: string
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const value = req.query[parameterName];

        if (value === undefined) {
            next();
            return;
        }

        if (
            typeof value !== "string" ||
            !isValidObjectId(value)
        ) {
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