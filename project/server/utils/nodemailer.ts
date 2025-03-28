import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_GMAIL,
    pass: process.env.NODEMAILER_PASS
  }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const sendAlertEmail = async (to: string, alert: any) => {
  const subject = `Emergency Alert: ${alert.type.toUpperCase()}`;
  const text = `
Emergency Alert Details:
Type: ${alert.type}
Severity: ${alert.severity}
Location: ${alert.location.address}
Description: ${alert.description}
Time: ${alert.timestamp.toLocaleString()}
  `;

  const html = `
    <h2>Emergency Alert: ${alert.type.toUpperCase()}</h2>
    <p><strong>Type:</strong> ${alert.type}</p>
    <p><strong>Severity:</strong> ${alert.severity}</p>
    <p><strong>Location:</strong> ${alert.location.address}</p>
    <p><strong>Description:</strong> ${alert.description}</p>
    <p><strong>Time:</strong> ${alert.timestamp.toLocaleString()}</p>
  `;

  return sendEmail(to, subject, text, html);
}; 