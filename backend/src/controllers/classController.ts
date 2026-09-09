import type { Request, Response } from "express";
import ClassModel from "../models/Class";
import { sendSuccess } from "../utils/apiResponse";

export const getClasses = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const classes = await ClassModel.find()
            .sort({ classNumber: 1 })
            .select("classNumber name");

        sendSuccess(
            res,
            200,
            "Classes fetched successfully",
            classes
        );
    } catch (error) {
        console.error("Error fetching classes:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch classes",
        });
    }
};