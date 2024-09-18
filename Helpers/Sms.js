
import twilio from "twilio";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

export const SensSms=(otp,number)=>{
   client.messages.create({
      body: `Your login otp is ${otp}`,
      to: number, 
      from: process.env.TWILIO_PHONE_NUMBER  
   })
   .then((message) => console.log(`Message sent with SID: ${message.sid}`))
   .catch((error) => console.error('Error sending message:', error));
}

