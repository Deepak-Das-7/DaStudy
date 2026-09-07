import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "./config/db";
import ClassModel from "./models/Class";
import SubjectModel from "./models/Subject";

dotenv.config();

const subjects = [
    {
        name: "Mathematics",
        slug: "mathematics",
    },
    {
        name: "Science",
        slug: "science",
    },
    {
        name: "English",
        slug: "english",
    },
    {
        name: "Hindi",
        slug: "hindi",
    },
    {
        name: "Social Science",
        slug: "social-science",
    },
];

const seedSubjects = async (): Promise<void> => {
    try {
        await connectDatabase();

        const classes = await ClassModel.find().sort({
            classNumber: 1,
        });

        if (classes.length === 0) {
            throw new Error(
                "No classes found. Run npm run seed:classes first."
            );
        }

        await SubjectModel.deleteMany({});

        const subjectDocuments = classes.flatMap((classItem) =>
            subjects.map((subject) => ({
                classId: classItem._id,
                name: subject.name,
                slug: subject.slug,
            }))
        );

        await SubjectModel.insertMany(subjectDocuments);

        console.log(
            `${subjectDocuments.length} subjects seeded successfully`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed subjects:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedSubjects();