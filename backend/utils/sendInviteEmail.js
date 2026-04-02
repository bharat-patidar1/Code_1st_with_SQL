import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your gmail
    pass: process.env.EMAIL_PASS    // app password (NOT real password)
  }
});

export const sendInviteEmail = async (email, tempPassword) => {
  try {
    await transporter.sendMail({
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
    });

    console.log("Email sent ✅");
  } catch (err) {
    console.error("Email error ❌", err);
  }
};
