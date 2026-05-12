# Perceived Stress Scale (PSS-10) React Assessment App

A secure React application for administering the Perceived Stress Scale assessment with Firebase authentication and Netlify Functions backend.

## Features

- User authentication via Firebase
- PSS-10 questionnaire with 10 items
- Real-time score calculation
- Secure submission via Netlify Functions
- Firebase token verification
- Google Sheets integration
- Email notifications

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Firebase Account](https://firebase.google.com/)
- [Netlify Account](https://netlify.com/)
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
   
   Edit `.env` with your Firebase, Google Sheets, and email configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Copy your Firebase configuration to `.env`
4. Download Firebase Admin SDK for use in Netlify Functions

### Netlify Setup

1. Deploy to Netlify
2. Create functions in `/netlify/functions/`
3. Set environment variables in Netlify dashboard
4. Enable Netlify Functions in site settings

### Google Sheets Setup

1. Create a Google Sheet
2. Enable API access
3. Create a service account
4. Share sheet with service account email
5. Store credentials in Netlify Functions (NOT in frontend)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
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
  netlify/
    functions/
```

## Security

- Frontend never exposes secrets
- Firebase token verification in Netlify Functions
- Server-side score recalculation
- Secure email sending via Netlify Functions

## PSS-10 Scoring

- 10 questions, each scored 0-3
- Total score: 0-40
- Categories:
  - 0-10: Low Stress
  - 11-25: Moderate Stress
  - 26-40: High Stress

## License

MIT
