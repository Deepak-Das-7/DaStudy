import { Router } from "express";

import { getNotes } from "../controllers/noteController";

const router = Router();

router.get("/", getNotes);

export default router;