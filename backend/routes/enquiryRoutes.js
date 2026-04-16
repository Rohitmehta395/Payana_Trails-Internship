const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const nodemailer = require("nodemailer");

// @desc    Submit an enquiry
// @route   POST /api/enquiries
// @access  Public
router.post("/", async (req, res) => {
  const { 
    name, 
    email, 
    countryCode,
    phone, 
    trailName, 
    otherDestination, 
    travelMonth, 
    travelYear, 
    guests, 
    roomPreference, 
    connectMethod, 
    message 
  } = req.body;

  try {
    // 1. Create enquiry in DB
    const enquiry = await Enquiry.create({
      name,
      email,
      countryCode,
      phone,
      trailName,
      otherDestination,
      travelMonth,
      travelYear,
      guests,
      roomPreference,
      connectMethod,
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
      replyTo: email,
      subject: `New Enquiry: ${trailName} - ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #4A3B2A; padding: 30px; text-align: center; color: #F3EFE9;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">New Travel Enquiry</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 25px;">You have received a new enquiry from the website. Here are the details:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;"><a href="mailto:${email}" style="color: #4A3B2A;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Mobile #:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${countryCode} ${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Trail Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${trailName}</td>
              </tr>
              ${trailName === 'Others' ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Other Destination:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${otherDestination}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Preferred Travel Month:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${travelMonth} ${travelYear}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Number of Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${guests}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Room Preference:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${roomPreference}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Preferred Connect:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${connectMethod}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background-color: #FDFBF8; border-radius: 8px; border-left: 4px solid #4A3B2A;">
              <p style="margin: 0; font-weight: bold; margin-bottom: 10px;">Message:</p>
              <p style="margin: 0; white-space: pre-wrap;">${message || "No message provided."}</p>
            </div>
          </div>
          <div style="background-color: #F3EFE9; padding: 20px; text-align: center; font-size: 12px; color: #7A634A;">
            <p style="margin: 0;">This email was generated from the Payana Trails Connect page.</p>
          </div>
        </div>
      `,
    };

    // 4. Email to Guest (Copy)
    const guestMailOptions = {
      from: `"${process.env.FROM_NAME || "Payana Trails"}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Thank you for choosing Payana Trails`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #4A3B2A; padding: 30px; text-align: center; color: #F3EFE9;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">A Journey Awaits</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-bottom: 25px;">Dear ${name},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">We have received your enquiry and truly appreciate your interest in travelling with Payana Trails.</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">We will connect with you shortly to understand your preferences and help curate the right journey.</p>
            
            <div style="h-px w-20 bg-[#4A3B2A]/20 mx-auto mb-8"></div>
            
            <p style="font-size: 14px; color: #7A634A; margin-bottom: 15px; border-bottom: 1px solid #F3EFE9; padding-bottom: 8px;">Summary of your request:</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold; width: 40%;">Trail/Destination:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${trailName}</td>
              </tr>
              ${trailName === 'Others' ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Specific Location:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${otherDestination}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Mobile #:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${countryCode} ${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${travelMonth} ${travelYear}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Guests:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${guests}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Room Preference:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${roomPreference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9; font-weight: bold;">Connect via:</td>
                <td style="padding: 8px 0; border-bottom: 1px dotted #F3EFE9;">${connectMethod || 'eMail'}</td>
              </tr>
            </table>

            ${message ? `
            <div style="margin-top: 25px; padding: 15px; background-color: #FDFBF8; border-radius: 8px; border-left: 3px solid #4A3B2A; font-size: 13px;">
              <p style="margin: 0; font-weight: bold; margin-bottom: 5px; color: #7A634A;">Your Message:</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>` : ''}

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
      console.error("Email sending failed:", emailError);
      // We still return success as the enquiry is saved in DB
    }

    res.status(201).json({
      success: true,
      message: "We have received your enquiry and truly appreciate your interest in travelling with Payana Trails. We will connect with you shortly to understand your preferences and help curate the right journey.",
      data: enquiry,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting your enquiry. Please try again later.",
    });
  }
});

module.exports = router;
