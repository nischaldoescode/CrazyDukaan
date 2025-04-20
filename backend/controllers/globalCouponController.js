import GlobalCoupon from "../models/globalCouponModel.js";
import productModel from "../models/productModel.js";

// Create a global coupon
const createGlobalCoupon = async (req, res) => {
    try {
      
      const { code, discount, expiresAt } = req.body;
      
      if (!code || discount === undefined) {
        // console.log("Validation failed: Missing code or discount");
        return res.json({ success: false, message: "Coupon code and discount are required" });
      }
      
      // Convert code to uppercase and trim for consistency
      const couponCode = code.trim().toUpperCase();
    //   console.log("Processing coupon code:", couponCode);
      
      // Check if this code already exists in product-specific coupons
      // Using regex to make the comparison case-insensitive and handle whitespace
      const existingProductCoupon = await productModel.findOne({
        couponCode: { $regex: `^\\s*${couponCode}\\s*$`, $options: "i" }
      });
      
    //   console.log("Existing product coupon check result:", existingProductCoupon);
      
      if (existingProductCoupon) {
        // console.log("Coupon code already exists in product:", existingProductCoupon._id);
        return res.json({ 
          success: false, 
          message: `This coupon code is already used for the product: ${existingProductCoupon.name}` 
        });
      }
      
      // Check if this code already exists in global coupons
      const existingGlobalCoupon = await GlobalCoupon.findOne({
        code: { $regex: `^\\s*${couponCode}\\s*$`, $options: "i" }
      });
      
      console.log("Existing global coupon check result:", existingGlobalCoupon);
      
      if (existingGlobalCoupon) {
        console.log("Coupon code already exists as global coupon");
        return res.json({ 
          success: false, 
          message: "This global coupon code already exists" 
        });
      }
      
      // Create the new global coupon
      const globalCoupon = new GlobalCoupon({
        code: couponCode,
        discount: Number(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      });
      
      await globalCoupon.save();
      console.log("Global coupon saved successfully");
      
      res.json({ 
        success: true, 
        message: "Global coupon created successfully",
        coupon: globalCoupon
      });
      
    } catch (error) {
      console.error("Error in createGlobalCoupon:", error);
      res.json({ success: false, message: error.message });
    }
  };

// List all global coupons
const listGlobalCoupons = async (req, res) => {
  try {
    const coupons = await GlobalCoupon.find({}).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a global coupon
const deleteGlobalCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.json({ success: false, message: "Coupon ID is required" });
    }
    
    const deletedCoupon = await GlobalCoupon.findByIdAndDelete(id);
    
    if (!deletedCoupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }
    
    res.json({ success: true, message: "Global coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Toggle global coupon status (active/inactive)
const toggleGlobalCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.json({ success: false, message: "Coupon ID is required" });
    }
    
    const coupon = await GlobalCoupon.findById(id);
    
    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }
    
    coupon.active = !coupon.active;
    await coupon.save();
    
    res.json({ 
      success: true, 
      message: `Coupon ${coupon.active ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const checkGlobalCoupon = async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.json({ success: false, message: "Coupon code is required" });
      }
      
      // Convert code to uppercase and trim for consistency
      const couponCode = code.trim().toUpperCase();
      
      // Check if this code exists in global coupons
      const existingGlobalCoupon = await GlobalCoupon.findOne({
        code: { $regex: `^\\s*${couponCode}\\s*$`, $options: "i" }
      });
      
      if (existingGlobalCoupon) {
        return res.json({ 
          success: true, 
          exists: true,
          message: "This coupon code exists in global coupons",
          coupon: {
            code: existingGlobalCoupon.code,
            discount: existingGlobalCoupon.discount,
            active: existingGlobalCoupon.active
          }
        });
      }
      
      res.json({ success: true, exists: false });
      
    } catch (error) {
      console.error("Error in checkGlobalCoupon:", error);
      res.json({ success: false, message: error.message });
    }
  };

export {
  createGlobalCoupon,
  listGlobalCoupons,
  deleteGlobalCoupon,
  toggleGlobalCoupon,
  checkGlobalCoupon
};
