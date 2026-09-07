import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "./config/db";
import ClassModel from "./models/Class";
import SubjectModel from "./models/Subject";
import ChapterModel from "./models/Chapter";

dotenv.config();

const chapters = [
    {
        chapterNumber: 1,
        name: "Knowing Our Numbers",
        slug: "knowing-our-numbers",
    },
    {
        chapterNumber: 2,
        name: "Whole Numbers",
        slug: "whole-numbers",
    },
    {
        chapterNumber: 3,
        name: "Playing with Numbers",
        slug: "playing-with-numbers",
    },
    {
        chapterNumber: 4,
        name: "Basic Geometrical Ideas",
        slug: "basic-geometrical-ideas",
    },
    {
        chapterNumber: 5,
        name: "Understanding Elementary Shapes",
        slug: "understanding-elementary-shapes",
    },
];

const seedChapters = async (): Promise<void> => {
    try {
        await connectDatabase();

        const classSix = await ClassModel.findOne({
            classNumber: 6,
        });

        if (!classSix) {
            throw new Error(
                "Class 6 not found. Run npm run seed:classes first."
            );
        }

        const mathematics = await SubjectModel.findOne({
            classId: classSix._id,
            slug: "mathematics",
        });

        if (!mathematics) {
            throw new Error(
                "Class 6 Mathematics subject not found. Run npm run seed:subjects first."
            );
        }

        await ChapterModel.deleteMany({
            subjectId: mathematics._id,
        });

        const chapterDocuments = chapters.map(
            (chapter) => ({
                subjectId: mathematics._id,
                chapterNumber: chapter.chapterNumber,
                name: chapter.name,
                slug: chapter.slug,
            })
        );

        await ChapterModel.insertMany(
            chapterDocuments
        );

        console.log(
            `${chapterDocuments.length} chapters seeded successfully`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error(
            "Failed to seed chapters:",
            error
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedChapters();