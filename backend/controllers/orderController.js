import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";

// global variables
const currency = "inr";

// gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


// Placing orders using COD Method
const placeOrder = async (req, res) => {

  try {

    const { userId, items, amount, address, couponCode, discount } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      couponCode,
      discount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    

      const newOrder = new orderModel(orderData)
      await newOrder.save()

      await userModel.findByIdAndUpdate(userId, { cartData: {} })

      res.json({ success: true, message: "Order Placed" })


  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}
// Create Razorpay Order (no DB save here)
const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address,
      couponCode,
      discount,
    } = req.body;

    // Extract userId from auth middleware
    const userId = req.body.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required Razorpay payment fields" });
    }

    const key = razorpayInstance.key_secret;
    if (!key) {
      return res.status(500).json({
        success: false,
        message: "Server config error: Razorpay secret not set",
      });
    }

    const generated_signature = crypto
      .createHmac("sha256", key)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Save Order
    const orderData = {
      userId,
      items,
      address,
      amount,
      couponCode,
      discount,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };
    

    const savedOrder = await new orderModel(orderData).save();

    // userModel to update cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Payment verified, order placed",
      orderId: savedOrder._id
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Forntend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders, userId});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    if (status === 'Deleted' || status === 'deleted') {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order deleted successfully', success: true });
    } else {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order status updated', success: true, order: updatedOrder });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error, success: false });
  }
};


// export { verifyStripe ,placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus}

export {
  verifyRazorpay,
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};


// Placing orders using Stripe Method
// const placeOrderStripe = async (req, res) => {
//     try {
//       const { userId, items, amount, address } = req.body;
//       const { origin } = req.headers;

//       const line_items = items.map((item) => ({
//         price_data: {
//           currency: currency,
//           product_data: { name: item.name },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       }));

//       line_items.push({
//         price_data: {
//           currency: currency,
//           product_data: { name: 'Delivery Charges' },
//           unit_amount: deliveryCharge * 100,
//         },
//         quantity: 1,
//       });

//       const session = await stripe.checkout.sessions.create({
//         success_url: `${origin}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${origin}/verify?success=false`,
//         line_items,
//         mode: 'payment',
//         metadata: {
//           userId,
//           amount,
//           address: JSON.stringify(address),
//           items: JSON.stringify(items),
//         },
//       });

//       res.json({ success: true, session_url: session.url });
//     } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: error.message });
//     }
//   };

// Verify Stripe
// const verifyStripe = async (req, res) => {
//     const { session_id } = req.body;

//     try {
//       const session = await stripe.checkout.sessions.retrieve(session_id);

//       if (session.payment_status === "paid") {
//         const userId = session.metadata.userId;
//         const amount = session.metadata.amount;
//         const address = JSON.parse(session.metadata.address);
//         const items = JSON.parse(session.metadata.items);

//         const order = new orderModel({
//           userId,
//           items,
//           address,
//           amount,
//           paymentMethod: "Stripe",
//           payment: true,
//           date: Date.now(),
//         });

//         await order.save();
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         res.json({ success: true });
//       } else {
//         res.json({ success: false });
//       }
//     } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: error.message });
//     }
//   };