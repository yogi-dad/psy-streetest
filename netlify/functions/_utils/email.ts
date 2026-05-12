import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export let transporter: nodemailer.Transporter | null = null;

export async function initEmailTransporter(): Promise<void> {
  if (!transporter) {
    const config: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    // Use Netlify functions environment or fall back to env vars
    transporter = nodemailer.createTransport(config);
  }
}

export async function sendResultEmail(
  userEmail: string,
  result: { userId: string; score: number; category: string }
): Promise<boolean> {
  try {
    await initEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@pss-assessment.com',
      to: userEmail,
      subject: 'Your PSS Assessment Results',
      text: generateEmailBody(result),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

function generateEmailBody(result: {
  userId: string;
  score: number;
  category: string;
}): string {
  return `
Hello,

Your Perceived Stress Scale (PSS-10) assessment has been completed.

Your Results:
- Total Score: ${result.score} out of 40
- Category: ${result.category}

Score Interpretation:
- 0-10: Low Stress
- 11-25: Moderate Stress
- 26-40: High Stress

Please note that these results are for informational purposes only and should not be used as a diagnostic tool.

If you have any questions or concerns, please consult with a healthcare professional.

Thank you for using PSS Assessment App.

Best regards,
PSS Assessment Team
  `;
}
