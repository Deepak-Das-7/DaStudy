import { Router } from "express";

import {
    getChapterById,
    getChapters,
} from "../controllers/chapterController";

const router = Router();

router.get("/", getChapters);

router.get("/:id", getChapterById);

export default router;