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
        <p><strong>Sender:</strong> ${gift.senderName} (${gift.senderEmail}, ${gift.senderPhone ? ((gift.senderCountryCode || '') + ' ' + gift.senderPhone) : "N/A"}) - Location: ${gift.senderLocation || 'N/A'}</p>
        <p><strong>Recipient:</strong> ${gift.recipientName} (${gift.recipientEmail}, ${gift.recipientPhone ? ((gift.recipientCountryCode || '') + ' ' + gift.recipientPhone) : "N/A"}) - Location: ${gift.recipientLocation || 'N/A'}</p>
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

    // 3. Email to Recipient
    await transporter.sendMail({
      from: `"Payana Trails" <${process.env.SMTP_EMAIL}>`,
      to: gift.recipientEmail,
      subject: `A Special Gift from ${gift.senderName}! 🎁`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #4A3B2A; padding: 30px; text-align: center;">
            <h1 style="color: #F3EFE9; margin: 0; font-size: 24px;">A Beautiful Journey Awaits!</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <p>Dear <strong>${gift.recipientName}</strong>,</p>
            <p>We are thrilled to share some wonderful news! <strong>${gift.senderName}</strong> has chosen a special gift for you through Payana Trails to celebrate <strong>${gift.occasion || 'this special occasion'}</strong>.</p>
            
            <div style="background: #F3EFE9; padding: 20px; border-radius: 10px; border-left: 5px solid #4A3B2A; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #4A3B2A; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Gift Details</p>
              <p style="margin: 5px 0;"><strong>Type:</strong> ${gift.giftType}</p>
              <p style="margin: 5px 0;"><strong>Details:</strong> ${gift.giftType === "Journey" ? gift.journeyDetails : `Travel Credit worth INR ${gift.giftValue}`}</p>
            </div>

            ${gift.personalMessage ? `
            <div style="margin: 25px 0; padding: 20px; background: #fafafa; border-radius: 10px; font-style: italic; color: #555; position: relative;">
              <span style="font-size: 40px; color: #4A3B2A20; position: absolute; top: 10px; left: 10px; line-height: 1;">&ldquo;</span>
              <p style="margin: 0; padding-left: 20px;">${gift.personalMessage}</p>
              <span style="font-size: 40px; color: #4A3B2A20; position: absolute; bottom: -10px; right: 10px; line-height: 1;">&rdquo;</span>
            </div>
            ` : ''}

            <p style="margin-top: 30px;"><strong>What’s Next?</strong></p>
            <p>Our team is currently handcrafting your gift voucher and preparing all the details. We will share the official voucher with <strong>${gift.senderName}</strong> shortly, who will then present it to you.</p>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://payanatrails.com" style="background: #4A3B2A; color: #F3EFE9; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Explore Our Journeys</a>
            </div>
          </div>
          <div style="background: #F3EFE9; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Payana Trails. All rights reserved.</p>
            <p style="margin: 5px 0;">Crafting memories, one trail at a time.</p>
          </div>
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
