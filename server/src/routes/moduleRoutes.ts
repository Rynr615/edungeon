// server/src/routes/moduleRoutes.ts
import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth.js";
import { 
  getModulesList, 
  getModuleDetail, 
  completeModuleLesson 
} from "../controllers/moduleController.js";

const router = Router();

router.get("/", verifyAuthToken, getModulesList);
router.get("/:id", verifyAuthToken, getModuleDetail);
router.post("/:id/complete-lesson", verifyAuthToken, completeModuleLesson);

export default router;