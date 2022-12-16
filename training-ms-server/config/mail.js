const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "de3043a7f3e8c8",
    pass: "99c7d89a64114c",
  },
});


const sendMail = async (mailOptions) => {
    try {
        const mail = await transport.sendMail(mailOptions);
        console.log("Email sent: ", mail.response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;