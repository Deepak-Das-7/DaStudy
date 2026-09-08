import type { Request, Response } from "express";
import mongoose from "mongoose";

import NoteModel from "../models/Note";

export const getNotes = async (
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

        const notes = await NoteModel.find({
            chapterId: new mongoose.Types.ObjectId(chapterId),
        })
            .sort({ createdAt: 1 })
            .select("chapterId title content language");

        res.status(200).json({
            success: true,
            data: notes,
        });
    } catch (error) {
        console.error("Error fetching notes:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
        });
    }
};