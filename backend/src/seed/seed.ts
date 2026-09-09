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

import {
    chapterSources,
    noteSources,
    videoSources,
    questionSources,
} from "./seedRegistry";

import { validateSeedContent } from "./validation/contentValidator";

import { seedChapters } from "./seeders/chapterSeeder";
import { seedNotes } from "./seeders/noteSeeder";
import { seedVideos } from "./seeders/videoSeeder";
import { seedQuestions } from "./seeders/questionSeeder";

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

        const classes = await ClassModel.insertMany(
            classData
        );

        console.log(
            `Inserted ${classes.length} classes.`
        );

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

        const subjects =
            await SubjectModel.insertMany(
                subjectsToInsert
            );

        console.log(
            `Inserted ${subjects.length} subjects.`
        );

        const chapterCount =
            await seedChapters(chapterSources);

        console.log(
            `Inserted ${chapterCount} chapters.`
        );

        const noteCount =
            await seedNotes(noteSources);

        console.log(
            `Inserted ${noteCount} notes.`
        );

        const videoCount =
            await seedVideos(videoSources);

        console.log(
            `Inserted ${videoCount} videos.`
        );

        const questionCount =
            await seedQuestions(
                questionSources
            );

        console.log(
            `Inserted ${questionCount} questions.`
        );

        console.log("");
        console.log(
            "================================"
        );
        console.log(
            "Database seed completed"
        );
        console.log(
            "================================"
        );

        console.log(
            `Classes:    ${classes.length}`
        );

        console.log(
            `Subjects:   ${subjects.length}`
        );

        console.log(
            `Chapters:   ${chapterCount}`
        );

        console.log(
            `Notes:      ${noteCount}`
        );

        console.log(
            `Videos:     ${videoCount}`
        );

        console.log(
            `Questions:  ${questionCount}`
        );

        console.log(
            "================================"
        );
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