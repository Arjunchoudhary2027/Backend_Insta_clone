const userModel = require("../models/user.model")
const crypto = require('crypto')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

async function registerController (req, res  ){
    const{ email, username, password, bio, profilepic } = req.body
/* another way*/
    // const isUserExistByEmail = await userModel.findOne({ email})
    // if (isUserExistsByEmail){
    //     return resizeBy.status(409).json({
    //         message: "User already exists with this email"
    //     })
    // }
    //  const isUserExistsByUsername = await userModel.fineOne({username})
    //     if(isUserExistsByUsername){
    //         return res.status(409).json({
    //             message : "User already exists with this username"
    //         })
    //     }


    /*same method but simple way of previes one */
    const isUserAlreadyExists =await userModel.findOne({
        $or:[
            { username },
            { email }
        ]
    })
    if (isUserAlreadyExists){
        return res.status(409).json({
            message: "User already exists" + (isUserAlreadyExists.email ==
            email ? "Email already exists" : "Username already exists")
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        bio,
        profilepic,
        password: hash
    })

//Creating token for user
/**
 * - user data will be there 
 * - user data will be unique
 */

const token = jwt.sign(
    {
    id: user._id
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
)
res.cookie("token",token)
res.status(201).json({
    message:"User Registered Successfully",
    user:{
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilepic: user.profilepic
    }
})


}
 async function loginController (req, res){
    const { username,email,password } =req.body

    /**
     * username
     * password
     * 
     * yea phir /or
     * 
     * email
     * password
     */

    const user = await userModel.findOne({

        $or: [
            {
                /**
                 * condition
                 */
                username: username /*undefined */
            },
            {
                /**
                 * condition
                 */
                email: email /* test@test.com */
            }
        ]
    })
    if (!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    /** LOW LEVEL
     *  const hash = crypto.createHash("sha256").update(password).digest('hex')
    const isPasswordValid = hash == user.password
     */
    /**HIGH LEVEL
     * BOTH TWO LINE OF LOW LEVEL IN ONE LINE
     * const isPasswordValid = await bcrypt.compare(password,user.password)
     */
    const isPasswordValid =  await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(401).json({
            message: "password invalid"
        })
    }

    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    )
    res.cookie("token",token)
    res.status(200)
    .json({
        message:"User loggedIn successfully",
        user:{
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilepic: user.profilepic
        }

    })
}

module.exports = {registerController,loginController};