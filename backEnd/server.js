require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const session = require("express-session");

const app = express();
app.use(cors());
//midllewares
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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
app.use("/user",userRoutes);
app.use("/company",companyRoutes);
app.use("/job",jobRoutes);
app.use("/application",applicationRoutes);



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