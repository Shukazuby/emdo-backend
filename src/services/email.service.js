const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  // const verificationEmailUrl = `localhost:5000/v1/auth/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, use this token ${token}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const addedUser = async (to, id,) => {
  const subject = `Welcome to Emdo`;
  const details = `email: ${to}

    password: Emdo@2024`;

  const url = `https://emdo/login?id=${id}`;
  const text = `Dear Staff, you have been added as a team manager, click on the link below.
                    ${url}
  `;
  await sendEmail(to, subject, text);
};

// The Employer get this mail when a posted job is applied 
const appliedJobEmail = async (to, title,) => {
  const subject = `${title} Job Applied`;
  const url = `https://job/applied`;
  const text = `Dear Employer, 
  
Your ${title} job post has been applied by an employee.

Click Here to approve or decline ${url}
  `;

  await sendEmail(to, subject, text);
};

// The Employee get this mail when a job application is approved by an employer

const approvedJobEmail = async (to, title,) => {
  const subject = `${title} Job Approved`;
  const url = `https://job/applied`;
  const text = `Dear Employee, 
  
Congratulation, your ${title} job application was approved by the employer.

Click Here to confirm or reject ${url}
  `;

  await sendEmail(to, subject, text);
};

const declinedJobEmail = async (to, title,) => {
  const subject = `${title} Job Approved`;
  const text = `Dear Employee, 
  
Unfortunately, your ${title} job application was declined by the employer.
  `;

  await sendEmail(to, subject, text);
};


// The Employer get this mail when a job is confirmed by an employee
const confirmedJobEmail = async (to, title,) => {
  const subject = `${title} Job Confirmed`;
  const url = `https://employee/info`;
  const text = `Dear Employer, 
  
Your ${title} posted job was confirmed by the employee. Shift starts now.

Click Here to view employee info ${url}
  `;

  await sendEmail(to, subject, text);
};

const rejectedJobEmail = async ( to, title,) => {
  const subject = `${title} Job Confirmed`;
  const url = `https://employee/info`;
  const text = `Dear Employer, 
  
Your ${title} posted job was declined by the employee. 

Click Here to view employee info ${url}
  `;

  await sendEmail(to, subject, text);
};


module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  addedUser,
  approvedJobEmail,
  appliedJobEmail,
  confirmedJobEmail,
  declinedJobEmail,
  rejectedJobEmail
};
