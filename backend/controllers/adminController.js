const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Auth admin & get token
// @route   POST /admin/login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Send OTP to email
// @route   POST /admin/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = otp;
    admin.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Payana Trails Admin - Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email" });
  }
};

// @desc    Reset Password using OTP
// @route   POST /admin/reset-password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!admin)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    admin.password = newPassword;
    admin.resetOtp = undefined;
    admin.resetOtpExpire = undefined;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
