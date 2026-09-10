import { Router } from "express";

import { getNotes } from "../controllers/noteController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/",
    validateQueryObjectId("chapterId"),
    asyncHandler(getNotes)
);

export default router;