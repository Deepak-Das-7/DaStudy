import type { Request, Response } from "express";
import mongoose from "mongoose";
import VideoModel from "../models/Video";
import { sendSuccess } from "../utils/apiResponse";

export const getVideos = async (
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

    const videos = await VideoModel.find({
        chapterId,
        isPublished: true,
    })
        .sort({ order: 1 })
        .select(
            "chapterId title youtubeVideoId channelName language order"
        );

    sendSuccess(
        res,
        200,
        "Videos fetched successfully",
        videos
    );
};