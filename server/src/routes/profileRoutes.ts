// server/src/routes/profileRoutes.ts
import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  getLeaderboard,
  getUserBadges,
  getUserCardCollection,
  updateSettings,
} from "../controllers/profileController.js";

const router = Router();

// GET /api/profile atau /api/user/profile
router.get("/profile", verifyAuthToken, getProfile);
router.put("/profile", verifyAuthToken, updateProfile);

// GET /api/leaderboard atau /api/user/leaderboard
router.get("/leaderboard", verifyAuthToken, getLeaderboard);

// GET /api/badges atau /api/user/badges
router.get("/badges", verifyAuthToken, getUserBadges);

// GET /api/card-collection atau /api/user/card-collection
router.get("/card-collection", verifyAuthToken, getUserCardCollection);

// PUT /api/settings atau /api/user/settings
router.put("/settings", verifyAuthToken, updateSettings);

export default router;
