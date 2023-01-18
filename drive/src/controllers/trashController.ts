import { Request, Response } from "express"
import File from "../model/File";


export const getAllFiles = async(req: Request, res: Response) => {
    // console.log(req.headers.userId);
    const userId = req.headers.userId;
    try {
        const files = await File.find({ userId, recordStatus: 3 });
        res.status(200).json(files);
        
    } catch (error) {
        
    }
    
}