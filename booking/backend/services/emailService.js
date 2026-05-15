const nodemailer = require("nodemailer");

// Lazy transporter — only created when actually sending
const getTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return null; // email not configured, skip silently
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
};

exports.sendEmail = async ({ from, to, subject, text, html, attachments = [] }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not configured (GMAIL_USER/GMAIL_PASS missing) — skipping send.");
    return { skipped: true };
  }
  return transporter.sendMail({ from, to, subject, text, html, attachments });
};
