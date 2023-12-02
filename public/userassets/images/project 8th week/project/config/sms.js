require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);
const verifyServiceSid = process.env.TWILIO_VERIFY;

const sendMessage = async (mobile) => {
  let randomOTP = Math.floor(Math.random() * 10000);
  try {
    const data = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: `+91${mobile}`,
        channel: "sms", // You can use 'sms' or 'call' depending on how you want to send the verification code.
      });
    console.log(data, "data");
  } catch (error) {
    console.log(error.message);
  }

  return randomOTP;
};

const verifyCode = async (mobileNumber, code) => {
  try {
    console.log("mobileNumber", mobileNumber);
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: `+91${mobileNumber}`,
        code: code,
      });
    console.log(verification, "verification");

    if (verification.status === "approved") {
      // The code is valid, proceed with the sign-up process
      console.log("Verification successful!");
      return true;
      // You can implement your sign-up logic here.
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to verify code");
  }
};

module.exports = {
  sendMessage,
  verifyCode,
};
