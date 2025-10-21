import transporter from "../config/email.js";
import logger from "../config/logger.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    logger.warn("Email transporter not configured. Skipping email send.", { to, subject });
    return { success: false, message: "Email service not configured" };
  }

  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "Diaspora"} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully", { messageId: info.messageId, to });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error("Email sending failed", { error: error.message, to });
    throw new Error("Email sending failed");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Diaspora!";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to Diaspora, ${name}!</h2>
      <p>We're excited to have you on board.</p>
      <p>Get started by exploring our platform and finding your dream job.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <br>
      <p>Best regards,<br>The Diaspora Team</p>
    </div>
  `;
  const text = `Welcome to Diaspora, ${name}! We're excited to have you on board.`;

  return await sendEmail({ to: email, subject, html, text });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = "Password Reset Request";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Diaspora Team</p>
    </div>
  `;
  const text = `Password reset link: ${resetUrl}. This link will expire in 1 hour.`;

  return await sendEmail({ to: email, subject, html, text });
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const subject = "Verify Your Email Address";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Verify Your Email</h2>
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Diaspora Team</p>
    </div>
  `;
  const text = `Verify your email: ${verificationUrl}. This link will expire in 24 hours.`;

  return await sendEmail({ to: email, subject, html, text });
};
