import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  items: { type: Array, required: true },
  amount: { type: Number, required: true }, // Total amount including everything
  platformFee: { type: Number, default: 0 }, // Platform fee for COD
  shippingFee: { type: Number, default: 0 }, // Shipping fee
  paidAmount: { type: Number, default: 0 }, // Amount already paid (for COD)
  dueAmount: { type: Number, default: 0 }, // Amount due on delivery (for COD)
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  couponCode: { type: String },
  discount: { type: Number },
  date: { type: Number, required: true },
  orderId: { type: String, required: true, unique: true }, // Unique 6-char alphanumeric ID
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  refundStatus: { type: String, enum: ['Not Applicable', 'Pending', 'Issued'], default: 'Not Applicable' }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
