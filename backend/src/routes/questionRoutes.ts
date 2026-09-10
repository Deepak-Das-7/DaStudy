import { Router } from "express";

import {
    getQuestions,
} from "../controllers/questionController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("chapterId"),
    asyncHandler(getQuestions)
);
export default router;