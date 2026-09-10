import { Router } from "express";

import {
    getSubjects,
} from "../controllers/subjectController";

import { asyncHandler } from "../middleware/asyncHandler";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("classId"),
    asyncHandler(getSubjects)
);

export default router;