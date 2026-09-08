import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/db";

import classRoutes from "./routes/classRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import chapterRoutes from "./routes/chapterRoutes";
import noteRoutes from "./routes/noteRoutes";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "DaStudy API is running",
    });
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
    });
});

app.use("/api/classes", classRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/chapters", chapterRoutes);

app.use("/api/notes", noteRoutes);


app.use(notFound);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);
    }
};

startServer();