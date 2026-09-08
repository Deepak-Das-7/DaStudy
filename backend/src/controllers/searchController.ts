import type { Request, Response } from "express";

import ClassModel from "../models/Class";
import SubjectModel from "../models/Subject";
import ChapterModel from "../models/Chapter";
import NoteModel from "../models/Note";
import VideoModel from "../models/Video";
import QuestionModel from "../models/Question";

export const searchContent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const query =
            typeof req.query.q === "string"
                ? req.query.q.trim()
                : "";

        if (!query) {
            res.status(400).json({
                success: false,
                message: "Search query is required",
            });

            return;
        }

        if (query.length < 2) {
            res.status(400).json({
                success: false,
                message:
                    "Search query must contain at least 2 characters",
            });

            return;
        }

        const searchRegex = new RegExp(
            query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
        );

        const [
            classes,
            subjects,
            chapters,
            notes,
            videos,
            questions,
        ] = await Promise.all([
            ClassModel.find({
                $or: [
                    { name: searchRegex },
                    {
                        classNumber: Number.isNaN(Number(query))
                            ? -1
                            : Number(query),
                    },
                ],
            })
                .select("classNumber name")
                .limit(10),

            SubjectModel.find({
                $or: [
                    { name: searchRegex },
                    { slug: searchRegex },
                ],
            })
                .populate(
                    "classId",
                    "classNumber name"
                )
                .select("classId name slug")
                .limit(20),

            ChapterModel.find({
                $or: [
                    { name: searchRegex },
                    { slug: searchRegex },
                ],
            })
                .populate(
                    "subjectId",
                    "name slug classId"
                )
                .limit(20),

            NoteModel.find({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                ],
            })
                .populate(
                    "chapterId",
                    "chapterNumber name subjectId"
                )
                .select(
                    "chapterId title content language"
                )
                .limit(20),

            VideoModel.find({
                $or: [
                    { title: searchRegex },
                    { channelName: searchRegex },
                ],
            })
                .populate(
                    "chapterId",
                    "chapterNumber name subjectId"
                )
                .select(
                    "chapterId title youtubeVideoId channelName language"
                )
                .limit(20),

            QuestionModel.find({
                $or: [
                    { question: searchRegex },
                    { explanation: searchRegex },
                    { options: searchRegex },
                ],
            })
                .populate(
                    "chapterId",
                    "chapterNumber name subjectId"
                )
                .select(
                    "chapterId question options explanation"
                )
                .limit(20),
        ]);

        res.status(200).json({
            success: true,
            data: {
                classes,
                subjects,
                chapters,
                notes,
                videos,
                questions,
            },
        });
    } catch (error) {
        console.error(
            "Error searching content:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to search content",
        });
    }
};