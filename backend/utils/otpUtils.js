import nodemailer from 'nodemailer';

/**
 * Generates a 6-digit OTP code
 * @returns {string} The generated OTP code
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an OTP email to the specified email address
 * @param {string} email - Recipient's email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<void>}
 */
export const sendOtpEmail = async (email, otp) => {
  // Create a nodemailer transporter with GoDaddy SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net', // GoDaddy's outgoing SMTP server
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content with responsive HTML template
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code for CrazyDukaan',
    html: `<div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif;">
<div style="text-align: center; margin-bottom: 20px;">
    <img src="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744657344/pc6yvs6rzxgjc6dqnglg.png" 
         alt="CrazyDukaan Logo" 
         style="max-width: 180px; height: auto;">
</div>

<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px;">
        Welcome to CrazyDukaan!
    </h1>
    <p style="color: #666666; font-size: 16px;">
        You've requested a One-Time Password (OTP) for your account.
    </p>
</div>

<div style="background-color: #FFF9E6; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
    <p style="color: #333333; font-size: 16px; margin-bottom: 15px;">
        Here's your verification code:
    </p>
    <div style="background-color: white; border-radius: 6px; padding: 15px; display: inline-block; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 0 auto;">
        <h2 style="font-size: 32px; letter-spacing: 5px; color: #FF6B00; margin: 0; font-weight: bold;">
            ${otp}
        </h2>
    </div>
    <p style="color: #666666; font-size: 14px; margin-top: 20px;">
        This code is valid for <strong>5 minutes</strong>.
    </p>
</div>

<div style="text-align: center; color: #999999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eeeeee;">
    <p style="margin-bottom: 5px;">If you didn't request this code, please ignore this email.</p>
    <p>© ${new Date().getFullYear()} CrazyDukaan. All rights reserved.</p>
</div>
</div>`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    // console.log('OTP sent successfully to', email);
    return true;
  } catch (error) {
    // console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again later.');
  }
};