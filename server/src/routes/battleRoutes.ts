import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth.js";
import {
  getBattleState,
  startRun,
  getQuestion,
  submitAnswer,
  useSkill,
  selectCard,
} from "../controllers/battleController.js";
const router = Router();
router.use(verifyAuthToken);
router.get("/state", getBattleState);
router.post("/start", startRun);
router.get("/question", getQuestion);
router.post("/answer", submitAnswer);
router.post("/use-skill", useSkill);
router.post("/draft-card", selectCard);
export default router;
