const authorise=(permittedrole)=>{
    return (req,res,next)=>{
        const userrole=req.user.role;
        if(permittedrole.includes(userrole)){
            next();
        }else{
            res.send({msg:"You are not unauthorised to do this"})
        }
    }
}

module.exports={
    authorise
}