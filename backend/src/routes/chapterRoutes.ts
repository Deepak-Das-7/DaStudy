import { Router } from "express";

import {
    getChapters,
    getChapterById,
} from "../controllers/chapterController";

import { asyncHandler } from "../middleware/asyncHandler";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";
import { validateObjectId } from "../utils/validateObjectId";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("subjectId"),
    asyncHandler(getChapters)
);

router.get(
    "/:id",
    validateObjectId("id"),
    asyncHandler(getChapterById)
);

export default router;