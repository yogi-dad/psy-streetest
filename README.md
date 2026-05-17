# Perceived Stress Scale (PSS-10) React Assessment App

A React application for administering the standard PSS-10 assessment with demographic intake and direct Google Apps Script submission.

## Features

- Standard PSS-10 questionnaire with reverse scoring
- Demographic intake before the survey starts
- One-submission-per-email guard on the current device
- Direct submission to Google Apps Script
- Google Sheets integration
- Optional email notifications from the script

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Google Sheets](https://sheets.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   cd pss-assessment-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with `VITE_GOOGLE_APPS_SCRIPT_URL`.

4. **Start development server**
   ```bash
   npm run dev
   ```

### Google Sheets Setup

1. Create a Google Sheet
2. Create and deploy a Google Apps Script web app
3. Connect the script to the target sheet
4. Configure any optional email or reporting logic inside the script
5. Set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test -- --run` - Run tests once

## Project Structure

```text
pss-assessment-app/
  src/
    components/
      auth/
      pss/
      layout/
    constants/
    lib/
    pages/
    types/
```

## Submission Model

- The frontend collects full name, email, age, gender, location, and occupation before the survey starts.
- The browser blocks repeated submissions from the same email on the same device using local storage.
- The frontend sends the demographic and assessment payload directly to a Google Apps Script web app.
- The request uses browser `fetch()` with `no-cors`, so the UI can confirm that the request was sent but cannot inspect the final script response.
- Any sheet writes, duplicate checks across devices, follow-up processing, or emails must happen inside Google Apps Script.

## PSS-10 Scoring

- 10 questions, each scored 0-4
- Questions 4, 5, 7, and 8 are reverse scored
- Total score: 0-40
- Categories:
  - 0-13: Low Stress
  - 14-26: Moderate Stress
  - 27-40: High Stress

## License

MIT
