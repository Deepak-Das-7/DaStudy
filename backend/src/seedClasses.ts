import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "./config/db";
import ClassModel from "./models/Class";

dotenv.config();

const classes = [
    { classNumber: 1, name: "Class 1" },
    { classNumber: 2, name: "Class 2" },
    { classNumber: 3, name: "Class 3" },
    { classNumber: 4, name: "Class 4" },
    { classNumber: 5, name: "Class 5" },
    { classNumber: 6, name: "Class 6" },
    { classNumber: 7, name: "Class 7" },
    { classNumber: 8, name: "Class 8" },
    { classNumber: 9, name: "Class 9" },
    { classNumber: 10, name: "Class 10" },
    { classNumber: 11, name: "Class 11" },
    { classNumber: 12, name: "Class 12" },
];

const seedClasses = async (): Promise<void> => {
    try {
        await connectDatabase();

        await ClassModel.deleteMany({});

        await ClassModel.insertMany(classes);

        console.log("Classes seeded successfully");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed classes:", error);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedClasses();