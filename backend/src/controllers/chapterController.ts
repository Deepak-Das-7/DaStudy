import type { Request, Response } from "express";
import mongoose from "mongoose";
import ChapterModel from "../models/Chapter";

export const getChapters = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { subjectId } = req.query;

        if (subjectId) {
            if (
                typeof subjectId !== "string" ||
                !mongoose.Types.ObjectId.isValid(subjectId)
            ) {
                res.status(400).json({
                    success: false,
                    message: "Invalid subjectId",
                });
                return;
            }
        }

        const filter = subjectId
            ? {
                subjectId: new mongoose.Types.ObjectId(
                    subjectId as string
                ),
                isPublished: true,
            }
            : {
                isPublished: true,
            };

        const chapters = await ChapterModel.find(filter)
            .sort({ chapterNumber: 1 })
            .select(
                "subjectId chapterNumber name slug description language"
            );

        res.status(200).json({
            success: true,
            data: chapters,
        });
    } catch (error) {
        console.error("Error fetching chapters:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch chapters",
        });
    }
};

export const getChapterById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (
            typeof id !== "string" ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid chapterId",
            });
            return;
        }

        const chapter = await ChapterModel.findOne({
            _id: id,
            isPublished: true,
        }).select(
            "subjectId chapterNumber name slug description language"
        );

        if (!chapter) {
            res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: chapter,
        });
    } catch (error) {
        console.error("Error fetching chapter:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch chapter",
        });
    }
};