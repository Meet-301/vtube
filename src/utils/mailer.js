import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
   },
});

const sendEmail = async ({ to, subject, html }) => {
   const info = await transporter.sendMail({
      from: `Vtube ${process.env.SMTP_MAIL}`,
      to,
      subject,
      html,
   });

   return info;
};

export default sendEmail;
