// import express from 'express';
// import { loginUser,registerUser } from '../controllers/userController.js';

const express = require('express');
const authMiddleware = require('../middleware/auth.js');
const { loginUser, registerUser, getConfirmationToken, getUserActivity, logoutUser, removeUser, suspendUser, forceLogoutUser } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authMiddleware, logoutUser);
userRouter.get("/activity", getUserActivity); // New route for dashboard activity
userRouter.get("/confirm/:token", getConfirmationToken);
userRouter.post("/remove", removeUser);
userRouter.post("/suspend", suspendUser);
userRouter.post("/force-logout", forceLogoutUser);




// export default userRouter;

module.exports = userRouter;