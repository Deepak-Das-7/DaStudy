import { Router } from "express";

import { getSubjects } from "../controllers/subjectController";
import { validateQueryObjectId } from "../middleware/validateQueryObjectId";

const router = Router();

router.get(
    "/",
    validateQueryObjectId("classId"),
    getSubjects
);
export default router;