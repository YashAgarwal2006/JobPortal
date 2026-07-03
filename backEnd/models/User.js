const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:true},
    role:{type:String,enum:{
        values:["recruiter","candidate"]
    },required:true},
    phoneNumber:{type:String,required:true},
    profilePhoto:{type:String},
    bio : {type:String},
    skills :{type:[String],default:[]},
    resume : {type:String},
    company:{type:moongoose.Schema.Types.ObjectId,ref:"Company"},
},{
    timestamps:true
});

module.exports = mongoose.model("User",UserSchema);
