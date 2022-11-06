// import * as nodemailer from 'nodemailer';

// export const sendEmail = async () => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.mail.ru',
//     port: process.env.SMTP_PORT,
//     secure: process.env.SMTP_SECURE,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: 'ekimov_de@mail.ru', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world?', // plain text body
//     html: '<b>Hello world?</b>', // html body
//   });

//   console.log('Message sent: %s', info.messageId);

//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// };
