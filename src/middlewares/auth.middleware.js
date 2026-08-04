    const jwt = require("jsonwebtoken")
    async function identifyUser(res, req, next){

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
     req.user = decoded
     next()

    }
    
    module.exports = identifyUser  