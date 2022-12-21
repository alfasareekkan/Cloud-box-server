import mongoose, { model, Schema, Types } from "mongoose";

export interface IFolder{
    folderName: string;
    parentFolderId?: Types.ObjectId;
    userId: Types.ObjectId;
    recordStatus: number,
    folderLevel:number
    
}

const folderSchema = new Schema<IFolder>({
    folderName: {
        type: String,
        required: true,
    },
    parentFolderId: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId
       
    },
    recordStatus: {
        type: Number,
        default: 0,
        required:true
    },
    folderLevel: {
        type:Number,
    }

}, { timestamps: true })

const Folder = model<IFolder>('Folder', folderSchema)
export default Folder