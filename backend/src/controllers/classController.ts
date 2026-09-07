import type { Request, Response } from "express";
import ClassModel from "../models/Class";

export const getClasses = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const classes = await ClassModel.find()
            .sort({ classNumber: 1 })
            .select("classNumber name");

        res.status(200).json({
            success: true,
            data: classes,
        });
    } catch (error) {
        console.error("Error fetching classes:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch classes",
        });
    }
};