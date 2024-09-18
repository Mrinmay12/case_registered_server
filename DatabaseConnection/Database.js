import mongoose  from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const uri = process.env.DATABASE_URL 

const connectDB=()=>{
    mongoose.connect(uri,{
        useNewUrlParser:true,
        // useCreateIndex:true,
        useUnifiedTopology:true,
        // useFindAndModify:false
        socketTimeoutMS:30000
    }).then(()=>{
        console.log("Database Connection Successfull");
    }).catch((err)=>{
        console.log("error"+err);
    })
}

export default connectDB