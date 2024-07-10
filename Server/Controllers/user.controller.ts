require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../Utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../Utils/sendMail";
import { error } from "console";
import { sendToken } from "../Utils/jwt";

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email })
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exist", 400))
        };
        const user: IRegistrationBody = {
            name,
            email,
            password
        };

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data)

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your Account",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                scucess: true,
                message: `Please check your emial: ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });

        } catch (error) {
            console.error("Email sending error:", error)
            return next(new ErrorHandler(error.message, 400))
        }

    }
    catch (error: any) {
        console.error("Registration error:", error)
        return next(new ErrorHandler(error.message, 400))
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        user, activationCode
    },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m"
        });
    return { token, activationCode };
}

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;
        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return next(new ErrorHandler("Email already exist", 400));
        }
        const user = await userModel.create({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//login user

interface ILoginBody {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginBody;
        if (!email || !password) {
            return next(new ErrorHandler("Please provide email and password", 400));
        };

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler("Invalid credentials", 400));
        };

        const isPassswordMatch = await user.comparePassword(password);
        if (!isPassswordMatch) {
            return next(new ErrorHandler("Invalid credentials", 400));
        };

        sendToken(user, 200, res);

    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//logout user

export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("token", "", {
            maxAge: 1
        });
        res.status(200).json({
            maxAge: 1
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});