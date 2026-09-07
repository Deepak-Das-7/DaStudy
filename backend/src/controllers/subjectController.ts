import type { Request, Response } from "express";
import mongoose from "mongoose";

import SubjectModel from "../models/Subject";

export const getSubjects = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { classId } = req.query;

        const filter: {
            classId?: mongoose.Types.ObjectId;
        } = {};

        if (classId) {
            if (!mongoose.Types.ObjectId.isValid(classId.toString())) {
                res.status(400).json({
                    success: false,
                    message: "Invalid classId",
                });

                return;
            }

            filter.classId = new mongoose.Types.ObjectId(
                classId.toString()
            );
        }

        const subjects = await SubjectModel.find(filter)
            .sort({ name: 1 })
            .select("classId name slug");

        res.status(200).json({
            success: true,
            data: subjects,
        });
    } catch (error) {
        console.error("Error fetching subjects:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
        });
    }
};