// Creating API 
const express = require("express");
const authController = require("../controllers/auth.controller")
const authRouter = express.Router()

/**
 * POST/API/AUTH/register
 */
authRouter.post('/register', authController.registerController)


/**
 * POST/API/AUTH/login
 */
authRouter.post('/login', authController.loginController)

module.exports = authRouter;