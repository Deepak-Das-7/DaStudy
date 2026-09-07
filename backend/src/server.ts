import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Study App API is running",
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.path}` });
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});