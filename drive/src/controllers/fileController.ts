import { Request, Response } from "express";
import { createHash } from "crypto"
import {PDFImage} from 'pdf-image'
import { uploadFile } from "../utils/awsS3Bucket";
import Folder from "./../model/Folder"
import cloudinary from "../utils/cloudinary";

export const isFileUpload = async (req: Request, res: Response) => {
    const { fileContents, previewImage } = req.body;

    
    try {
        const uni8Array: Array<number> = Object.values(fileContents)
        const hash = createHash('sha256');
        // hash.update(fileContents)
        // const fileHash=hash.digest('hex');
      let p=await  cloudinary.uploader.upload(previewImage, 
            { 
                folder: "PreviewImages",
                width: 150,
                crop: "scale",
            },
        )
        console.log(p);
        
        const buffer = Buffer.from(uni8Array);
    
        
        const previewBuffer = Buffer.from(previewImage)
        // console.log(previewBuffer);
        
        const a = buffer.toString()
        

        
        
    // let a = JSON.parse(req.body)
    // console.log(a.fileContents);
    
        // let re = await uploadFile(previewImage ,req.body.fileName )
        // console.log(re);
        

    } catch (error) {
        console.log(error); 
        
    }

    
    
}