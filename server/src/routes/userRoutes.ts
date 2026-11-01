// server/src/routes/userRoutes.ts
import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth.js";
import {
  getProfile,
  submitOnboarding,
  updateProfile,
  getLeaderboard,
  getUserBadges,
  getUserCardCollection,
  updateSettings,
} from "../controllers/userController.js";

const router = Router();

// Profil & Onboarding
router.get("/profile", verifyAuthToken, getProfile);
router.post("/onboarding", verifyAuthToken, submitOnboarding);
router.put("/profile", verifyAuthToken, updateProfile);

// Leaderboard
router.get("/leaderboard", verifyAuthToken, getLeaderboard);

// Badges & Koleksi Kartu
router.get("/badges", verifyAuthToken, getUserBadges);
router.get("/card-collection", verifyAuthToken, getUserCardCollection);

// Settings
router.put("/settings", verifyAuthToken, updateSettings);

export default router;