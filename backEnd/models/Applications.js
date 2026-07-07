const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    applicant:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    job:{type:mongoose.Schema.Types.ObjectId,ref:"Job",required:true},
    status:{type:String,enum:{
        values:["pending","shortlisted","accepted","rejected"]
    },default:"under_review"},

},{
    timestamps:true,
});

ApplicationSchema.index(
    {applicant:1,job:1},
    {unique:true}
);
module.exports =  mongoose.model("Application",ApplicationSchema);