import mongoose from "mongoose";
const Schema = mongoose.Schema
const PostSchema = new Schema({
 
    case_no: {
        type: String
    },
    case_tittle: { type: String },
    case_date:{type:String},
    case_end_date:{type:String},
    sdem_name:{type:String},
    case_orders:{type:String},
    case_type:{type:String},
    Operation_name:{type:String},
    case_status:{type:Boolean,default:false},

}, {
    timestamps: true
})

const Post = mongoose.model("Post_details", PostSchema)
export default Post
