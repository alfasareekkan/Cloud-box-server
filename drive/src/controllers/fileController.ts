import { Request, Response } from "express";
import crypto, { createHash } from "crypto";
import {Types} from "mongoose";
import { uploadFile, getFile } from "../utils/awsS3Bucket";
import Folder from "./../model/Folder"
import Share from "../model/Share";
import File from "./../model/File";
import cloudinary from "../utils/cloudinary";

export const isFileUpload = async (req: Request, res: Response) => {
    const {
        fileContents,
        previewImage,
        // enc,
        folderId, level, fileName, fileSize,
        fileType,} = req.body;
     const userId=req.headers.userId
    
    try {
// console.log(enc);

        // const uni8Array: Array<number> = Object.values(fileContents)
        // const buffer = Buffer.from(uni8Array);
        // const hash = createHash('sha256');
        // hash.update(buffer)
        // console.log(buffer);
        
        // const fileHash2 = hash.digest('hex');
        // if (fileHash2 === fileHash) {
            // console.log(fileHash2);
            
            let isFileExist = await File.findOne({ userId, parentFolderId: folderId, fileName,folderLevel:level })
            if (isFileExist) res.sendStatus(409)
            
              let previewImageData=await  cloudinary.uploader.upload(previewImage, 
                    { 
                        folder: "PreviewImages",
                        width: 150,
                        crop: "scale",
                    },
            )
    
            
            // let s3Result = await uploadFile(buffer, req.body.fileName)
            
            
          let file= await File.create({
              userId,
              parentFolderId: folderId,
              fileName,
              folderLevel: level,
              fileSize,
              fileType,
              // fileHash: fileHash2,
              cludinaryUrl: previewImageData.secure_url,
              AWSBucket: fileContents.Bucket,
              AWSKey: fileContents.Key,
              AWSEtag: fileContents.ETag,
              AWSLocation:fileContents.Location
              
          })
            console.log(file);
            
            res.status(200).json(file);
            

  // } 
        // else {
        //     res.sendStatus(406)
        //  }
     

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
   
    
}
 
}

export const isGetFile =async (req: Request, res: Response) => {
    try {
        let data = await getFile(req.body.key)
        res.json({url:data})
    } catch (error) {
        console.log(error);
        
    }
}

export const iGetSharedWithMe =async (req:Request, res:Response) => {
    let userId = req.headers.userId;
    if (typeof userId === 'string')
        try {
            let result= await Share.aggregate([
                {
                  '$match': {
                    'userId': new Types.ObjectId(userId)
                  }
                }, {
                  '$lookup': {
                    'from': 'files', 
                    'localField': 'shares', 
                    'foreignField': '_id', 
                    'as': 'res'
                  }
                }, {
                  '$project': {
                    'res': 1, 
                    '_id': 0
                  }
                }, {
                  '$unwind': {
                    'path': '$res'
                  }
                }, {
                  '$replaceRoot': {
                    'newRoot': '$res'
                  }
                }
            ])
            res.status(200).json(result)
            
        } catch (error) {
            res.sendStatus(404)
        }
}

export const getAllFiles = async(req: Request, res: Response) => {
    let userId = req.headers.userId;
    if (typeof userId === 'string')
    try {
        const result = await File.aggregate([{
            $match: {
             userId:new Types.ObjectId(userId),
             recordStatus: {
              $lte: 2
             }
            }
        }])
        res.status(200).json(result)
    } catch (error) {
        res.sendStatus(404)                
    }
}