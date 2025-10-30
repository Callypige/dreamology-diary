import nodemailer from 'nodemailer';
import { verificationEmailTemplate, welcomeEmailTemplate, passwordResetTemplate } from './emailTemplates';

// Create a reusable transporter object using the default SMTP transport
const createTransporter = () => {
  // Validate required environment variables
  const requiredEnvVars = {
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => value === undefined || value === '')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const errorMsg = `❌ SMTP Configuration Error: Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file and ensure all SMTP settings are configured.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
};

class EmailService {
  private transporter;

  constructor() {
    this.transporter = createTransporter();
  }

  async sendVerificationEmail(email: string, token: string, username: string) {
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      const template = verificationEmailTemplate({ username, verificationUrl });

      await this.transporter.sendMail({
        from: `"Dreamology Tools" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`✅ Email de vérification envoyé à ${email}`);
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur envoi email de vérification:', error);
      return { success: false, error };
    }
  }

  async sendWelcomeEmail(email: string, username: string) {
    try {
      const template = welcomeEmailTemplate({ username });

      await this.transporter.sendMail({
        from: `"Dreamology Tools" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`✅ Email de bienvenue envoyé à ${email}`);
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur envoi email de bienvenue:', error);
      return { success: false, error };
    }
  }

  async sendPasswordResetEmail(email: string, token: string, username: string) {
    try {
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
      const template = passwordResetTemplate({ username, resetUrl });

      await this.transporter.sendMail({
        from: `"Dreamology Tools" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`✅ Email de reset password envoyé à ${email}`);
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur envoi email de reset:', error);
      return { success: false, error };
    }
  }

  async sendCustomEmail(to: string, subject: string, html: string, text?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Dreamology Tools" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Fallback to plain text if not provided
      });

      console.log(`✅ Email personnalisé envoyé à ${to}`);
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur envoi email personnalisé:', error);
      return { success: false, error };
    }
  }
}

// Singleton for do no create transporter multiple times
export const emailService = new EmailService();

export const sendVerificationEmail = (email: string, token: string, username: string) => 
  emailService.sendVerificationEmail(email, token, username);

export const sendWelcomeEmail = (email: string, username: string) => 
  emailService.sendWelcomeEmail(email, username);

export const sendPasswordResetEmail = (email: string, token: string, username: string) => 
  emailService.sendPasswordResetEmail(email, token, username);