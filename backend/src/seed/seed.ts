import mongoose from "mongoose";
import dotenv from "dotenv";

import ClassModel from "../models/Class";
import SubjectModel from "../models/Subject";
import ChapterModel from "../models/Chapter";
import NoteModel from "../models/Note";
import VideoModel from "../models/Video";
import QuestionModel from "../models/Question";

import { classData } from "./data/classes/classData";
import { subjectData } from "./data/subjects/subjectData";

import { class6ChapterData } from "./data/chapters/class6";
import { class6NoteData } from "./data/notes/class6";
import { class6VideoData } from "./data/videos/class6";
import { class6QuestionData } from "./data/questions/class6";

dotenv.config();

const seedDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected");

        await QuestionModel.deleteMany({});
        await VideoModel.deleteMany({});
        await NoteModel.deleteMany({});
        await ChapterModel.deleteMany({});
        await SubjectModel.deleteMany({});
        await ClassModel.deleteMany({});

        console.log("Existing data cleared");

        // --------------------------------
        // Classes
        // --------------------------------

        const classes =
            await ClassModel.insertMany(classData);

        console.log(
            `Inserted ${classes.length} classes`
        );

        // --------------------------------
        // Subjects
        // --------------------------------

        const subjectsToInsert = classes.flatMap(
            (classItem) =>
                subjectData.map((subject) => ({
                    classId: classItem._id,
                    name: subject.name,
                    slug: subject.slug,
                }))
        );

        const subjects =
            await SubjectModel.insertMany(
                subjectsToInsert
            );

        console.log(
            `Inserted ${subjects.length} subjects`
        );

        // --------------------------------
        // Chapters
        // --------------------------------

        const chapterSources = [
            {
                classNumber: 6,
                data: class6ChapterData,
            },
        ];

        const chaptersToInsert: {
            subjectId: mongoose.Types.ObjectId;
            chapterNumber: number;
            name: string;
            slug: string;
        }[] = [];

        for (const source of chapterSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber ===
                    source.classNumber
            );

            if (!classItem) {
                continue;
            }

            for (const subjectDataItem of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.equals(
                            classItem._id
                        ) &&
                        item.slug ===
                        subjectDataItem.subjectSlug
                );

                if (!subject) {
                    continue;
                }

                for (const chapter of subjectDataItem.chapters) {
                    chaptersToInsert.push({
                        subjectId: subject._id,
                        chapterNumber:
                            chapter.chapterNumber,
                        name: chapter.name,
                        slug: chapter.slug,
                    });
                }
            }
        }

        const chapters =
            await ChapterModel.insertMany(
                chaptersToInsert
            );

        console.log(
            `Inserted ${chapters.length} chapters`
        );

        // --------------------------------
        // Notes
        // --------------------------------

        const noteSources = [
            {
                classNumber: 6,
                data: class6NoteData,
            },
        ];

        const notesToInsert: {
            chapterId: mongoose.Types.ObjectId;
            title: string;
            content: string;
            language: string;
        }[] = [];

        for (const source of noteSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber ===
                    source.classNumber
            );

            if (!classItem) {
                continue;
            }

            for (const subjectDataItem of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.equals(
                            classItem._id
                        ) &&
                        item.slug ===
                        subjectDataItem.subjectSlug
                );

                if (!subject) {
                    continue;
                }

                const chapter = chapters.find(
                    (item) =>
                        item.subjectId.equals(
                            subject._id
                        ) &&
                        item.slug ===
                        subjectDataItem.chapterSlug
                );

                if (!chapter) {
                    continue;
                }

                for (const note of subjectDataItem.notes) {
                    notesToInsert.push({
                        chapterId: chapter._id,
                        title: note.title,
                        content: note.content,
                        language: note.language,
                    });
                }
            }
        }

        const notes =
            await NoteModel.insertMany(
                notesToInsert
            );

        console.log(
            `Inserted ${notes.length} notes`
        );

        // --------------------------------
        // Videos
        // --------------------------------

        const videoSources = [
            {
                classNumber: 6,
                data: class6VideoData,
            },
        ];

        const videosToInsert: {
            chapterId: mongoose.Types.ObjectId;
            title: string;
            youtubeVideoId: string;
            channelName: string;
            language: string;
        }[] = [];

        for (const source of videoSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber ===
                    source.classNumber
            );

            if (!classItem) {
                continue;
            }

            for (const subjectDataItem of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.equals(
                            classItem._id
                        ) &&
                        item.slug ===
                        subjectDataItem.subjectSlug
                );

                if (!subject) {
                    continue;
                }

                const chapter = chapters.find(
                    (item) =>
                        item.subjectId.equals(
                            subject._id
                        ) &&
                        item.slug ===
                        subjectDataItem.chapterSlug
                );

                if (!chapter) {
                    continue;
                }

                for (const video of subjectDataItem.videos) {
                    videosToInsert.push({
                        chapterId: chapter._id,
                        title: video.title,
                        youtubeVideoId:
                            video.youtubeVideoId,
                        channelName:
                            video.channelName,
                        language: video.language,
                    });
                }
            }
        }

        const videos =
            await VideoModel.insertMany(
                videosToInsert
            );

        console.log(
            `Inserted ${videos.length} videos`
        );

        // --------------------------------
        // Questions
        // --------------------------------

        const questionSources = [
            {
                classNumber: 6,
                data: class6QuestionData,
            },
        ];

        const questionsToInsert: {
            chapterId: mongoose.Types.ObjectId;
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
        }[] = [];

        for (const source of questionSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber ===
                    source.classNumber
            );

            if (!classItem) {
                continue;
            }

            for (const subjectDataItem of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.equals(
                            classItem._id
                        ) &&
                        item.slug ===
                        subjectDataItem.subjectSlug
                );

                if (!subject) {
                    continue;
                }

                const chapter = chapters.find(
                    (item) =>
                        item.subjectId.equals(
                            subject._id
                        ) &&
                        item.slug ===
                        subjectDataItem.chapterSlug
                );

                if (!chapter) {
                    continue;
                }

                for (const question of subjectDataItem.questions) {
                    questionsToInsert.push({
                        chapterId: chapter._id,
                        question:
                            question.question,
                        options:
                            question.options,
                        correctAnswer:
                            question.correctAnswer,
                        explanation:
                            question.explanation,
                    });
                }
            }
        }

        const questions =
            await QuestionModel.insertMany(
                questionsToInsert
            );

        console.log(
            `Inserted ${questions.length} questions`
        );

        console.log("");
        console.log(
            "Database seeding completed successfully"
        );
        console.log("");

    } catch (error) {
        console.error(
            "Database seeding failed:",
            error
        );

        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();