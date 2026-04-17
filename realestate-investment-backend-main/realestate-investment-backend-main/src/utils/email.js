const nodemailer = require("nodemailer");
const env = require("../config/env");
const { ExternalServiceError } = require("./errors");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.secure,
  auth: env.smtp.user && env.smtp.pass ? { user: env.smtp.user, pass: env.smtp.pass } : undefined
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!to) {
      return;
    }

    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      html,
      text
    });
  } catch (error) {
    throw new ExternalServiceError("email", "Failed to deliver email", {
      metadata: { to, subject, reason: error.message }
    });
  }
};

module.exports = {
  sendEmail
};
