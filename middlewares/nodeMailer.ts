import nodemailer, { Transport, createTransport } from 'nodemailer' ;
import { VerificationCode } from '../types';

// Nodemailer
const sendEmail = async (options:VerificationCode) => {
    
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = createTransport({
    host: `${process.env.EMAIL_HOST}`, // smtp.gmail.com
    port: parseInt(`${process.env.EMAIL_PORT}`), // if secure false port = 587, if true port= 465
    secure: true,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'message From <instgram>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

export default sendEmail;