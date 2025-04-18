// controllers/shipmentController.js
import shipmentModel from "../models/shipmentModel.js";

const setShipmentFee = async (req, res) => {
  try {
    const { fee } = req.body;
    let existing = await shipmentModel.findOne();
    if (existing) {
      existing.fee = fee;
      existing.updatedAt = Date.now();
      await existing.save();
    } else {
      await shipmentModel.create({ fee });
    }
    res.json({ success: true, message: "Shipment fee updated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getShipmentFee = async (req, res) => {
  try {
    let feeData = await shipmentModel.findOne();

    // Auto create with default if not exists
    if (!feeData) {
      feeData = await shipmentModel.create({ fee: 200 });
    }

    res.json({ success: true, fee: feeData.fee });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { setShipmentFee, getShipmentFee };