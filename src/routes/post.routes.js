const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
// multer used to handile file uploads in server side and read easly the file from client side and stoore in memory storage 
const multer = require("multer")
const upload=multer({storage:multer.memoryStorage()})
const identifyUser = require("../middlewares/auth.middleware")
/**
 * Post /api/posts[protected]
 * -req.body = {}
 */
/*/api/posts */
// use middleware upload.simgle img file 
postRouter.post("/",upload.single("image"),identifyUser ,postController.createPostController)

postRouter.get("/",identifyUser ,postController.getPostController)

/**
 * GET/api/posts/details/:postid
 * -return an detail about specific post with the id, also check whether the post 
 belongs to the user  that the request come from
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


module.exports = postRouter