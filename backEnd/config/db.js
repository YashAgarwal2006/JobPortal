const mongoose = require("mongoose");

const connectDB=async(uri)=>{
    try{
        const connection = await mongoose.connect(uri);
        console.log("====================================");
        console.log("✅ MongoDB Connected successfully");
        console.log(`Host     : ${mongoose.connection.host}`);
        console.log(`Database : ${mongoose.connection.name}`);
        console.log("====================================");
        return connection;
    }catch(err){
        console.log("====================================");
        console.log("❌Failed to connect to Mongo DB")
        console.log(err);
        console.log("====================================");
        throw err;
    }
};
module.exports = connectDB;