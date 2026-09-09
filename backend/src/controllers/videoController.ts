import type { Request, Response } from "express";
import mongoose from "mongoose";
import VideoModel from "../models/Video";

export const getVideos = async (
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

        const videos = await VideoModel.find({
            chapterId,
            isPublished: true,
        })
            .sort({ order: 1 })
            .select(
                "chapterId title youtubeVideoId channelName language order"
            );

        res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        console.error("Error fetching videos:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch videos",
        });
    }
};