const mongoose = require('mongoose')


const postSchema =new mongoose.Schema({
    caption:{
        type: String,
        default: ""
    },
    imgUrl:{
        type: String,
        required: [ true, "ImageUrl is required for creating  an post"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
})