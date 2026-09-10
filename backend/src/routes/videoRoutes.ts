import { Router } from "express";

import { getVideos } from "../controllers/videoController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("chapterId"),
    getVideos
);
export default router;