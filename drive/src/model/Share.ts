import mongoose, { model, Schema, Types } from "mongoose";

export interface IShare{
    userId: Types.ObjectId;
    shares: Types.Array<Types.ObjectId>
}

const shareSchema = new Schema<IShare>({
    userId: {
        
        type:Schema.Types.ObjectId,
    },
    shares: {
        type:[Schema.Types.ObjectId]
    }
})

const Share = model<IShare>('share', shareSchema)
export default Share;