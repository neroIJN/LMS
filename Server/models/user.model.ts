require('dotenv').config();
import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { Mode } from "fs";
import  Jwt  from "jsonwebtoken";


const emailRegxPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    _id: string;
    name: string;
    email: string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    }
    role:string;
    isVerified: boolean;
    courses: Array<{courseID:string}>
    comparePassword:(password:string)=>Promise<boolean>;
    SignAcessToken:() => string;
    SignRefreshToken:() => string;
};

const userSchema:Schema<IUser>= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:{
            validator:function(value:string){
                return emailRegxPattern.test(value);
            },
            message:"please enter a valid email",
        },
        unique:true,
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minlength:[8,"password must be at least 8 characters"],
        select:false,
    },
    avatar:{
        public_id:String,
        url : String,
    },
    role:{
        type:String,
        default: "user",
    },
    isVerified:{
        type:Boolean,
        default:false,

    },
    courses:[
        {
            courseID: String,
        }
    ],


},{timestamps:true});

// Hash password before saving

userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//sign access token

userSchema.methods.SignAcessToken = function() {
    return  Jwt.sign({id: this._id,},process.env.ACCESS_TOKEN || ""); 
};


//sign refresh token

userSchema.methods.SignRefreshToken = function() {
    return  Jwt.sign({id: this._id,},process.env.REFRESH_TOKEN || ""); 
};
 //compare password

//compare password
userSchema.methods.comparePassword = async function (enteredPassword:string): Promise<boolean> {
   
    return await bcrypt.compare(enteredPassword,this.password); 

};

const userModel: Model<IUser> = mongoose.model("User",userSchema);
export default userModel;