import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.SENDINBLUE_USER,     // your Sendinblue email
    pass: process.env.SENDINBLUE_PASS      // your SMTP master password
  }
});

export const sendInviteEmail = async (email, tempPassword) => {
  await transporter.sendMail({
    from: `"Code 1st HealthCare" <${process.env.SENDINBLUE_USER}>`,
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
  });
};
