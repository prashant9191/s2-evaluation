const jwt=require("jsonwebtoken");
const {blacklistModel}=require("../model/balacklits.model")
const {userModel}=require("../model/userModel")
require("dotenv").config();

const authenticator=async(req,res,next)=>{
    const Token = req.headers?.authorization?.split(" ")[1]
    
    try {
        if(!Token){
            return res.status(401).send({msg:"Please login first"})
        }
        const blacklist= await blacklistModel.find();
        for(let i=0;i<blacklist.length;i++){
            if(blacklist[i].token==Token){
               return res.status(401).send({msg:"You are blacklisted with this token please login again"})
            }
        }
        const validtoken=await jwt.verify(Token,process.env.token_key);
        const {userid}=validtoken;
        if(!validtoken){
            return res.status(403).send({msg:"Authentication failed , please try again with valid token"})
        }
        // checking if user exists
        const user= await userModel.findById(userid);
        if(!user){
            return res.status(401).send({msg:"user not found"})
        }
        req.user=user;
        next();
    } catch (error) {
        res.status(500).send({msg:"something went wrong",error})
    }
}

module.exports={
    authenticator
}