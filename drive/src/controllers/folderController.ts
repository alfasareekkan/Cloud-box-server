import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Folder, { IFolder } from "../model/Folder";
import File from "../model/File";
import mongoose, { Schema, Types } from "mongoose";
import User from "../model/User";
import Share from "../model/Share";


const jwtDecode = (token: string): Types.ObjectId => {
  let userInfo: JwtPayload | string = jwt.decode(token);
  if (typeof userInfo !== "string") {
    let id = userInfo.UserInfo.id;
    return id;
  } else {
    let userObject = JSON.parse(userInfo);
    return userObject.UserInfo.id;
  }
};

export const isCreateFolder = async (req: Request, res: Response) => {
  const { userId, folderName, folderId, level } = req.body;

  try {
    let user = jwtDecode(req.body.userId);
    if (level === 1) {

      let folder = await Folder.create({
        userId: user,
        folderLevel: level,
        folderName,
      });
      res.status(200).json(folder);
    } else {
      let folder = await Folder.create({
        userId: user,
        folderLevel: level,
        folderName,
        parentFolderId: folderId,
      });
      res.status(200).json(folder);
    }
  } catch (error) {
    console.log(error);
  }
};

export const isGetFolder = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let folder: IFolder = await Folder.findById(req.body.folderId);
    console.log(folder);

    res.status(200).json(folder);
  } catch (error) {
    console.log(error);
  }
};

export const getAllFolders = async (req: Request, res: Response) => {
  const { user, level, folderId } = req.body;

  try {
    let userId = jwtDecode(user);
    if (!folderId && level === 1) {
      let folders = await Folder.find({ userId: userId, folderLevel: 1 });
      let files = await File.find({ userId, folderLevel: level, recordStatus: 0 })

      

      res.status(200).json({ folders ,files});
    } else if (folderId && level !== 1) {
      let folders = await Folder.find({
        userId: userId,
        parentFolderId: folderId,
        recordStatus:0
      });
      console.log(folders);
      let files = await File.find({ userId, parentFolderId: folderId, recordStatus: 0 })

      

      res.status(200).json({ folders ,files});
    }
  } catch (error) {}
};

export const isUserShareFolder = async (req: Request, res: Response) => {
  
  try {
    const user = await User.findOne({ email: req.body.email })
  console.log(user);
    if (!user) return res.sendStatus(404)
    const userShare = await Share.findOne({ userId: user._id })
    if (!userShare) {
      let shareArray=[req.body.folderId]
      let share = await Share.create({ userId: user._id, shares: shareArray })
      console.log(share);
      
    } else {
      userShare.shares.push(req.body.folderId);
      let er = await userShare.save()
      
      res.status(200).json("success")
      
    }
  } catch (error) {
    
  }
  
  
  
}
