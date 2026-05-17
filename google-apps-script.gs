// PSS Assessment Google Apps Script
// Stores demographic + assessment data in Google Sheets
// Prevents duplicate submissions by email
// Sends a result email to the participant and a notification email to admin

const SHEET_ID = 'sdf'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1';
const NOTIFICATION_EMAIL = 'sdf@sfs.com';

function doGet(e) {
  try {
    const action = String((e.parameter && e.parameter.action) || '').trim();

    if (action === 'prevalidate' || action === 'checkDuplicate') {
      const email = normalizeEmail(e.parameter.email);
      if (!email) {
        return jsonResponse({
          success: false,
          error: 'Email is required',
        });
      }

      const sheet = getSheet();
      ensureHeaderRow(sheet);

      const existingRow = findSubmissionRowByEmail(sheet, email);

      return jsonResponse({
        success: true,
        canSubmit: existingRow === -1,
        exists: existingRow !== -1,
        message: existingRow === -1
          ? 'Email is eligible to start the survey.'
          : 'A submission already exists for this email address.',
      });
    }

    return jsonResponse({
      success: true,
      message: 'PSS script is live',
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: String(error),
    });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');

    const requiredFields = [
      'fullName',
      'email',
      'age',
      'gender',
      'location',
      'occupation',
      'answers',
      'score',
    ];

    const missingFields = requiredFields.filter(function (field) {
      if (field === 'score') return data[field] === undefined || data[field] === null;
      if (field === 'answers') return !Array.isArray(data.answers);
      return !String(data[field] || '').trim();
    });

    if (missingFields.length > 0) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields',
        missingFields: missingFields,
      });
    }

    const sheet = getSheet();
    ensureHeaderRow(sheet);

    const email = normalizeEmail(data.email);
    const duplicateRow = findSubmissionRowByEmail(sheet, email);

    if (duplicateRow !== -1) {
      return jsonResponse({
        success: false,
        error: 'Duplicate submission',
        code: 'DUPLICATE_EMAIL',
        message: 'A submission already exists for this email address.',
      });
    }

    const score = Number(data.score);
    if (isNaN(score) || score < 0 || score > 40) {
      return jsonResponse({
        success: false,
        error: 'Invalid score',
      });
    }

    const stressLevel = getStressLevel(score);
    const submittedAt = new Date();

    sheet.appendRow([
      submittedAt,
      data.fullName,
      email,
      data.age,
      data.gender,
      data.location,
      data.occupation,
      score,
      stressLevel,
      JSON.stringify(data.answers),
      'Submitted',
    ]);

    const userEmailSent = sendUserEmail({
      fullName: data.fullName,
      userEmail: email,
      score: score,
      stressLevel: stressLevel,
      submittedAt: submittedAt,
    });

    const adminEmailSent = sendAdminNotification({
      fullName: data.fullName,
      userEmail: email,
      age: data.age,
      gender: data.gender,
      location: data.location,
      occupation: data.occupation,
      score: score,
      stressLevel: stressLevel,
      submittedAt: submittedAt,
    });

    return jsonResponse({
      success: true,
      message: 'Assessment submitted successfully',
      score: score,
      stressLevel: stressLevel,
      userEmailSent: userEmailSent,
      adminEmailSent: adminEmailSent,
    });
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return jsonResponse({
      success: false,
      error: String(error),
    });
  }
}

function getSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found: ' + SHEET_NAME);
  }
  return sheet;
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    'Submitted At',
    'Full Name',
    'Email',
    'Age',
    'Gender',
    'Location',
    'Occupation',
    'Score',
    'Stress Level',
    'Answers',
    'Status',
  ]);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function findSubmissionRowByEmail(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues(); // column C = Email

  for (var i = 0; i < values.length; i += 1) {
    if (normalizeEmail(values[i][0]) === email) {
      return i + 2;
    }
  }

  return -1;
}

function getStressLevel(score) {
  if (score <= 13) return 'Low Stress';
  if (score <= 26) return 'Moderate Stress';
  return 'High Stress';
}

