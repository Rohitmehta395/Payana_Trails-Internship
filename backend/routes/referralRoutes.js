const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const nodemailer = require("nodemailer");

// @desc    Submit a referral
// @route   POST /api/referrals
// @access  Public
router.post("/", async (req, res) => {
  const {
    referrerName,
    referrerEmail,
    referrerCountryCode,
    referrerPhone,
    friendName,
    friendEmail,
    friendCountryCode,
    friendPhone,
    message
  } = req.body;

  try {
    // 1. Create referral in DB
    const referral = await Referral.create({
      referrerName,
      referrerEmail,
      referrerCountryCode,
      referrerPhone,
      friendName,
      friendEmail,
      friendCountryCode,
      friendPhone,
      message,
    });

    // 2. Setup Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 3. Email to Admin
    const adminMailOptions = {
      from: `"${process.env.FROM_NAME || "Payana Trails"}" <${process.env.SMTP_EMAIL}>`,
      to: "info@payanatrails.com",
      replyTo: referrerEmail,
      subject: `New Referral: ${referrerName} referred ${friendName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #4A3B2A; padding: 30px; text-align: center; color: #F3EFE9;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">New Referral Received</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 25px;">A guest has referred a friend. Here are the details:</p>
            
            <h3 style="color: #4A3B2A; border-bottom: 2px solid #F3EFE9; padding-bottom: 10px;">Referrer Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${referrerName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;"><a href="mailto:${referrerEmail}" style="color: #4A3B2A;">${referrerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Mobile #:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${referrerPhone ? `${referrerCountryCode || ''} ${referrerPhone}` : 'Not provided'}</td>
              </tr>
            </table>

            <h3 style="color: #4A3B2A; border-bottom: 2px solid #F3EFE9; padding-bottom: 10px;">Friend Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold; width: 40%;">Friend's Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${friendName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Friend's Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;"><a href="mailto:${friendEmail}" style="color: #4A3B2A;">${friendEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Friend's Mobile #:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${friendPhone ? `${friendCountryCode || ''} ${friendPhone}` : 'Not provided'}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background-color: #FDFBF8; border-radius: 8px; border-left: 4px solid #4A3B2A;">
              <p style="margin: 0; font-weight: bold; margin-bottom: 10px;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap;">${message || "No message provided."}</p>
            </div>
          </div>
          <div style="background-color: #F3EFE9; padding: 20px; text-align: center; font-size: 12px; color: #7A634A;">
            <p style="margin: 0;">This referral was submitted from the Payana Trails Connect page.</p>
          </div>
        </div>
      `,
    };

    // 4. Email to Guest (Referrer)
    const guestMailOptions = {
      from: `"${process.env.FROM_NAME || "Payana Trails"}" <${process.env.SMTP_EMAIL}>`,
      to: referrerEmail,
      subject: `Thank you for referring ${friendName} to Payana Trails`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #4A3B2A; padding: 30px; text-align: center; color: #F3EFE9;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">A Token of Gratitude</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 25px;">Dear ${referrerName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for sharing the joy of meaningful travel with <strong>${friendName}</strong>.</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">As a gesture of gratitude, you will receive a <strong>Payana Travel Credit</strong> for your next experience once your friend completes their journey with us. Details regarding the credit will be shared with you via email at that time.</p>
            
            <div style="height: 1px; width: 80px; background-color: #4A3B2A; opacity: 0.2; margin: 30px auto;"></div>
            
            <p style="font-size: 16px; margin-bottom: 25px;">We truly value your trust in us and look forward to welcoming your friend on a journey soon.</p>
            
            <p style="margin-top: 30px; font-style: italic;">Warm regards,<br>The Payana Trails Team</p>
          </div>
          <div style="background-color: #F3EFE9; padding: 20px; text-align: center; font-size: 11px; color: #7A634A;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Payana Trails. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(guestMailOptions)
      ]);
    } catch (emailError) {
      console.error("Referral Email sending failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Referral submitted successfully.",
      data: referral,
    });
  } catch (error) {
    console.error("Referral submission error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting your referral. Please try again later.",
    });
  }
});

module.exports = router;
