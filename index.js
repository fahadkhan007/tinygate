import express from "express";
import { PORT } from "./src/config/env.js";

const app=express();


app.get("/",(req,res)=>{
    res.send("welcome to tiny gate");
});



app.listen(PORT,()=>{
    console.log(`server is running on port http://localhost:${PORT}`);
})