import type { Request, Response } from "express";
import mongoose from "mongoose";
import NoteModel from "../models/Note";
import { sendSuccess } from "../utils/apiResponse";

export const getNotes = async (
    req: Request,
    res: Response
): Promise<void> => {
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

    const notes = await NoteModel.find({
        chapterId,
        isPublished: true,
    })
        .sort({ order: 1 })
        .select(
            "chapterId title content language order"
        );

    sendSuccess(
        res,
        200,
        "Notes fetched successfully",
        notes
    );
};