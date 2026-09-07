import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db";
import classRoutes from "./routes/classRoutes";
import subjectRoutes from "./routes/subjectRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "DaStudy API is running",
    });
});
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();