import { Request, Response } from "express";
import { uploadFile} from "../utils/awsS3Bucket";

export const isFileUpload = async (req: Request, res: Response) => {
    try {
        let uni8Array:Array<number> =Object.values(req.body.fileContents)
        const buffer = Buffer.from(uni8Array);
        
        
    // let a = JSON.parse(req.body)
    // console.log(a.fileContents);
    
        // let re = await uploadFile(buffer, req.body.fileName)
        // console.log(re);
        

    } catch (error) {
        console.log(error); 
        
    }

    
    
}