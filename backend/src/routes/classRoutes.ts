import { Router } from "express";
import { getClasses } from "../controllers/classController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getClasses));

export default router;