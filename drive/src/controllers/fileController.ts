import { Request, Response } from "express";
import crypto, { createHash } from "crypto";
import {Types} from "mongoose";
import { uploadFile, getFile } from "../utils/awsS3Bucket";
import Folder from "./../model/Folder"
import File from "./../model/File";
import cloudinary from "../utils/cloudinary";

export const isFileUpload = async (req: Request, res: Response) => {
    const {
        fileContents,
        previewImage,
        fileHash,
        // enc,
        folderId, level, fileName, fileSize,
        fileType,} = req.body;
const userId=req.headers.userId
    console.log(userId,'💕💕',"😒😒",folderId,"🐉🐉",level);
    
    try {
// console.log(enc);

        const uni8Array: Array<number> = Object.values(fileContents)
        const buffer = Buffer.from(uni8Array);
        const hash = createHash('sha256');
        hash.update(buffer)
        console.log(buffer);
        
        const fileHash2 = hash.digest('hex');
        if (fileHash2 === fileHash) {
            console.log(fileHash2);
            
            let isFileExist = await File.findOne({ userId, parentFolderId: folderId, fileName,folderLevel:level })
            console.log(isFileExist);
            
            if (isFileExist) res.sendStatus(409)
            
              let previewImageData=await  cloudinary.uploader.upload(previewImage, 
                    { 
                        folder: "PreviewImages",
                        width: 150,
                        crop: "scale",
                    },
            )
    
            
            let s3Result = await uploadFile(buffer, req.body.fileName)
            
            
          let file= await File.create({
              userId,
              parentFolderId: folderId,
              fileName,
              folderLevel: level,
              fileSize,
              fileType,
              fileHash: fileHash2,
              cludinaryUrl: previewImageData.secure_url,
              AWSBucket: s3Result.Bucket,
              AWSKey: s3Result.Key,
              AWSEtag: s3Result.ETag,
              AWSLocation:s3Result.Location
              
          })
            console.log(file);
            
            res.status(200).json(file);
            

        } else {
            res.sendStatus(406)
         }
        
    // const previewBuffer = Buffer.from(previewImage)

      

    //     console.log(previewBuffer);
        
    //     const a = buffer.toString()
        

        
        
  
    
     
        

    } catch (error) {
        console.log(error); 
        
    }

    
    
}

export const getFileSize = async (req: Request, res: Response) => {
    let userId = req.headers.userId;
    if(typeof userId === 'string')
try {
    let fileSize=await File.aggregate([{
        $match: {
         userId:new Types.ObjectId(userId),
         recordStatus: {
          $lte: 2
         }
        }
       }, {
        $group: {
         _id: null,
         fileSize: {
          $sum: '$fileSize'
         }
        }
        }])
  res.status(200).json({fileSize:fileSize[0].fileSize})
  
} catch (error) {
    console.log(error);
    
}
 
}

export const isGetFile =async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        let data=await getFile(req.body.key)
        res.json({url:data})
    } catch (error) {
        console.log(error);
        
    }
}