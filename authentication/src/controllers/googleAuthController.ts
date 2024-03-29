import { Request, Response } from "express"
import { decode, JwtPayload } from "jsonwebtoken"
import {hash,compare} from "bcrypt"
import User from "../model/User";
import { createToken,handleErrors } from "./authController";


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
    
    
    
    const user = await User.findOne({ email: payload.email })
    if (!user) {
        const hashPassword =await hash(password,20)
        const result=await User.create({
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            profile: payload.picture,
            password: hashPassword
            
        })
        const token = createToken(result,'15s')
    const refresh = createToken(user,'15s')
        
        res.status(201).json({ user:{
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            profile: result.profile,
            otpVerify: result.otpVerify,
        },  accessToken:token,refreshToken:refresh });
        }
        if (user) {
            const match = compare(password, user.password)
            if (match) {

                const token = createToken(user,'7d');
    const refresh = createToken(user,'15s')
                
                res.status(201).json({ user:{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profile: user.profile,
                    otpVerify:user.otpVerify
                }, accessToken:token,refreshToken:refresh})
            } else {
                res.status(401)
            }
        }
    } catch (error) {
        console.log(error);
        
        const err = handleErrors(error)
        res.status(401).json({err})
    }
    
    
    
    
}