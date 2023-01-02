import { Request, Response } from "express";
import crypto,{ createHash } from "crypto"
import {PDFImage} from 'pdf-image'
import { uploadFile } from "../utils/awsS3Bucket";
import Folder from "./../model/Folder"
import File from "./../model/File";
import cloudinary from "../utils/cloudinary";

export const isFileUpload = async (req: Request, res: Response) => {
    const { fileContents, previewImage,fileHash,userId ,folderId,level,fileName,fileSize,
        fileType,} = req.body;

    console.log(userId,'💕💕',"😒😒",folderId,"🐉🐉",level);
    
    try {
        const uni8Array: Array<number> = Object.values(fileContents)
        const buffer = Buffer.from(uni8Array);
        const hash = createHash('sha256');
        hash.update(buffer)
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
            console.log(previewImageData);
            
            let s3Result = await uploadFile(buffer, req.body.fileName)
            console.log(s3Result);
            
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
            res.status(200).json(file);
            

        } else {
            res.sendStatus(406)
         }
        
    // const previewBuffer = Buffer.from(previewImage)

      

        // console.log(previewBuffer);
        
        // const a = buffer.toString()
        

        
        
    // let a = JSON.parse(req.body)
    // console.log(a.fileContents);
    
     
        

    } catch (error) {
        console.log(error); 
        
    }

    
    
}