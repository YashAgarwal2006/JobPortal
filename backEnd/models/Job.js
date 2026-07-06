const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    skillsRequired:{type:[String],default:[]},
    responsibilities:{type:[String],default:[]},
    salary:{type:Number,required:true,min:0},
    experienceLevel:{type:Number,required:true,min:0},
    location:{type:String,required:true,trim:true},
    employmentType:{type:String,enum:{
        values:["fulltime","parttime","internship","contract"]
    },required:true},
    status:{type:String,enum:{
        values:["open","closed"]
    },required:true,default:"open"},
    company:{type:mongoose.Schema.Types.ObjectId,ref:"Company",required:true},
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    workMode:{type:String,enum:{
        values:["remote","hybrid","onsite"]
    },required:true,default:"onsite"}
},{
    timestamps:true
});

module.exports = mongoose.model("Job",JobSchema);