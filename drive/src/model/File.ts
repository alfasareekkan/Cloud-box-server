import { Schema, model, Types } from "mongoose";

export interface IFile{
    fileName: string;
    fileType: string;
    parentFolderId?: Types.ObjectId;
    userId: Types.ObjectId;
    recordStatus: number;
    folderLevel: number;
    fileHash: string;
    fileSize: number;
    AWSEtag: string;
    AWSLocation: string;
    AWSKey: string;
    AWSBucket: string;
    cludinaryUrl: string;

}

const fileSchema = new Schema<IFile>({
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    parentFolderId: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    recordStatus: {
        type: Number,
        default: 0,
    },
    folderLevel: {
        type: Number,
        default:0,
    },
    fileHash: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required:true,
    },
    AWSEtag: {
        type: String,
    },
    AWSLocation: {
        type: String,
    },
    AWSKey: {
        type: String,
    },
    AWSBucket: {
        type: String,
    },
    cludinaryUrl: {
        type: String,  
    }
}, { timestamps: true })

const File = model<IFile>('file', fileSchema);
export default File;