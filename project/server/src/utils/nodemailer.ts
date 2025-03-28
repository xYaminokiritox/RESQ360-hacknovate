import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Alert } from '../types/alert';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_GMAIL,
    pass: process.env.NODEMAILER_PASS
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<{ success: boolean; messageId?: string; error?: any }> => {
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

export const sendAlertEmail = async (to: string, alert: Alert): Promise<{ success: boolean; messageId?: string; error?: any }> => {
  const subject = `EMERGENCY ALERT: ${alert.type.toUpperCase()}`;
  
  // Create Google Maps link
  const mapsLink = `https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`;
  
  const text = `
⚠️ EMERGENCY ALERT ⚠️

Someone has issued an emergency alert and shared their location with you as a trusted contact.

Alert Details:
Type: ${alert.type}
Severity: ${alert.severity}
Description: ${alert.description}
Time: ${alert.timestamp.toLocaleString()}

Location: ${alert.location.address}
View on map: ${mapsLink}

Please respond appropriately to this emergency situation.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ff0000; border-radius: 10px;">
      <h1 style="color: #ff0000; text-align: center;">⚠️ EMERGENCY ALERT ⚠️</h1>
      
      <p style="font-size: 16px; line-height: 1.5;">
        Someone has issued an emergency alert and shared their location with you as a trusted contact.
      </p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #333;">Alert Details:</h2>
        <p><strong>Type:</strong> ${alert.type}</p>
        <p><strong>Severity:</strong> <span style="color: #ff0000; font-weight: bold;">${alert.severity}</span></p>
        <p><strong>Description:</strong> ${alert.description}</p>
        <p><strong>Time:</strong> ${alert.timestamp.toLocaleString()}</p>
      </div>
      
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #333;">Location:</h2>
        <p>${alert.location.address}</p>
        <p><a href="${mapsLink}" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View on Google Maps</a></p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; font-weight: bold; text-align: center;">
        Please respond appropriately to this emergency situation.
      </p>
    </div>
  `;

  return sendEmail(to, subject, text, html);
}; 