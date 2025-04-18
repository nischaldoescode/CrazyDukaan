import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  fee: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const shipmentModel = mongoose.model("Shipment", shipmentSchema);

export default shipmentModel;