import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initEmailTransporter, sendResultEmail } from './email';

describe('Email Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initEmailTransporter', () => {
    it('initializes transporter with environment variables', async () => {
      const mockTransporter = {
        sendMail: vi.fn().mockResolvedValue({}),
      };
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

      await initEmailTransporter();

      expect(nodemailer.createTransport).toHaveBeenCalled();
    });

    it('reuses existing transporter', async () => {
      const mockTransporter = {
        sendMail: vi.fn().mockResolvedValue({}),
      };
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

      await initEmailTransporter();
      await initEmailTransporter();

      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendResultEmail', () => {
    it('returns true when email is sent successfully', async () => {
      const mockTransporter = {
        sendMail: vi.fn().mockResolvedValue({}),
      };
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

      const result = await sendResultEmail('user@example.com', {
        userId: 'test-uid',
        score: 15,
        category: 'Moderate Stress',
      });

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          subject: 'Your PSS Assessment Results',
        })
      );
    });

    it('returns false when email fails to send', async () => {
      const mockTransporter = {
        sendMail: vi.fn().mockRejectedValue(new Error('SMTP error')),
      };
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

      const result = await sendResultEmail('user@example.com', {
        userId: 'test-uid',
        score: 15,
        category: 'Moderate Stress',
      });

      expect(result).toBe(false);
    });

    it('generates correct email body for high stress result', async () => {
      const mockTransporter = {
        sendMail: vi.fn().mockResolvedValue({}),
      };
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

      await sendResultEmail('user@example.com', {
        userId: 'test-uid',
        score: 35,
        category: 'High Stress',
      });

      const body = mockTransporter.sendMail.mock.calls[0][0].text;
      expect(body).toContain('Your Perceived Stress Scale (PSS-10) assessment has been completed');
      expect(body).toContain('Total Score: 35 out of 40');
      expect(body).toContain('Category: High Stress');
    });
  });
});
