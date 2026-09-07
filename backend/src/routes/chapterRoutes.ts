import { Router } from "express";

import { getChapters } from "../controllers/chapterController";

const router = Router();

router.get("/", getChapters);

export default router;