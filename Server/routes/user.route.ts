import express from "express";
import { registrationUser } from "../Controllers/user.controller";
const userRouter = express.Router();

userRouter.post('/registration',registrationUser);
export default userRouter;