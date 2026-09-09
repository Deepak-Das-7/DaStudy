import type { Request, Response } from "express";
import mongoose from "mongoose";
import QuestionModel from "../models/Question";
import { sendSuccess } from "../utils/apiResponse";

export const getQuestions = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { chapterId } = req.query;

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
            chapterId,
            isPublished: true,
        })
            .sort({ order: 1 })
            .select(
                "chapterId question options correctAnswer explanation language order"
            );

        sendSuccess(
            res,
            200,
            "Questions fetched successfully",
            questions
        );
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