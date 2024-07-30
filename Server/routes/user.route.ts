import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateUserInfo } from "../Controllers/user.controller";
import { isAutheticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post('/registration',registrationUser);

userRouter.post('/activate-user',activateUser);

userRouter.post('/login-user',loginUser);

userRouter.get('/logout-user',isAutheticated,logoutUser);

userRouter.get('/refresh',updateAccessToken);

userRouter.get("/me", isAutheticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info",isAutheticated, updateUserInfo);

export default userRouter;