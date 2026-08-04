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
        user: req.user.id
    })

    res.status(201).json({
        message: "Post Created Successfully",
        post
    })


}

async function getPostController(req,res){
    
            //remove


    const userId = req.user.id        

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message : "Posts fetched successfully",
        posts
    })
}


async function getPostDetailsController(req, res) {

      // remove to middleware   
    const userId = req.user.id
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