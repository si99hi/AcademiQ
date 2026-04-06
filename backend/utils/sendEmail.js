import nodemailer from "nodemailer";
import dns from "dns";

/** Force IPv4 — avoids ENETUNREACH when Node picks Gmail's IPv6 (common on Render). */
function lookupIPv4(hostname, _options, callback) {
  dns.lookup(hostname, { family: 4, all: false }, callback);
}

/**
 * Gmail app passwords: 16 characters, no spaces.
 * Strips spaces (Google shows "xxxx xxxx ...") and accidental quotes from .env.
 */
function normalizeAppPassword(pass) {
  if (!pass || typeof pass !== "string") return "";
  let p = pass.trim().replace(/^["']|["']$/g, "");
  return p.replace(/\s+/g, "");
}

const TIMEOUT_MS = 45_000;

function baseOpts(user, pass) {
  return {
    auth: { user, pass },
    lookup: lookupIPv4,
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
    pool: false,
  };
}

function transport587(user, pass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    ...baseOpts(user, pass),
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
      servername: "smtp.gmail.com",
    },
  });
}

function transport465(user, pass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    ...baseOpts(user, pass),
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
}

function isConnError(err) {
  const c = err?.code;
  return (
    c === "ETIMEDOUT" ||
    c === "ECONNREFUSED" ||
    c === "ECONNRESET" ||
    c === "ECONNABORTED" ||
    c === "ENOTFOUND" ||
    c === "ENETUNREACH" ||
    c === "ESOCKET"
  );
}

/**
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
const sendEmail = async (options) => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = normalizeAppPassword(process.env.EMAIL_PASS);

  if (!user || !pass) {
    console.error("sendEmail: missing EMAIL_USER or EMAIL_PASS");
    return { ok: false, error: "missing_credentials" };
  }

  const mailOptions = {
    from: `"AcademiQ" <${user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const try587 = transport587(user, pass);
  try {
    const info = await try587.sendMail(mailOptions);
    console.log(`Email sent (587) to ${options.email}`, info.messageId || "");
    return { ok: true };
  } catch (err587) {
    console.error("sendEmail 587 failed:", err587?.message || err587);
    if (!isConnError(err587)) {
      return { ok: false, error: err587?.message || "smtp_failed" };
    }
  }

  const try465 = transport465(user, pass);
  try {
    const info = await try465.sendMail(mailOptions);
    console.log(`Email sent (465) to ${options.email}`, info.messageId || "");
    return { ok: true };
  } catch (err465) {
    console.error("sendEmail 465 failed:", err465?.message || err465);
    return { ok: false, error: err465?.message || "smtp_failed" };
  }
};

export default sendEmail;
