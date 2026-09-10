import { Router } from "express";

import { getNotes } from "../controllers/noteController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get("/",
    validateQueryObjectId("chapterId"),
    getNotes);

export default router;