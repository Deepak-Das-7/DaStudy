import { Router } from "express";

import {
    getQuestions,
} from "../controllers/questionController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("chapterId"),
    getQuestions
);
export default router;