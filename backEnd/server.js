require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

const app = express();

//midllewares
app.use(express.json());
app.use(cors());

//test route
app.get("/",(req,res)=>{
    res.send("Job Portal Backend running")
})
const startServer=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log("====================================");
            console.log(`🚀Server running on port ${port}`);
            console.log("====================================");
        })
    }catch(err){
        console.log(err);
        process.exit();
    }
    //Yash2006
}
startServer();