const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{
        type:String,
        default:"customer",
        enum:["seller","customer"],
        required:true
    }
})
 const userModel=mongoose.model("user",userSchema);
 module.exports={
    userModel
 }