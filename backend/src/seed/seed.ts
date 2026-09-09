import dotenv from "dotenv";

import { connectDatabase } from "../config/db";

import ClassModel from "../models/Class";
import SubjectModel from "../models/Subject";
import ChapterModel from "../models/Chapter";
import NoteModel from "../models/Note";
import VideoModel from "../models/Video";
import QuestionModel from "../models/Question";

import { classData } from "./data/classes/classData";
import { subjectData } from "./data/subjects/subjectData";
import { validateSeedContent } from "./validation/contentValidator";

import {
    chapterSources,
    noteSources,
    videoSources,
    questionSources,
} from "./seedRegistry";

dotenv.config();

const seedDatabase = async (): Promise<void> => {
    try {
        console.log("Validating seed content...");

        validateSeedContent({
            classData,
            subjectData,
            chapterSources,
            noteSources,
            videoSources,
            questionSources,
        });
        await connectDatabase();

        console.log("Clearing existing data...");

        await QuestionModel.deleteMany({});
        await VideoModel.deleteMany({});
        await NoteModel.deleteMany({});
        await ChapterModel.deleteMany({});
        await SubjectModel.deleteMany({});
        await ClassModel.deleteMany({});

        console.log("Existing data cleared.");

        // --------------------------------------------------
        // CLASSES
        // --------------------------------------------------

        const classes = await ClassModel.insertMany(
            classData
        );

        console.log(
            `Inserted ${classes.length} classes.`
        );

        // --------------------------------------------------
        // SUBJECTS
        // --------------------------------------------------

        const subjectsToInsert = [];

        for (const classItem of classes) {
            for (const subject of subjectData) {
                subjectsToInsert.push({
                    classId: classItem._id,
                    name: subject.name,
                    slug: subject.slug,
                });
            }
        }

        const subjects = await SubjectModel.insertMany(
            subjectsToInsert
        );

        console.log(
            `Inserted ${subjects.length} subjects.`
        );

        // --------------------------------------------------
        // CHAPTERS
        // --------------------------------------------------

        let chapterCount = 0;

        for (const source of chapterSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber === source.classNumber
            );

            if (!classItem) {
                console.warn(
                    `Class ${source.classNumber} not found for chapters.`
                );

                continue;
            }

            for (const subjectSource of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.toString() ===
                        classItem._id.toString() &&
                        item.slug === subjectSource.subjectSlug
                );

                if (!subject) {
                    console.warn(
                        `Subject ${subjectSource.subjectSlug} not found for Class ${source.classNumber}.`
                    );

                    continue;
                }

                const chapters = subjectSource.chapters.map(
                    (chapter) => ({
                        ...chapter,
                        subjectId: subject._id,
                    })
                );

                await ChapterModel.insertMany(chapters);

                chapterCount += chapters.length;
            }
        }

        console.log(
            `Inserted ${chapterCount} chapters.`
        );

        // --------------------------------------------------
        // NOTES
        // --------------------------------------------------

        let noteCount = 0;

        for (const source of noteSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber === source.classNumber
            );

            if (!classItem) {
                console.warn(
                    `Class ${source.classNumber} not found for notes.`
                );

                continue;
            }

            for (const noteSource of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.toString() ===
                        classItem._id.toString() &&
                        item.slug === noteSource.subjectSlug
                );

                if (!subject) {
                    console.warn(
                        `Subject ${noteSource.subjectSlug} not found for notes.`
                    );

                    continue;
                }

                const chapter = await ChapterModel.findOne({
                    subjectId: subject._id,
                    slug: noteSource.chapterSlug,
                });

                if (!chapter) {
                    console.warn(
                        `Chapter ${noteSource.chapterSlug} not found for notes.`
                    );

                    continue;
                }

                const notes = noteSource.notes.map(
                    (note) => ({
                        ...note,
                        chapterId: chapter._id,
                    })
                );

                await NoteModel.insertMany(notes);

                noteCount += notes.length;
            }
        }

        console.log(
            `Inserted ${noteCount} notes.`
        );

        // --------------------------------------------------
        // VIDEOS
        // --------------------------------------------------

        let videoCount = 0;

        for (const source of videoSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber === source.classNumber
            );

            if (!classItem) {
                console.warn(
                    `Class ${source.classNumber} not found for videos.`
                );

                continue;
            }

            for (const videoSource of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.toString() ===
                        classItem._id.toString() &&
                        item.slug === videoSource.subjectSlug
                );

                if (!subject) {
                    console.warn(
                        `Subject ${videoSource.subjectSlug} not found for videos.`
                    );

                    continue;
                }

                const chapter = await ChapterModel.findOne({
                    subjectId: subject._id,
                    slug: videoSource.chapterSlug,
                });

                if (!chapter) {
                    console.warn(
                        `Chapter ${videoSource.chapterSlug} not found for videos.`
                    );

                    continue;
                }

                const videos = videoSource.videos.map(
                    (video) => ({
                        ...video,
                        chapterId: chapter._id,
                    })
                );

                await VideoModel.insertMany(videos);

                videoCount += videos.length;
            }
        }

        console.log(
            `Inserted ${videoCount} videos.`
        );

        // --------------------------------------------------
        // QUESTIONS
        // --------------------------------------------------

        let questionCount = 0;

        for (const source of questionSources) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber === source.classNumber
            );

            if (!classItem) {
                console.warn(
                    `Class ${source.classNumber} not found for questions.`
                );

                continue;
            }

            for (const questionSource of source.data) {
                const subject = subjects.find(
                    (item) =>
                        item.classId.toString() ===
                        classItem._id.toString() &&
                        item.slug ===
                        questionSource.subjectSlug
                );

                if (!subject) {
                    console.warn(
                        `Subject ${questionSource.subjectSlug} not found for questions.`
                    );

                    continue;
                }

                const chapter = await ChapterModel.findOne({
                    subjectId: subject._id,
                    slug: questionSource.chapterSlug,
                });

                if (!chapter) {
                    console.warn(
                        `Chapter ${questionSource.chapterSlug} not found for questions.`
                    );

                    continue;
                }

                const questions =
                    questionSource.questions.map(
                        (question) => ({
                            ...question,
                            chapterId: chapter._id,
                        })
                    );

                await QuestionModel.insertMany(
                    questions
                );

                questionCount += questions.length;
            }
        }

        console.log(
            `Inserted ${questionCount} questions.`
        );

        console.log("");
        console.log("================================");
        console.log("Database seed completed");
        console.log("================================");
        console.log(`Classes:    ${classes.length}`);
        console.log(`Subjects:   ${subjects.length}`);
        console.log(`Chapters:   ${chapterCount}`);
        console.log(`Notes:      ${noteCount}`);
        console.log(`Videos:     ${videoCount}`);
        console.log(`Questions:  ${questionCount}`);
        console.log("================================");
    } catch (error) {
        console.error(
            "Database seed failed:",
            error
        );

        process.exitCode = 1;
    } finally {
        process.exit();
    }
};

seedDatabase();