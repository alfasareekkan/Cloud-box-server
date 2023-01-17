import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { hash, compare } from "bcrypt";

import User from "../model/User";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});
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
    const user = await User.findById(userId, {
      firstName: 1,
      lastName: 1,
      email: 1,
      _id: 0,
      profile: 1,
      otpVerify: 1,
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const hashedOtp = await hash(otp.toString(), 10);
    const user = await User.updateOne(
      { email: req.body.email, _id: req.headers.userId },
      { $set: { otp: hashedOtp } }
    );
    if (user.modifiedCount === 1) {
      const mailOptions: MailOptions = {
        from: '"Cloud-Box" <cloudboxtechinternational@gmail.com>',
        to: req.body.email,
        subject: "Email Verification",
        text: `Your otp is`,
        html: `<br >
        <h1 style="background:green" >
          ${otp}
      </h1>
      </br>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      });
    }
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const submitOtp = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.headers.userId);

    if (user) {
      const isCheck = await compare(req.body.otp, user.otp);
      if (!isCheck) throw new Error("Incorrect otp");
      user.otpVerify = true;

      await user.save();
      res.status(200).json("success");``
    } else throw new Error("User not found");
  } catch (error: any) {

    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId=req.headers.userId
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        const isCheck = await compare(oldPassword, user.password);
        if (!isCheck) throw new Error("Incorrect password");
        const oldCheck = await compare(newPassword, user.password)
        if (oldCheck) throw new Error("Give another password");
        user.password =await hash(newPassword,10);
        await user.save();
        res.status(200).json("success");
  } catch (error:any) {
      res.status(404).json({message:error.message});
  }
};



export const forgotOtp = async (req: Request, res: Response) => {
  console.log(req.body);
  
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const hashedOtp = await hash(otp.toString(), 10);
    const user = await User.updateOne(
      { email: req.body.email},
      { $set: { otp: hashedOtp } }
    );
    if(user.modifiedCount === 0) throw new Error("Invalid Email")
    if (user.modifiedCount === 1) {
      const mailOptions: MailOptions = {
        from: '"Cloud-Box" <cloudboxtechinternational@gmail.com>',
        to: req.body.email,
        subject: "Email Verification",
        text: `Your otp is`,
        html: `<br >
        <h1 style="background:green" >
          ${otp}
      </h1>
      </br>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).json("success")
      });
    }
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};


export const updateNewPassword = async (req: Request, res: Response) => {
  const { email, password, otp } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error(`User ${email} not found`);
    const isCheck = await compare(otp, user.otp);
    if (!isCheck) throw new Error("OTP in not verified");
    user.password = await hash(password, 10);
    await user.save();
    res.status(200).json("success")
  } catch (error:any) {
    res.status(404).json({message:error.message})
  }
  
}


export const isSubmitOtp = async (req: Request, res: Response)=>{
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error(`User ${email} not found`);
    const isCheck = await compare(otp, user.otp);
    if (!isCheck) throw new Error("Incorrect OTP");
    res.status(200).json("success");


  } catch (error:any) {
    res.status(404).json({ message: error.message });
  }
  
}