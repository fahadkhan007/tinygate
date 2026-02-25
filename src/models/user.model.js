import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"name is required"],
        trim : true,
        minlength : [3,"name must be at least 3 characters long"],
        maxlength : [30,"name must be at most 30 characters long"]
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique : true,
        trim : true,
        lowercase : true,
        match : [/\S+@\S+\.\S+/,"email is not valid"]
    },
    password : {
        type : String,
        required : [true,"password is required"],
        trim : true,
        minlength : [6,"password must be at least 6 characters long"]
    }
},{ timestamps : true });

export const User = mongoose.model("User",userSchema);


