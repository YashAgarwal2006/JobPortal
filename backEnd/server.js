require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");

const app = express();

//midllewares
app.use(express.json());

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge: 3600000        //maxAge = 1hr
    }
}))

app.use("/auth",authRoutes);

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