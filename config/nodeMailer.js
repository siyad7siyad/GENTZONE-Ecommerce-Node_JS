const nodemailer = require('nodemailer');
require("dotenv").config(); // Add the function call here to load environment variables

const sendVarifyMail = async (req, email) => {
  try {
    console.log("fgdgffdf");
    const otp = generateOTP(4);
    req.session.otp = otp;
    console.log(req.session.otp, "otp");

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user:"pigabo40@gmail.com",
        pass: 'wvcvtpuoeqzoghle'
      },
    });

    const mailOptions = {
      from: "pigabo40@gmail.com",
      to: email,
      subject: 'For verification purpose',
      html: `<p>Hello, please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
    };

    const information = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error(error);
  }
};

function generateOTP(length) {
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
}

module.exports = {
  sendVarifyMail,
};