import express,{Request} from 'express';
import cors from "cors";
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { urlencoded } from 'express';
import authRoute from './routes/authRoute'
import refresh from './routes/refresh'

dotenv.config()

const app = express();
app.use(express.json())
app.use(cors({credentials:true,origin:'http://127.0.0.1:5173'}))
export interface ProcessEnv {
    [key: string]: string | undefined
}
    


app.use('/', authRoute)
app.use('/refresh',refresh);

// app.use('/',users)

mongoose.connect(process.env.DATABASE)
    .then(() => {
        app.listen(4000, () => {
            console.log('listening on port 4000');
            
        })
})

