// server/src/routes/userRoutes.ts
import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth.js";
import { getProfile, submitOnboarding } from "../controllers/userController.js";

const router = Router();

router.get("/profile", verifyAuthToken, getProfile);
router.post("/onboarding", verifyAuthToken, submitOnboarding);

export default router;