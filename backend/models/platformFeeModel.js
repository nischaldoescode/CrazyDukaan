// models/platformFeeModel.js
import mongoose from "mongoose";

const platformFeeSchema = new mongoose.Schema({
  fee: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const platformFeeModel = mongoose.model("PlatformFee", platformFeeSchema);
export default platformFeeModel;
