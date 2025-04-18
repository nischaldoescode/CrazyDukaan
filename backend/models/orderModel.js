import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // email: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  couponCode: { type: String },
  discount: { type: Number },
  date: { type: Number, required: true },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
