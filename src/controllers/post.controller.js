const postModel = require("../models/post.model");
const ImageKit = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});
// request handler for creating a new post
// req:request object,res: response object
// req body: contains the data from the client to crate a new post and 
//req file: constains the image file to be uploaded to imagekit

async function createPostController(req, res){
    console.log('createPostController:', {
        headers: req.headers['content-type'],
        body: req.body,
        file: req.file && { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size }
    })

    if (!req.file) {
        return res.status(400).json({
            message: 'No image file uploaded. Use multipart/form-data with field name "image".',
            help: 'Check the request Content-Type and the upload field name.'
        })
    }

    const normalizedBody = Object.fromEntries(
        Object.entries(req.body || {}).map(([key, value]) => [key.trim(), value])
    )

    // user id from the token in the authorization header
    const token = req.cookies.token
    //if token is not provided in the request 
    if(!token){
        return res.status(401).json({
            message:"token not provided , unauthrized access"
        })
    }
     //if token is provided
     let decoded;
     try{
          decoded =jwt.verify(token,process.env.JWT_SECRET)
     }catch(err){
        return res.status(401).json({
            message: "User not authorized to create a post"
        })
     }
    // img file is uploaded to imagekit and the file url is returned in the response
    const file = await imagekit.files.upload({
        file: req.file.buffer,
        fileName: req.file.originalname || 'upload',
        folder: "/posts"
    })

    // create a file post in the database with the file url, caption and user id
    const post = await postModel.create({
        caption: normalizedBody.caption || normalizedBody['caption'] || "",
        imgUrl: file.url,
        user: decoded.id
    })

    res.status(201).json({
        message: "Post Created Successfully",
        post
    })


}

async function getPostController(req,res){
    const token = req.cookies.token

    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message:"Token invalid"
        })
    }
    const userId = decoded.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message : "Posts fetched successfully",
        posts
    })
}


async function getPostDetailsController(req, res) {

    const token =req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access"
        })
    }
    
    let decoded

    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Invalid Token"

        })
    }
    const userId = decoded.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"post not found"
        })
    }

    const isValiduser = post.user === userId
    {
        if(!isValiduser){
            return res.status(403).json({
                message: "Forbidden content."
            })
        }
    }
    return res.status(200).json({
        message: "Post details fetch successfully"
    })
}
module.exports={
    createPostController,
    getPostController,
    getPostDetailsController
}