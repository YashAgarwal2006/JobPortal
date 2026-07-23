const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    applicant:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    job:{type:mongoose.Schema.Types.ObjectId,ref:"Job",required:true},
    fullName : {type:String , required:true},
    email : {type:String,required:true},
    phoneNumber : {type:String,required:true},
    bio:{type:String},
    skills :{type:[String],default:[]},
    resume : {type:String},
    status:{type:String,enum:{
        values:["pending","shortlisted","accepted","rejected"]
    },default:"pending"},

},{
    timestamps:true,
});

ApplicationSchema.index(
    {applicant:1,job:1},
    {unique:true}
);
module.exports =  mongoose.model("Application",ApplicationSchema);