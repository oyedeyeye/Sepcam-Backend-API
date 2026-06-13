import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = Number(process.env.EMAIL_PORT) || 465;
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendContactEmail(data: { name: string; phone: string; email: string; message: string }) {
    const receiverEmail = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #011e41; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">New Contact Submission</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333333; line-height: 1.5;">You have received a new message from the Sceptre of Power website contact form.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; width: 100px; color: #555;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #222;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #222;">
                <a href="mailto:${data.email}" style="color: #0d47a1; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #222;">${data.phone || 'N/A'}</td>
            </tr>
          </table>

          <div style="margin-top: 30px;">
            <h3 style="color: #011e41; font-size: 16px; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #444; font-size: 15px; line-height: 1.6; border-left: 4px solid #c42d2d;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          This is an automated message from your website. Do not reply directly to this email address.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"SEPCAM Website" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: `New Contact Request from ${data.name}`,
      replyTo: data.email,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Contact email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw error;
    }
  }
}

export default new EmailService();
