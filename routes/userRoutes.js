const express=require("express");
const userRouter=express.Router();
const {userModel}=require("../model/userModel");
const {blacklistModel}=require("../model/balacklits.model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
userRouter.get("/",(req,res)=>{
    res.send("default route")
})
userRouter.post("/signup",async(req,res)=>{
    const {name,email,password,role}=req.body;
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.send({msg:"something went wrong",err:err})
            }else{
                const newuser=new userModel({name,email,password:hash,role})
                await newuser.save();
                res.send({msg:"new user has been registered"})
            }
        })


    } catch (error) {
        res.send({msg:"something went wrong",error})
    }
})

userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const isuserpresent=await userModel.findOne({email});
        if(!isuserpresent){
            return res.send({msg:"user not present in db , please register first"});
        }
        const correctpassword= await bcrypt.compareSync(password,isuserpresent.password);
        if(!correctpassword){
            return res.send({msg:"invalid credentials"})
        }

        const token= await jwt.sign({email,userid:isuserpresent._id,role:isuserpresent.role},process.env.token_key,{expiresIn:"1m"})
        const refreshtoken= await jwt.sign({email,userid:isuserpresent._id,role:isuserpresent.role},process.env.ref_token_key,{expiresIn:"5m"})
        res.send({msg:"Login successful",token,refreshtoken})
    } catch (error) {
        res.send({msg:"something went wrong",error})    
    } 
})

userRouter.get("/logout",async(req,res)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        // const blacklist= await blacklistModel.find()
        const newbalcklist_user=new blacklistModel({token})
        await newbalcklist_user.save();
        res.send({msg:"logout Successfull"})
    } catch (error) {
        res.send({msg:"something went wrong",error}) 
    }
})

userRouter.get("/getnewtoken",async(req,res)=>{
    const refreshToken=req.headers.authorization.split(" ")[1];
    if(!refreshToken) res.send({msg:"plz login again"})

    jwt.verify(refreshToken,process.env.ref_token_key,async(err,decoded)=>{
        if(!decoded){
            res.send({msg:"plz login again",error:err})
        }else{
            const token = await jwt.sign({email:decoded.email,userId:decoded.userId},process.env.token_key,{ expiresIn: "60s" });
            res.send({msg:"Login Successfull and New token genrated successfully",Token:token})
        }
    })
})

module.exports={
    userRouter
}