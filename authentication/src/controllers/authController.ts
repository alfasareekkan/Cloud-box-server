import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import User, { IUser } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { producer } from "../index";


dotenv.config();

const JWTKEY: string | undefined = process.env.JWTKEY;

export const handleErrors = (err: any) => {
  // err.code is for duplicate exists
  interface errorType {
    email: string, password: string,
    [key: string]: any
  }
  const error : errorType = { email: "", password: "", };
  if (err.code === 11000) {
    error.email = "email already in use";
    return error;
  }
  if (err.message.includes("User validation failed")) {
    // to take values only form object
    Object.values(err.errors).forEach(({ properties }: any) => {
      
      error[properties.path]= properties.message;
    });
  }
  if (err.message === "incorrect email") {
    error.email = "incorrect email";
  }
  if (err.message === "incorrect password") {
    error.password = "incorrect password";
  }
  return error;
};

export const createToken = (result:IUser,time:string) => {
  if (JWTKEY) {
    return jwt.sign(
      {
        UserInfo: {
          username: result.email,
          id: result._id,
        },
      },
      JWTKEY,
      { expiresIn: time }
    );
  }
};
interface resultType extends IUser {
  [x: string]: any;
  _id: ObjectId;
}

export const signUpPost = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password }: IUser = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    const result: resultType = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPwd,
    });
    const user = await result.save()
    // const msg = {
    //   action: 'REGISTER',
    //   data:user
    // }
    // ch.sendToQueue('user_created',Buffer.from(JSON.stringify(user)))
    // producer(JSON.stringify(msg))
    const token = createToken(result,'15s');
    const refresh = createToken(user,'15s');

    res.status(201).json({
      user: {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        profile: result.profile,
        otpVerify: result.otpVerify,
    }, accessToken:token,refreshToken:refresh });
  } catch (err: any) {
    const errors = handleErrors(err);

    res.status(400).json({ errors});
  }
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user =await User.login(email, password)
      
    const token = createToken(user,'7d');
    const refresh = createToken(user,'15s');
      res.status(200).json({user:{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user.profile,
        otpVerify:user.otpVerify,
    },accessToken:token,refreshToken:refresh})
  } catch (error) {
    const errors = handleErrors(error);
    
    res.status(400).json({ errors });
  }
 }
