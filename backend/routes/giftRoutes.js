const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");
const nodemailer = require("nodemailer");

// Create Gift Submission
router.post("/", async (req, res) => {
  try {
    const gift = new Gift(req.body);
    await gift.save();

    // Send Emails
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const giftDetails = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4A3B2A;">New Gift A Journey Submission</h2>
        <p><strong>Sender:</strong> ${gift.senderName} (${gift.senderEmail}, ${gift.senderPhone || "N/A"})</p>
        <p><strong>Recipient:</strong> ${gift.recipientName} (${gift.recipientEmail}, ${gift.recipientPhone || "N/A"})</p>
        <p><strong>Gift Type:</strong> ${gift.giftType}</p>
        ${gift.giftType === "Journey" ? `<p><strong>Journey Details:</strong> ${gift.journeyDetails}</p>` : `<p><strong>Gift Value:</strong> INR ${gift.giftValue}</p>`}
        <p><strong>Occasion:</strong> ${gift.occasion || "N/A"}</p>
        <p><strong>Personal Message:</strong> ${gift.personalMessage || "N/A"}</p>
      </div>
    `;

    // 1. Email to Admin
    await transporter.sendMail({
      from: `"Payana Trails" <${process.env.SMTP_EMAIL}>`,
      to: "info@payanatrails.com",
      subject: `New Gift Request: ${gift.senderName} for ${gift.recipientName}`,
      html: giftDetails,
    });

    // 2. Email to Guest (Sender)
    await transporter.sendMail({
      from: `"Payana Trails" <${process.env.SMTP_EMAIL}>`,
      to: gift.senderEmail,
      subject: "Your Gift is Being Prepared - Payana Trails",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4A3B2A; text-align: center;">Your Gift is Being Prepared</h2>
          <p>Dear ${gift.senderName},</p>
          <p>Thank you for choosing to Gift a Journey with Payana Trails. We are delighted to help you create a memory that lasts a lifetime for ${gift.recipientName}.</p>
          <p>Our team will carefully curate your gift and share the final details/voucher with you shortly.</p>
          <div style="background: #F3EFE9; padding: 20px; border-radius: 10px; border: 1px solid #4A3B2A10; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #4A3B2A;">Gift Summary:</p>
            <p style="margin: 5px 0;">Recipient: ${gift.recipientName}</p>
            <p style="margin: 5px 0;">Type: ${gift.giftType}</p>
            ${gift.giftType === "Journey" ? `<p style="margin: 5px 0;">Journey: ${gift.journeyDetails}</p>` : `<p style="margin: 5px 0;">Value: INR ${gift.giftValue}</p>`}
          </div>
          <p>Warm regards,</p>
          <p><strong>The Payana Trails Team</strong></p>
        </div>
      `,
    });

    res.status(201).json({ success: true, message: "Gift request submitted successfully." });
  } catch (error) {
    console.error("Gift submission error:", error);
    res.status(500).json({ success: false, message: "Server error during submission." });
  }
});

module.exports = router;
