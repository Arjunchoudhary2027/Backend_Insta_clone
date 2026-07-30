const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username already exists"],
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    bio:String, //optional
    profilepic:{
        type:String,
        default:"https://ik.imagekit.io/gbd5plsxi/download.jpg"
    }

})


const UserModel = mongoose.model("users",UserSchema);

module.exports = UserModel;