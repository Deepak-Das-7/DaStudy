import type { Request, Response } from "express";
import ClassModel from "../models/Class";
import { sendSuccess } from "../utils/apiResponse";

export const getClasses = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const classes = await ClassModel
        .find()
        .sort({ classNumber: 1 });

    sendSuccess(
        res,
        200,
        "Classes fetched successfully",
        classes
    );
};