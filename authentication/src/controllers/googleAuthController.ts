import { Request, Response } from "express"
import { decode, JwtPayload } from "jsonwebtoken"
import {hash} from "bcrypt"
import User from "../model/User";
import { createToken } from "./authController";


const jwtDecode = (token: string):JwtPayload=> {
    const userInfo: JwtPayload | string = decode(token);
    if (typeof userInfo !== "string") {
      return userInfo
    } else {
      const userObject = JSON.parse(userInfo);
      return userObject
    }
};



export const googleSignUp = async (req: Request, res: Response) => {
    try {
        const payload = jwtDecode(req.body.credentials)
    const password = payload.email + process.env.REFRESH_TOKEN_SECRET
    
        const hashPassword =await hash(password,20)
        

    const user = await User.findOne({ email: payload.email })
    if (!user) {
        const result=await User.create({
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            profile: payload.picture,
            password: hashPassword
            
        })
        const token = createToken(result)
        console.log(token,"😒😒");
        
        res.status(201).json({ user: result, accessToken:token });
    }
    } catch (error) {
        console.log(error);
        
    }
    
    
    
    
}