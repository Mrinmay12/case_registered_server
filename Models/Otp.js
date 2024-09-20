import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: '10m' }, 
  });
  
  const Otp = mongoose.model('Otp', otpSchema);
  export default Otp

