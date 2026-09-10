import { Router } from "express";

import {
    searchContent,
} from "../controllers/searchController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(searchContent));

export default router;