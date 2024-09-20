import mongoose from "mongoose";
const Schema = mongoose.Schema
const CaseHistory = new Schema({
 
  case_id:{type:String},
  user_name:{type:String},
    case_orders:{type:String},
   case_no:{type:String},
   case_tittle:{type:String},
   case_date:{type:String},
   Operation_name:{type:String},
   case_status:{type:Boolean,default:false}

}, {
    timestamps: true
})

const Case_History = mongoose.model("CaseHistory", CaseHistory)
export default Case_History
