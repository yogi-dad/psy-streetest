import { z } from 'zod';

// Schema for PSS answer
export const pssAnswerSchema = z.object({
  questionId: z.number({
    invalid_type_error: 'Question ID must be a number',
  }),
  answerValue: z.number({
    invalid_type_error: 'Answer value must be a number',
  }),
});

// Schema for PSS submission
export const pssSubmissionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  answers: z.array(pssAnswerSchema).length(10, 'Must have exactly 10 answers'),
  timestamp: z.string().datetime(),
});

// Schema for email request
export const emailRequestSchema = z.object({
  recipient: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
});

export type PssSubmission = z.infer<typeof pssSubmissionSchema>;
export type EmailRequest = z.infer<typeof emailRequestSchema>;

// Helper to validate PSS submission
export function validatePssSubmission(data: any): z.ZodError | null {
  return pssSubmissionSchema.safeParse(data)?.error ?? null;
}

// Helper to validate answer value
export function validateAnswer(answerValue: number): boolean {
  return answerValue >= 0 && answerValue <= 3;
}
