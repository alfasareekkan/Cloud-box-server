import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import User, { IUser } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ProcessEnv,ch } from "../index";


dotenv.config();

const JWTKEY: string | undefined = process.env.JWTKEY;

const handleErrors = (err: any) => {
  console.log(err.message);
  // err.code is for duplicate exists
  interface errorType {
    email:string,password:string
  }
  const error : errorType = { email: "", password: "", };
  if (err.code === 11000) {
    error.email = "email already in use";
    return error;
  }
  if (err.message.includes("User validation failed")) {
    // to take values only form object
    Object.values(err.errors).forEach(({ properties }: any) => {
      console.log(err.errors);
      
      // error[properties.path]= properties.message;
    });
  }
  if (err.message === "incorrect email") {
    error.email = "that email not registered";
  }
  if (err.message === "incorrect password") {
    error.password = "that password is incorrect";
  }
  return error;
};

const createToken = (result:IUser) => {
  if (JWTKEY) {
    return jwt.sign(
      {
        UserInfo: {
          username: result.email,
          id: result._id,
        },
      },
      JWTKEY,
      { expiresIn: "10s" }
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
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    const result: resultType = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPwd,
    });
    const user=await result.save()
    ch.sendToQueue('user_created',Buffer.from(JSON.stringify(user)))
    const token = createToken(result);

    res.status(201).json({ user: result, accessToken:token });
  } catch (err: any) {
    const errors = handleErrors(err);

    res.status(500).json({ errors});
  }
};

export const loginPost = async (req: Request, res: Response) => {
  // console.log(req.body,"login ");
  const cookies =  req.cookies;
  console.log(cookies);
  const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ email: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    let newRefreshToken=''
    let accessToken

        // create JWTs
      if (JWTKEY) {
        accessToken = jwt.sign(
          {
              UserInfo: {
                  username: foundUser.email,
                    id: foundUser._id,
                  
              }
          },
          JWTKEY,
          { expiresIn: '10s' }
        );
         newRefreshToken = jwt.sign(
          { "username": foundUser.email },
          JWTKEY,
          { expiresIn: '15s' }
      );
      }

     const  UserRefreshToken:string[] | undefined= foundUser?.refreshToken
      
      let newRefreshTokenArray: string[]| undefined =
            !cookies?.jwt
                ? foundUser?.refreshToken
          : UserRefreshToken?.filter(rt => rt !== cookies.jwt); 
           // eslint-disable-next-line no-var
           var tokenStatus=true
        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [] ;
            }
            tokenStatus=false
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        }
        
      if (newRefreshTokenArray) {
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      }
      const result = await foundUser.save();
    if (typeof newRefreshToken==='string') {
      res.json({ accessToken ,newRefreshToken,user:foundUser.email,tokenStatus});
     }

        

  } else {
        res.sendStatus(401);
      }
  }

  
;
