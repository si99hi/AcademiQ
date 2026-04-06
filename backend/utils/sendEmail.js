import nodemailer from "nodemailer";
import dns from "dns";

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

/** Connect by IPv4 literal so TLS never dials Gmail's IPv6 (Render often breaks IPv6 SMTP). */
async function smtpGmailIPv4Host() {
  const { address } = await dns.promises.lookup("smtp.gmail.com", { family: 4 });
  return address;
}

function baseOpts(user, pass) {
  return {
    auth: { user, pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
    pool: false,
    // When host is an IP, TLS must still present this name for the cert + SNI.
    tls: {
      servername: "smtp.gmail.com",
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  };
}

function transport587(host, user, pass) {
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    requireTLS: true,
    ...baseOpts(user, pass),
  });
}

function transport465(host, user, pass) {
  return nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    ...baseOpts(user, pass),
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

  let host;
  try {
    host = await smtpGmailIPv4Host();
    console.log(`sendEmail: Gmail SMTP via IPv4 ${host}`);
  } catch (e) {
    console.error("sendEmail: IPv4 lookup failed:", e?.message || e);
    return { ok: false, error: "dns_lookup_failed" };
  }

  const mailOptions = {
    from: `"AcademiQ" <${user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const try587 = transport587(host, user, pass);
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

  const try465 = transport465(host, user, pass);
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
