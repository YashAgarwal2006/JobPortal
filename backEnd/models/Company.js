const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    companyName: {type:String,default:"My Company",trim:true},
    description:{type:String,default:""},
    website:{type:String,trim:true},
    location:{type:String,trim:true},
    logo:{type:String},
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isActive:{type:Boolean,default:true},

},{
    timestamps:true
});

module.exports = mongoose.model("Company",CompanySchema);