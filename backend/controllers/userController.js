import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { generateOtp, sendOtpEmail } from "../utils/otpUtils.js";
import axios from "axios";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ========== REGISTER ==========
const registerUser = async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const { firstName, lastName, email, dob, gender, hCaptchaToken } = req.body;

    // hCaptcha verification
if (hCaptchaToken) {
  try {
    const hcaptchaVerifyURL = 'https://hcaptcha.com/siteverify';
    const formData = new URLSearchParams();
    formData.append('secret', process.env.HCAPTCHA_SECRET);
    formData.append('response', hCaptchaToken);
    
    const verifyResponse = await axios.post(hcaptchaVerifyURL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // console.log("Captcha verification response:", verifyResponse.data);
    
    if (!verifyResponse.data.success) {
      return res.status(400).json({ 
        success: false, 
        message: "CAPTCHA verification failed. Please try again." 
      });
    }
  } catch (captchaError) {
    console.error("Error verifying captcha:", captchaError);
    return res.status(500).json({ 
      success: false, 
      message: "Error verifying CAPTCHA. Please try again." 
    });
  }
}

    const name = `${firstName} ${lastName}`;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email. Please try again later." 
      });
    }

    await userModel.create({
      name,
      email,
      dob: new Date(dob), // Browser sends yyyy-mm-dd, so safe to convert directly
      gender,
      ipAddress,
      otp,
      otpExpiry,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// ========== LOGIN ==========
const loginUser = async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const { email, hCaptchaToken } = req.body;
    const bypassEmail = "nischala389@gmail.com";

    if (email === bypassEmail) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    
      const token = createToken(user._id);
      return res.json({
        success: true,
        message: "Test Email, No OTP required.",
        token,
      });
    }
    
// In loginUser and registerUser functions:
if (hCaptchaToken) {
  try {
    const hcaptchaVerifyURL = 'https://hcaptcha.com/siteverify';
    const formData = new URLSearchParams();
    formData.append('secret', process.env.HCAPTCHA_SECRET);
    formData.append('response', hCaptchaToken);
    
    const verifyResponse = await axios.post(hcaptchaVerifyURL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log("Captcha verification response:", verifyResponse.data);
    
    if (!verifyResponse.data.success) {
      return res.status(400).json({ 
        success: false, 
        message: "CAPTCHA verification failed. Please try again." 
      });
    }
  } catch (captchaError) {
    console.error("Error verifying captcha:", captchaError);
    return res.status(500).json({ 
      success: false, 
      message: "Error verifying CAPTCHA. Please try again." 
    });
  }
}

    // Continue with login logic (check if user exists, send OTP, etc.)

    // 🔒 Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "User not found, please register",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    existingUser.ipAddress = ipAddress;
    await existingUser.save();

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email. Please try again later." 
      });
    }

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      success: false, 
      message: 'Your ID has been deleted or rejected, Create a new account' // Fixed typo in "account"
    });
  }
};

// ========== VERIFY OTP ==========
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== GET ALL USERS (ADMIN ONLY) ==========
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { otp: 0, otpExpiry: 0 }); // Exclude OTP fields
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== DELETE USER (ADMIN ONLY) ==========
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== Frontend User's Name ==========
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body; // authUser middleware
    
    const user = await userModel.findById(userId, { name: 1, email: 1 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { registerUser, loginUser, verifyOtp, adminLogin, getAllUsers, deleteUser, getUserProfile };
