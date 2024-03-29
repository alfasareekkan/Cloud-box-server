import { Schema, model, connect, ObjectId,Model } from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcrypt';


export interface IUser {
    _id?:ObjectId
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp?: string;
    otpVerify?: boolean;
    profile?:string
    // phoneNumber: number;
}

interface UserModel extends Model<IUser> {
    login(email: string, password: string): IUser;
    findOneUser(email: string): IUser;
    
  }
const userSchema = new Schema<IUser,UserModel>({
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
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true,"Please enter password"],
        minlength:[6,'Minimum password length is 6 characters']
    },
    profile: {
        type:String
    },
    otp: {
        type:String,
    },
    otpVerify: {
        type: Boolean,
        default:false
    }

    // phoneNumber: {
    //     type: Number,
    //     unique: true,
    //     // validate:[validator.isMobilePhone('enter a valid number')] 
    // }
})
  
userSchema.static('login',async function login(email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
    throw Error('incorrect password')
        
    }
    throw Error('incorrect email')
})
userSchema.static('findOneUser', async function findOneUser(email) {
    const user = await this.findOne({ email })
    return user
})
const User = model<IUser,UserModel>('User', userSchema);
export default User;
