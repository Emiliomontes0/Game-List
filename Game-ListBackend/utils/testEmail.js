require('dotenv').config(); // Ensure environment variables are loaded
const { sendEmail } = require('./emailService');

sendEmail(process.env.EMAIL_USER, 'Test Subject', 'This is a test email.')
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error('Error sending email:', error));
