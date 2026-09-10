import { Router } from "express";

import { getVideos } from "../controllers/videoController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("chapterId"),
    asyncHandler(getVideos)
);
export default router;