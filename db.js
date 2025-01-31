const mongoose=require("mongoose")
require("dotenv").config()

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Atlas Connected")
    }catch(err){
        console.error("MongoDB Connection Error:",err.message)
        process.exit(1)
    }
}

module.exports=connectDB
