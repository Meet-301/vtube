import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   secure: false,
   auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMIP_PASSWORD,
   },
});

const sendEmail = async ({ to, subject, html }) => {
   const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to,
      subject,
      html,
   });

   return info;
};

export default sendEmail;
