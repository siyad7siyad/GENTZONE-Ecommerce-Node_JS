// require("dotenv").config()

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = require("twilio")(accountSid, authToken);
// const verifySid = process.env.TWILIO_VERIFY;
// const sendMessage = async(mobile)=>{
//   try {
    
//     const data = await client.verify.v2
//     .services(verifySid)
//   .verifications.create({ to: `+91${mobile}`, channel: "sms" })
  
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// const verifyCode = async(mobileNumber,code)=>{
  
//   try {
//     const verification = await client.verify.v2
//   .services(verifySid)
//         .verificationChecks.create({ to: `+91${mobileNumber}`, code: code })

//         if(verification.status === "approved"){
//           console.log("verification successful");
//           return true
//         }else{
//           return false
//         }

//   } catch (error) {
//     console.log(error.message);
//     throw new error("failed to verify code")
//   }
  
// }

// module.exports = {
//   sendMessage,
//   verifyCode
// }
