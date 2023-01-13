import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { hash } from "bcrypt";

import User from "../model/User";

const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
})
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const getUserDetails = async (req: Request, res: Response) => {
    const userId = req.headers.userId;
    try {
        const user = await User.findById(userId, { firstName: 1, lastName: 1, email: 1, _id: 0 ,profile:1})
        res.status(200).json(user);
    
    } catch (error:any) {
        res.status(404).json({message: error.message})
    }
   
 
    
    
}

export const sendOtp = async(req: Request, res: Response) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    try {
        const hashedOtp = await hash(otp.toString(), 10);
        const user = await User.updateOne({ email: req.body.email, _id: req.headers.userId },{$set:{otp:hashedOtp}})
        if (user.modifiedCount === 1) {
            
        }
        

    } catch (error) {
        
    }
    

    // const mailOptions: MailOptions = {
    //     from: '"Your Name" <your-email@gmail.com>',
    //     to: 'recipient-email@example.com',
    //     subject: 'Hello',
    //     text: 'Hello World',
    //     html: '<b>Hello World</b>'
    // };
    
}