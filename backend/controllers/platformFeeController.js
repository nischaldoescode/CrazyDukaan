// controllers/platformFeeController.js
import platformFeeModel from "../models/platformFeeModel.js";

const setPlatformFee = async (req, res) => {
  try {
    const { fee } = req.body;
    let existing = await platformFeeModel.findOne();
    if (existing) {
      existing.fee = fee;
      existing.updatedAt = Date.now();
      await existing.save();
    } else {
      await platformFeeModel.create({ fee });
    }
    res.json({ success: true, message: "Platform fee updated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getPlatformFee = async (req, res) => {
  try {
    let feeData = await platformFeeModel.findOne();
    if (!feeData) {
      feeData = await platformFeeModel.create({ fee: 30 }); // default fee
    }
    res.json({ success: true, fee: feeData.fee });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { setPlatformFee, getPlatformFee };
