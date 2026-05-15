const EmailLog = require("../models/EmailLog");
const { sendEmail } = require("../services/emailService");

exports.sendMail = async (req, res) => {
  const { to, subject, text, html, attachment } = req.body;
  const from = process.env.GMAIL_USER;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "To, subject and body are required." });
  }

  const attachments = [];
  if (attachment && attachment.filename && attachment.content) {
    attachments.push({
      filename: attachment.filename,
      content: Buffer.from(attachment.content, attachment.encoding || "base64"),
      contentType: attachment.contentType || "application/octet-stream",
    });
  }

  const log = new EmailLog({
    from,
    to,
    subject,
    text,
    html,
    attachments: attachments.map(a => ({ filename: a.filename, contentType: a.contentType, size: a.content.length })),
    status: "pending",
  });

  try {
    const info = await sendEmail({ from, to, subject, text, html, attachments });
    log.status = "sent";
    await log.save();
    return res.json({ message: "Email sent successfully.", info });
  } catch (error) {
    log.status = "failed";
    log.error = error.message;
    await log.save();
    return res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
};
