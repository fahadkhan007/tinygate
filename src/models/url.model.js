import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true,"user id is required"]
    },
    urlId : {
        type : String,
        required : [true,"url id is required"],
        trim : true,
        unique : true
    },
    originalUrl : {
        type : String,
        required : [true,"original url is required"],
        trim : true,
        match : [/^https?:\/\//,"url is not valid"]
    },
    shortUrl : {
        type : String,
        required : [true,"short url is required"],
        trim : true,
        unique : true
    },
    clicks : {
        type : Number,
        default : 0
    },
    
},{timestamps : true});

export const Url = mongoose.model("Url",urlSchema);