import express from "express";
import { askAI } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/api/ai/ask",  askAI);

export default router;

