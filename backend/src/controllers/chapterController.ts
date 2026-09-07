import type { Request, Response } from "express";
import mongoose from "mongoose";

import ChapterModel from "../models/Chapter";

export const getChapters = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { subjectId } = req.query;

        const filter: {
            subjectId?: mongoose.Types.ObjectId;
        } = {};

        if (subjectId) {
            if (
                !mongoose.Types.ObjectId.isValid(
                    subjectId.toString()
                )
            ) {
                res.status(400).json({
                    success: false,
                    message: "Invalid subjectId",
                });

                return;
            }

            filter.subjectId = new mongoose.Types.ObjectId(
                subjectId.toString()
            );
        }

        const chapters = await ChapterModel.find(filter)
            .sort({ chapterNumber: 1 })
            .select(
                "subjectId chapterNumber name slug"
            );

        res.status(200).json({
            success: true,
            data: chapters,
        });
    } catch (error) {
        console.error(
            "Error fetching chapters:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch chapters",
        });
    }
};