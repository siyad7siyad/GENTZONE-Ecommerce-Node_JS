const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')





const sendVarifyMail = async (req,name, email, user_id) => {
  try {

    const otp = generateOTP(4); 
    req.session.otp = otp;
    req.session.otpGeneratedTime = Date.now();
    const transporter = nodemailer.createTransport({

      host: "smtp.forwardemail.net",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'akashpachol2001@gmail.com',
        pass: 'qlbu fvnt wnes aryc',
      },
    });

    const mailOptions = {
      from: 'akashpachol2001@gmail.com',
      to: email,
      subject: 'For verification purpose',
      html: `<p>Hello ${name}, please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email has been sent:', info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


function generateOTP(length, characters = '0123456789') {
    let otp = '';
  
    // Loop through the desired length to generate each character of the OTP
    for (let i = 0; i < length; i++) {
      // Generate a random index within the length of the character set
      const randomIndex = Math.floor(Math.random() * characters.length);
  
      // Append the character at the random index to the OTP
      otp += characters[randomIndex];
    }
  
    // Return the generated OTP
    return otp;
  }
  


  
  module.exports= {
    generateOTP,
    sendVarifyMail,
    securePassword
  }