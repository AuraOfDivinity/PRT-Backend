const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const emailTemplate = require('../views/emailTemplate');

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: process.env.SENDGRID_API_KEY
//     }
//   })
// );
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailServices = {
  sendSuccessfulSubmissionEmail: (email, name) => {
    const msg = {
      to: email,
      from: 'services@donut.com',
      subject: 'Proposal Successfully Submitted!',
      html: emailTemplate
    };

    sgMail.send(msg);
  }
};

module.exports = emailServices;
