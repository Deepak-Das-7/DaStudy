import type { Request, Response } from "express";
import mongoose from "mongoose";

import QuestionModel from "../models/Question";

export const getQuestions = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { chapterId } = req.query;

        if (!chapterId) {
            res.status(400).json({
                success: false,
                message: "chapterId is required",
            });

            return;
        }

        if (
            typeof chapterId !== "string" ||
            !mongoose.Types.ObjectId.isValid(chapterId)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid chapterId",
            });

            return;
        }

        const questions = await QuestionModel.find({
            chapterId: new mongoose.Types.ObjectId(chapterId),
        })
            .sort({ createdAt: 1 })
            .select(
                "chapterId question options correctAnswer explanation"
            );

        res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        console.error(
            "Error fetching questions:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch questions",
        });
    }
};