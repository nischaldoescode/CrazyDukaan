// routes/shipmentRoutes.js
import express from "express";
import { setShipmentFee, getShipmentFee } from "../controllers/shipmentController.js";
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post("/set-shipment-fee", adminAuth, setShipmentFee);
router.get("/get-shipment-fee", getShipmentFee);

export default router;