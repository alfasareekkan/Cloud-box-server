import mongoose, { Schema, Types } from "mongoose";

interface Folder{
    folderName: string;
    parentFolderId: Types.ObjectId | undefined;
    userId: Types.ObjectId;
    recordStatus: Number,
    
}

const folderSchema = new Schema<Folder>({
    folderName: {
        type: String,
        required: true,
    },
    parentFolderId: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required:true,
    },
    recordStatus: {
        type: Number,
        default: 0,
        required:true
    }

},{timestamps:true})