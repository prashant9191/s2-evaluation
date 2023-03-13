const express=require("express");
const app=express();
require("dotenv").config();
const {connection}= require("./configs/db");
const {authenticator}=require("./middlewares/auth.middleware");
const {userRouter}=require("./routes/userRoutes")
const {productRouter}=require("./routes/productRouts")
app.use(express.json());


app.use("/user",userRouter)
app.use(authenticator);
app.use("/product",productRouter)



app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log(`server running at port ${process.env.port}`)
})