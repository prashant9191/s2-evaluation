const express=require("express");
const productRouter=express.Router();
const {productModel}=require("../model/productModel");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {authorise}=require("../middlewares/authorise")
productRouter.get("/products",async(req,res)=>{
   try {
    const products= await productModel.find();
    res.status(200).send({msg:"all products",products})
   } catch (error) {
    res.send({msg:"something went wrong",error})
   }
})

productRouter.post("/addproducts",authorise(["seller"]),async(req,res)=>{
    try {
        const product=req.body;
        const newproduct=new productModel(product);
        await newproduct.save();
        res.status(200).send({msg:"product added successfully"})
    } catch (error) {
        res.send({msg:"something went wrong",error})
    }
})

productRouter.delete("/deleteproducts/:id",authorise(["seller"]),async(req,res)=>{
    try {
        const  productid=req.params.id;
     await productModel.findByIdAndDelete(productid)
     res.status(200).send({msg:"Product deleted"})
    } catch (error) {
     res.send({msg:"something went wrong",error})
    }
 })

module.exports={
    productRouter
}