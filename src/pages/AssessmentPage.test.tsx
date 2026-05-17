import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssessmentPage } from './AssessmentPage';

const submitAssessmentToGoogleScript = vi.fn();
const prevalidateAssessmentEmail = vi.fn();

vi.mock('../lib/googleScript', () => ({
  prevalidateAssessmentEmail: (...args: unknown[]) => prevalidateAssessmentEmail(...args),
  submitAssessmentToGoogleScript: (...args: unknown[]) => submitAssessmentToGoogleScript(...args),
}));

describe('AssessmentPage', () => {
  beforeEach(() => {
    submitAssessmentToGoogleScript.mockReset();
    prevalidateAssessmentEmail.mockReset();
    prevalidateAssessmentEmail.mockResolvedValue({ success: true, canSubmit: true, exists: false });
    window.localStorage.clear();
  });

  async function fillValidDemographics(user: ReturnType<typeof userEvent.setup>, email = 'test@example.com') {
    await user.type(screen.getByRole('textbox', { name: /^Full Name/ }), 'Test User');
    await user.type(screen.getByRole('textbox', { name: /^Email/ }), email);
    await user.type(screen.getByRole('spinbutton', { name: /^Age/ }), '29');
    await user.selectOptions(screen.getByRole('combobox', { name: /^Gender/ }), 'Female');
    await user.type(screen.getByRole('textbox', { name: /^Location/ }), 'Mumbai');
    await user.type(screen.getByRole('textbox', { name: /^Employee ID/ }), 'EMP-123');
  }

  async function startSurvey(user: ReturnType<typeof userEvent.setup>, email = 'test@example.com') {
    await fillValidDemographics(user, email);
    await user.click(screen.getByRole('button', { name: 'Start Survey' }));
  }

  it('renders the demographic form on first load', () => {
    render(<AssessmentPage />);

    expect(screen.getByText('Participant Details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Survey' })).toBeDisabled();
  });

  it('shows helper text beneath each field', () => {
    render(<AssessmentPage />);

    expect(screen.getByText('Enter your first and last name as it should appear in the assessment record.')).toBeInTheDocument();
    expect(screen.getByText('Use an active email address. It is used for duplicate checks and result delivery.')).toBeInTheDocument();
    expect(screen.getByText('Enter your age in whole years. Allowed range: 18 to 80.')).toBeInTheDocument();
    expect(screen.getByText('Select the option that best represents you.')).toBeInTheDocument();
    expect(screen.getByText('Enter your current city, region, or country.')).toBeInTheDocument();
    expect(screen.getByText('Enter your employee ID exactly as assigned by your organization.')).toBeInTheDocument();
  });

  it('enables the start button only when the form is valid', async () => {
    render(<AssessmentPage />);
    const user = userEvent.setup();

    const startButton = screen.getByRole('button', { name: 'Start Survey' });
    expect(startButton).toBeDisabled();

    await fillValidDemographics(user);

    expect(startButton).toBeEnabled();
  });

  it('shows field constraints for age and gender', () => {
    render(<AssessmentPage />);

    expect(screen.getByRole('spinbutton', { name: /^Age/ })).toHaveAttribute('min', '18');
    expect(screen.getByRole('spinbutton', { name: /^Age/ })).toHaveAttribute('max', '80');
    expect(screen.getByRole('combobox', { name: /^Gender/ })).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Female' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Male' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Non-binary' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Prefer not to say' })).toBeInTheDocument();
  });

  it('shows live validation for invalid email input', async () => {
    render(<AssessmentPage />);
    const user = userEvent.setup();

    const startButton = screen.getByRole('button', { name: 'Start Survey' });
    await user.type(screen.getByRole('textbox', { name: /^Email/ }), 'not-an-email');
    await user.tab();

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(startButton).toBeDisabled();
    expect(prevalidateAssessmentEmail).not.toHaveBeenCalled();
  });

  it('shows live validation for invalid full name input', async () => {
    render(<AssessmentPage />);
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: /^Full Name/ }), '1234');
    await user.tab();

    expect(screen.getByText('Enter your full name using letters and at least two words.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Survey' })).toBeDisabled();
  });

  it('shows live validation for invalid age input', async () => {
    render(<AssessmentPage />);
    const user = userEvent.setup();

    await user.type(screen.getByRole('spinbutton', { name: /^Age/ }), '17');
    await user.tab();

    expect(screen.getByText('Age must be a whole number between 18 and 80.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Survey' })).toBeDisabled();
    expect(prevalidateAssessmentEmail).not.toHaveBeenCalled();
  });

  it('starts the survey after successful prevalidation', async () => {
    render(<AssessmentPage />);
    const user = userEvent.setup();

    await startSurvey(user);

    expect(prevalidateAssessmentEmail).toHaveBeenCalledWith('test@example.com');
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('blocks a repeated submission returned by prevalidation', async () => {
    prevalidateAssessmentEmail.mockResolvedValue({
      success: true,
      canSubmit: false,
      exists: true,
      message: 'A submission already exists for this email address.',
    });

    render(<AssessmentPage />);
    const user = userEvent.setup();

    await startSurvey(user);

    expect(screen.getByText('A submission already exists for this email address.')).toBeInTheDocument();
    expect(screen.queryByText('Question 1 of 10')).not.toBeInTheDocument();
  });

  it('blocks a repeated submission already cached on this device', async () => {
    window.localStorage.setItem('pss-submitted-emails', JSON.stringify(['test@example.com']));

    render(<AssessmentPage />);
    const user = userEvent.setup();

    await startSurvey(user);

    expect(prevalidateAssessmentEmail).not.toHaveBeenCalled();
    expect(screen.getByText('A response has already been submitted with this email address.')).toBeInTheDocument();
  });

  it('submits demographics together with the assessment', async () => {
    submitAssessmentToGoogleScript.mockResolvedValue({ success: true });

    render(<AssessmentPage />);
    const user = userEvent.setup();

    await startSurvey(user);

    for (let index = 0; index < 10; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Sometimes' }));
      const nextButton = screen.queryByRole('button', { name: 'Next' });
      if (nextButton) {
        await user.click(nextButton);
      }
    }

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Assessment Complete')).toBeInTheDocument();
    });

    expect(submitAssessmentToGoogleScript).toHaveBeenCalledWith(
      {
        fullName: 'Test User',
        email: 'test@example.com',
        age: '29',
        gender: 'Female',
        location: 'Mumbai',
        employeeId: 'EMP-123',
      },
      20,
      expect.any(Array)
    );
    expect(JSON.parse(window.localStorage.getItem('pss-submitted-emails') || '[]')).toContain('test@example.com');
  });
});
