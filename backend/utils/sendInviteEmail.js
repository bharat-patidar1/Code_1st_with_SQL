// utils/email.js
import nodemailer from "nodemailer";

export const sendInviteEmail = async (email, tempPassword) => {
  // Step 1: Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "hotmail", or use custom SMTP
    auth: {
      user: process.env.EMAIL_USER,     // e.g. code1st@gmail.com
      pass: process.env.EMAIL_PASS      // app password (not your real Gmail password)
    }
  });

  // Step 2: Create the email content
  const mailOptions = {
    from: `"Code 1st HealthCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You're invited to Code 1st Healthcare System",
    html: `
      <h2>Welcome to Code 1st Healthcare!</h2>
      <p>You’ve been invited as an <strong>employee</strong>.</p>
      <p>Your temporary password is: <b>${tempPassword}</b></p>
      <p>Please log in and change your password after first login.</p>
      <br/>
      <p>Login page: <a href="https://code-1st-with-sql.onrender.com">Click here</a></p>
      <p>Regards,<br/>Code 1st Team</p>
    `
  };

  // Step 3: Send the email
  await transporter.sendMail(mailOptions);
};
