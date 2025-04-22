import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

// global variables
const currency = "inr";

// Generate unique 6-character alphanumeric order ID
const generateOrderId = () => {
  // Create a base-36 random string (contains 0-9 and a-z)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return randomStr;
};

// Razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// COD Razorpay Order
const placeOrder = async (req, res) => {
  try {
    const { TotalFees, platformFee, shippingFee } = req.body;
    // console.log("placeOrder - Request Body:", req.body);

    const uniqueOrderId = generateOrderId();
    // console.log("Generated Unique Order ID:", uniqueOrderId);

    const options = {
      amount: TotalFees * 100, // This is the booking fee amount (platformFee + shippingFee)
      currency: "INR",
      receipt: `rcpt_${uniqueOrderId}`,
    };
    
    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Order Creation Error:", error);
        return res.json({ success: false, message: error });
      }
      // console.log("Razorpay Order Created:", order);
      res.json({ 
        success: true, 
        order, 
        uniqueOrderId 
      });
    });
  } catch (error) {
    console.error("placeOrder - Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// COD Verification
const verifyCODRazorpay = async (req, res) => {
  try {
    console.log("verifyCODRazorpay - Request Body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      TotalFees, // This is the booking fee (platformFee + shippingFee)
      amount, // This is the total order amount
      platformFee = 0,
      shippingFee = 0,
      address,
      couponCode,
      discount,
      uniqueOrderId
    } = req.body;

    const userId = req.body.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("Missing Razorpay payment fields");
      return res.status(400).json({ success: false, message: "Missing required Razorpay payment fields" });
    }

    const key = razorpayInstance.key_secret;
    if (!key) {
      console.error("Razorpay key_secret is undefined");
      return res.status(500).json({ success: false, message: "Server config error: Razorpay secret not set" });
    }

    const generated_signature = crypto
      .createHmac("sha256", key)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn("Invalid Razorpay signature");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // For COD, the paidAmount is the booking fee and dueAmount is the rest
    const paidAmount = TotalFees || 0;
    const dueAmount = (amount || 0) - paidAmount;

    const orderData = {
      orderId: uniqueOrderId || generateOrderId(),
      userId,
      items,
      address,
      amount, // Total order amount
      platformFee,
      shippingFee,
      paidAmount, // Amount paid upfront (booking fee)
      dueAmount, // Amount to be paid on delivery
      TotalFees,
      couponCode,
      discount,
      paymentMethod: "COD",
      payment: false, // COD payment is not completed until delivery
      date: Date.now(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    console.log("Saving Order:", orderData);

    const savedOrder = await new orderModel(orderData).save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully with COD",
      orderId: savedOrder.orderId,
      paidAmount,
      dueAmount
    });
  } catch (err) {
    console.error("verifyCODRazorpay - Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Online Razorpay Order
const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body;
    // console.log("placeOrderRazorpay - Request Body:", req.body);

    const uniqueOrderId = generateOrderId();
    // console.log("Generated Unique Order ID:", uniqueOrderId);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${uniqueOrderId}`,
    };
    
    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Order Creation Error:", error);
        return res.json({ success: false, message: error });
      }
      console.log("Razorpay Order Created:", order);
      res.json({ success: true, order, uniqueOrderId });
    });
  } catch (error) {
    console.error("placeOrderRazorpay - Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay Payment Verification
const verifyRazorpay = async (req, res) => {
  try {
    console.log("verifyRazorpay - Request Body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address,
      couponCode,
      discount,
      uniqueOrderId
    } = req.body;

    const userId = req.body.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("Missing Razorpay payment fields");
      return res.status(400).json({ success: false, message: "Missing required Razorpay payment fields" });
    }

    const key = razorpayInstance.key_secret;
    if (!key) {
      console.error("Razorpay key_secret is undefined");
      return res.status(500).json({ success: false, message: "Server config error: Razorpay secret not set" });
    }

    const generated_signature = crypto
      .createHmac("sha256", key)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn("Invalid Razorpay signature");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const orderData = {
      orderId: uniqueOrderId || generateOrderId(),
      userId,
      items,
      address,
      amount,
      paidAmount: amount, // For Razorpay, all amount is paid upfront
      dueAmount: 0, // No due amount for Razorpay
      couponCode,
      discount,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    console.log("Saving Order:", orderData);

    const savedOrder = await new orderModel(orderData).save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Payment verified, order placed",
      orderId: savedOrder.orderId
    });
  } catch (err) {
    console.error("verifyRazorpay - Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Admin - All Orders
const allOrders = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    let query = {};
    
    // If there's a search query, try to find orders by orderId
    if (searchQuery && searchQuery.trim() !== '') {
      query = { orderId: { $regex: searchQuery, $options: 'i' } };
    }
    
    const orders = await orderModel.find(query);
    // console.log("Fetched Orders with query:", query);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("allOrders - Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// User Order History
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log("Fetching Orders for user:", userId);
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders, userId });
  } catch (error) {
    console.error("userOrders - Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Admin - Update Order Status
const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  console.log("updateStatus - Request Body:", req.body);

  try {
    if (status.toLowerCase() === 'deleted') {
      const deletedOrder = await orderModel.findOneAndDelete({ orderId });
      if (!deletedOrder) {
        console.warn("Order not found to delete");
        return res.status(404).json({ message: 'Order not found' });
      }
      console.log("Order deleted:", orderId);
      return res.status(200).json({ message: 'Order deleted successfully', success: true });
    } else {
      // If order is being cancelled, set refundStatus to 'Issued' if payment was made
      let updateData = { status };
      
      if (status.toLowerCase() === 'cancelled') {
        const order = await orderModel.findOne({ orderId });
        if (order && (order.payment || order.paidAmount > 0)) {
          updateData.refundStatus = 'Issued';
        }
      }
      
      const updatedOrder = await orderModel.findOneAndUpdate(
        { orderId },
        updateData,
        { new: true }
      );
      
      if (!updatedOrder) {
        console.warn("Order not found to update");
        return res.status(404).json({ message: 'Order not found' });
      }
      console.log("Order status updated:", updatedOrder);
      return res.status(200).json({ message: 'Order status updated', success: true, order: updatedOrder });
    }
  } catch (error) {
    console.error("updateStatus - Error:", error.message);
    res.status(500).json({ message: 'Server error', error, success: false });
  }
};

export {
  verifyRazorpay,
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyCODRazorpay
};
