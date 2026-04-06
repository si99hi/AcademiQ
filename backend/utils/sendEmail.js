import nodemailer from "nodemailer";

/**
 * Gmail app passwords: 16 characters, no spaces.
 * Strips spaces (Google shows "xxxx xxxx ...") and accidental quotes from .env.
 */
function normalizeAppPassword(pass) {
  if (!pass || typeof pass !== "string") return "";
  let p = pass.trim().replace(/^["']|["']$/g, "");
  return p.replace(/\s+/g, "");
}

function createTransport() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = normalizeAppPassword(process.env.EMAIL_PASS);

  if (!user || !pass) {
    console.error("sendEmail: missing EMAIL_USER or EMAIL_PASS");
    return null;
  }

  // Explicit SMTP — more predictable than service: "gmail" on cloud hosts.
  // family: 4 forces IPv4; many VPS/containers have broken IPv6 routes to Google SMTP.
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    family: 4,
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 25_000,
    pool: false,
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
}

const sendEmail = async (options) => {
  const transporter = createTransport();
  if (!transporter) return;

  try {
    const mailOptions = {
      from: `"AcademiQ" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`, info.messageId || "");
  } catch (error) {
    console.error("sendEmail failed:", error?.message || error);
    if (error?.response) {
      console.error("SMTP response:", error.response);
    }
    if (error?.code) {
      console.error("SMTP code:", error.code);
    }
    if (error?.command) {
      console.error("SMTP command:", error.command);
    }
  }
};

export default sendEmail;
