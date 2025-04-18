// routes/platformFeeRoutes.js
import express from "express";
import { getPlatformFee, setPlatformFee } from "../controllers/platformFeeController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

router.get("/get-platform-fee", getPlatformFee);
router.post("/set-platform-fee",adminAuth, setPlatformFee);

export default router;
