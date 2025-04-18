import express from "express";
import {
  getCarouselImages, uploadCarouselImage, deleteCarouselImage
} from "../controllers/FrontHeroController.js";
import upload from "../middleware/multer.js";
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public route to get carousel images
router.get("/images", getCarouselImages);

// Admin routes for carousel management
router.post("/upload-image", adminAuth, upload.single("image"), uploadCarouselImage);
router.delete("/delete-image/:publicId", adminAuth, deleteCarouselImage);

export default router;