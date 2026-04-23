const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const https = require("https");

// ─── Mailchimp Helper ─────────────────────────────────────────────────────────
// Syncs a subscriber to Mailchimp via the Marketing API.
// Requires env vars: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_DC
async function syncToMailchimp({ fullName, email, mobile, countryCode }) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = process.env.MAILCHIMP_DC; // e.g. "us12"

  if (!apiKey || !listId || !dc) {
    console.log("[Mailchimp] Skipped: MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID / MAILCHIMP_DC not set in .env");
    return;
  }

  const payload = JSON.stringify({
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: fullName || "",
      ...(mobile ? { MMERGE7: mobile } : {}),
    },
  });

  const options = {
    hostname: `${dc}.api.mailchimp.com`,
    path: `/3.0/lists/${listId}/members`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
      // Mailchimp ignores the username part; any string + apiKey works
      Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString("base64")}`,
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log(`[Mailchimp] Subscribed: ${email}`);
          } else if (res.statusCode === 400 && parsed.title === "Member Exists") {
            // Already on the list — that's fine
            console.log(`[Mailchimp] Member already exists: ${email}`);
          } else {
            console.warn(`[Mailchimp] Unexpected response (${res.statusCode}):`, parsed.detail || body);
          }
        } catch (_) {
          console.warn("[Mailchimp] Could not parse response:", body);
        }
        resolve();
      });
    });

    req.on("error", (err) => {
      console.error("[Mailchimp] Request error:", err.message);
      resolve(); // Non-blocking — don't fail the subscription
    });

    req.write(payload);
    req.end();
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  const { fullName, email, countryCode, mobile } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: "Please provide both name and email.",
    });
  }

  try {
    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "subscribed") {
        return res.status(400).json({
          success: false,
          message: "You are already subscribed to our newsletter.",
        });
      } else {
        // Re-subscribe
        subscriber.status = "subscribed";
        subscriber.fullName = fullName;
        subscriber.countryCode = countryCode || subscriber.countryCode;
        subscriber.mobile = mobile || subscriber.mobile;
        // Regenerate token
        subscriber.unsubscribeToken = crypto.randomBytes(32).toString("hex");
        await subscriber.save();
      }
    } else {
      // Create new subscriber
      subscriber = await Subscriber.create({
        fullName,
        email,
        countryCode,
        mobile,
      });
    }

    // Sync to Mailchimp (non-blocking)
    syncToMailchimp({
      fullName: subscriber.fullName,
      email: subscriber.email,
      mobile: subscriber.mobile,
      countryCode: subscriber.countryCode,
    }).catch((err) => console.error("[Mailchimp] Sync failed:", err));

    // Send Welcome/Joining Email
    await sendWelcomeEmail(subscriber);

    // Send Notification to Admin
    await sendAdminNotificationEmail(subscriber);

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing.",
    });
  } catch (error) {
    console.error("Subscription Error:", error);
    
    // Check for Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Check for duplicate key errors (if findOne somehow misses it)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email is already subscribed.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while subscribing. Please try again later.",
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   GET /api/newsletter/unsubscribe/:token
// @access  Public
exports.unsubscribe = async (req, res) => {
  const { token } = req.params;

  try {
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired unsubscription link.",
      });
    }

    if (subscriber.status === "unsubscribed") {
      return res.status(200).json({
        success: true,
        message: "You have already been unsubscribed.",
      });
    }

    subscriber.status = "unsubscribed";
    // Clear the token so it can't be reused easily if we want, or keep it.
    // I'll keep it for now but the status is enough.
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed from our newsletter.",
    });
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during unsubscription.",
    });
  }
};

// Helper function to send welcome email
async function sendWelcomeEmail(subscriber) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const unsubscribeLink = `${siteUrl}/unsubscribe?token=${subscriber.unsubscribeToken}`;

  const mailOptions = {
    from: `${process.env.FROM_NAME || "Payana Trails"} <${process.env.SMTP_EMAIL}>`,
    to: subscriber.email,
    subject: "Welcome to Payana Trails Newsletter!",
    html: `
      <div style="font-family: 'Georgia', serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F3EFE9; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; font-style: italic;">Payana Trails</h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="font-size: 24px; margin-bottom: 20px;">Hello ${subscriber.fullName.split(" ")[0]},</h2>
          <p style="font-size: 16px; margin-bottom: 25px;">Thank you for subscribing to our newsletter.</p>
          <p style="font-size: 16px; margin-bottom: 25px;">We look forward to sharing thoughtfully curated journeys and travel stories that inspire you.</p>
          <p style="font-size: 16px; margin-bottom: 40px;">From the winding paths of the Himalayas to the silent temples of Kyoto, we're excited to have you with us on this journey.</p>
          
          <div style="border-top: 1px solid #EFE9E1; padding-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #7A634A;">Warm regards,<br />The Payana Trails Team</p>
          </div>
        </div>
        <div style="background-color: #F3EFE9; padding: 20px; text-align: center; font-size: 12px; color: #7A634A;">
          <p>&copy; ${new Date().getFullYear()} Payana Trails. All rights reserved.</p>
          <p>
            If you'd like to stop receiving these emails, you can 
            <a href="${unsubscribeLink}" style="color: #4A3B2A; text-decoration: underline;">unsubscribe here</a>.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${subscriber.email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // We don't throw here to avoid failing the subscription if email fails
  }
}

// Helper function to send notification to admin
async function sendAdminNotificationEmail(subscriber) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || "Payana Trails"}" <${process.env.SMTP_EMAIL}>`,
    to: "info@payanatrails.com",
    subject: `New Newsletter Subscription: ${subscriber.fullName}`,
    html: `
      <div style="font-family: 'Georgia', serif; color: #4A3B2A; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EFE9E1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4A3B2A; padding: 30px; text-align: center; color: #F3EFE9;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; font-style: italic;">New Newsletter Subscriber</h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-bottom: 25px;">A new user has just subscribed to the newsletter from the website.</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold; width: 40%;">Full Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${subscriber.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;"><a href="mailto:${subscriber.email}" style="color: #4A3B2A;">${subscriber.email}</a></td>
            </tr>
            ${subscriber.mobile ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9; font-weight: bold;">Phone Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F3EFE9;">${subscriber.countryCode || ""} ${subscriber.mobile}</td>
            </tr>` : ""}
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #FDFBF8; border-radius: 8px; border-left: 4px solid #4A3B2A; text-align: center;">
            <p style="margin: 0; font-style: italic; color: #7A634A;">"Another wanderer joins the journey!"</p>
          </div>
        </div>
        <div style="background-color: #F3EFE9; padding: 20px; text-align: center; font-size: 12px; color: #7A634A;">
          <p>&copy; ${new Date().getFullYear()} Payana Trails Admin Notifications</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification email sent for: ${subscriber.email}`);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    // We don't throw here to avoid failing the subscription if email fails
  }
}
