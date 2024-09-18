import mongoose from "mongoose";
const Schema = mongoose.Schema
const PostOrder = new Schema({
 
  case_id:{type:String},
  user_name:{type:String},
    case_orders:{type:String},
    case_date:{type:String},
    Pdf: {
      data: Buffer,
      contentType: String,
    },

}, {
    timestamps: true
})

const Order = mongoose.model("Post_order", PostOrder)
export default Order
