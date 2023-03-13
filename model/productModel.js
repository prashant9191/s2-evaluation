const mongoose=require("mongoose");
const productsSchema=mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true}  
})
 const productModel=mongoose.model("product",productsSchema);
 module.exports={
    productModel
 }