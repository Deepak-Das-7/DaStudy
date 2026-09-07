import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "../config/db";

import ClassModel from "../models/Class";
import SubjectModel from "../models/Subject";
import ChapterModel from "../models/Chapter";

import { classData } from "./data/classData";
import { subjectData } from "./data/subjectData";
import { chapterData } from "./data/chapterData";

dotenv.config();

const seedDatabase = async (): Promise<void> => {
    try {
        console.log("Starting database seed...");

        await connectDatabase();

        console.log("Clearing existing data...");

        await ChapterModel.deleteMany({});
        await SubjectModel.deleteMany({});
        await ClassModel.deleteMany({});

        console.log("Seeding classes...");

        const classes = await ClassModel.insertMany(
            classData
        );

        console.log(
            `${classes.length} classes seeded successfully`
        );

        console.log("Seeding subjects...");

        const subjectDocuments = classes.flatMap(
            (classItem) =>
                subjectData.map((subject) => ({
                    classId: classItem._id,
                    name: subject.name,
                    slug: subject.slug,
                }))
        );

        const subjects = await SubjectModel.insertMany(
            subjectDocuments
        );

        console.log(
            `${subjects.length} subjects seeded successfully`
        );

        console.log("Seeding chapters...");

        const chapterDocuments = [];

        for (const chapterGroup of chapterData) {
            const classItem = classes.find(
                (item) =>
                    item.classNumber ===
                    chapterGroup.classNumber
            );

            if (!classItem) {
                console.warn(
                    `Class ${chapterGroup.classNumber} not found. Skipping chapters.`
                );

                continue;
            }

            const subject = subjects.find(
                (item) =>
                    item.classId.toString() ===
                    classItem._id.toString() &&
                    item.slug ===
                    chapterGroup.subjectSlug
            );

            if (!subject) {
                console.warn(
                    `Subject ${chapterGroup.subjectSlug} not found for Class ${chapterGroup.classNumber}.`
                );

                continue;
            }

            for (const chapter of chapterGroup.chapters) {
                chapterDocuments.push({
                    subjectId: subject._id,
                    chapterNumber: chapter.chapterNumber,
                    name: chapter.name,
                    slug: chapter.slug,
                });
            }
        }

        if (chapterDocuments.length > 0) {
            await ChapterModel.insertMany(
                chapterDocuments
            );
        }

        console.log(
            `${chapterDocuments.length} chapters seeded successfully`
        );

        console.log("");
        console.log("Database seed completed successfully.");
        console.log("");

        console.log("Summary:");
        console.log(`Classes: ${classes.length}`);
        console.log(`Subjects: ${subjects.length}`);
        console.log(
            `Chapters: ${chapterDocuments.length}`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error(
            "Database seed failed:",
            error
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();