import mongoose from "mongoose";
const UrlSchema = new mongoose.Schema({
   
  url: {
      type: String,
    required: true,

    match: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
    },
 
  });
  
  const Url = mongoose.model('Url', UrlSchema);
  export default Url

