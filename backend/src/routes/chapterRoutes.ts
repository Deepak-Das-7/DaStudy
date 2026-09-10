import { Router } from "express";

import {
    getChapterById,
    getChapters,
} from "../controllers/chapterController";
import { validateObjectId } from "../utils/validateObjectId";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get("/", validateQueryObjectId("subjectId"), getChapters);

router.get(
    "/:id",
    validateObjectId("id"),
    getChapterById
);
export default router;