function getInterpretation(score) {
  if (score <= 13) {
    return {
      level: 'Low Stress',
      message: 'You are managing stress well. Your perceived stress levels are within healthy ranges.',
      color: '#10b981',
    };
  }

  if (score <= 26) {
    return {
      level: 'Moderate Stress',
      message: 'You are experiencing moderate stress levels. Consider implementing stress-reduction techniques.',
      color: '#f59e0b',
    };
  }

  return {
    level: 'High Stress',
    message: 'You are experiencing high levels of stress. Consider seeking professional support.',
    color: '#ef4444',
  };
}

function sendUserEmail(params) {
  try {
    const interpretation = getInterpretation(params.score);
    const subject = 'Your Stress Assessment Results - Score: ' + params.score + '/40';

    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7f1d1d; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
            .score-box { background-color: ${interpretation.color}; color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0; }
            .score-value { font-size: 48px; font-weight: bold; margin: 10px 0; }
            .interpretation { background: #f9fafb; padding: 20px; border-left: 4px solid ${interpretation.color}; margin: 20px 0; }
            .suggestions { margin: 20px 0; }
            .suggestion-item { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .disclaimer { background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Stress Assessment Results</h1>
              <p>Your personalized stress level assessment</p>
            </div>

            <p>Hello ${escapeHtml(params.fullName)},</p>

            <div class="score-box">
              <div>Your Score</div>
              <div class="score-value">${params.score}</div>
              <div style="font-size: 18px;">${params.stressLevel}</div>
              <div style="font-size: 12px; margin-top: 10px;">out of 40</div>
            </div>

            <div class="interpretation">
              <h3 style="margin-top: 0; color: ${interpretation.color};">${interpretation.level}</h3>
              <p>${interpretation.message}</p>
            </div>

            <div class="suggestions">
              <h3>Recommendations:</h3>
              ${params.score <= 13 ? `
                <div class="suggestion-item">Maintain your current stress management practices</div>
                <div class="suggestion-item">Continue with regular exercise and healthy habits</div>
                <div class="suggestion-item">Keep up with social connections and support systems</div>
              ` : params.score <= 26 ? `
                <div class="suggestion-item">Practice mindfulness or meditation</div>
                <div class="suggestion-item">Prioritize sleep and exercise</div>
                <div class="suggestion-item">Talk to someone you trust about your concerns</div>
                <div class="suggestion-item">Take regular breaks from stressful activities</div>
              ` : `
                <div class="suggestion-item">Consider speaking with a mental health professional</div>
                <div class="suggestion-item">Develop a stress management plan</div>
                <div class="suggestion-item">Prioritize self-care activities</div>
                <div class="suggestion-item">Reach out to support networks or counseling services</div>
              `}
            </div>

            <div class="disclaimer">
              <strong>Disclaimer:</strong> The Perceived Stress Scale (PSS-10) is a self-assessment tool for personal understanding only.
              It is not a diagnostic tool and should not replace professional medical or psychological evaluation.
              If you are experiencing significant stress or mental health concerns, please consult with a qualified healthcare professional.
            </div>

            <div class="footer">
              <p>This assessment was completed on ${params.submittedAt.toLocaleString()}</p>
              <p>Thank you for using our Stress Assessment tool</p>
            </div>
          </div>
        </body>
      </html>
    `;

    GmailApp.sendEmail(params.userEmail, subject, 'Your email client does not support HTML emails.', {
      htmlBody: htmlBody,
    });

    Logger.log('Email sent to user: ' + params.userEmail);
    return true;
  } catch (error) {
    Logger.log('Error sending user email: ' + error.toString());
    return false;
  }
}

function sendAdminNotification(params) {
  try {
    const subject = 'New Assessment Submitted - ' + params.userEmail + ' (' + params.stressLevel + ')';
    const body =
      'New assessment submission:\n\n' +
      'Full Name: ' + params.fullName + '\n' +
      'Email: ' + params.userEmail + '\n' +
      'Age: ' + params.age + '\n' +
      'Gender: ' + params.gender + '\n' +
      'Location: ' + params.location + '\n' +
      'Occupation: ' + params.occupation + '\n' +
      'Score: ' + params.score + '/40\n' +
      'Stress Level: ' + params.stressLevel + '\n' +
      'Date: ' + params.submittedAt.toLocaleString() + '\n\n' +
      'Check your Google Sheet for full details.';

    GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    Logger.log('Notification sent to admin: ' + NOTIFICATION_EMAIL);
    return true;
  } catch (error) {
    Logger.log('Error sending admin notification: ' + error.toString());
    return false;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
