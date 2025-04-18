import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true }, // Store full Date object
  gender: { type: String, required: true },
  cartData: { type: Object, default: {} },
  ipAddress: { type:String, required: true },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
}, { minimize: false });

export default mongoose.model("User", userSchema);
