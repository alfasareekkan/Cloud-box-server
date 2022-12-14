import { Schema, model, ObjectId ,Types} from 'mongoose';


export interface IUser {
    _id?: ObjectId
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken?:string[] |undefined
    // phoneNumber: number;
}

// interface UserModel extends Model<IUser> {
//     save(result: resultType): unknown;
//     login(email:string,password:string): IUser;
//   }
const userSchema = new Schema<IUser>({
    userId: {
        type:Schema.Types.ObjectId
    },
    firstName: {
        type: String,
        required: true,
        
    },
    lastName: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: [true,"Please enter an email"],
        
    },
    password: {
        type: String,
        required: [true,"Please enter password"],
    },
    refreshToken: [String]
})

const User = model<IUser>('User', userSchema);
export default User;
