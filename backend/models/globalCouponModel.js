import mongoose from "mongoose";

const globalCouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  discount: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date
  }
});

const GlobalCoupon = mongoose.model("GlobalCoupon", globalCouponSchema);

export default GlobalCoupon;