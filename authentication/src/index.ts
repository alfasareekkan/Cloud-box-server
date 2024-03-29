import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/authRoute";
// import refresh from "./routes/refresh";
import userRouter from "./routes/userRouter";
// import createMQProducer,{amqbConnection} from "./utils/producer";
dotenv.config();
// export const producer=createMQProducer(process.env.RABITMQURI,process.env.RABITQUEUE)
export interface ProcessEnv {
    [key: string]: string | undefined;
  }
  
  
        const app = express();
        app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN
}));
   
app.use("/", authRoute);
app.use("/user",userRouter)
      mongoose.connect(process.env.DATABASE).then(() => {
          app.listen(4000, () => {
            console.log('listening on port 4000');
          })
          // process.on('beforeExit', () => {
          //     console.log('closing connection');
          //     amqbConnection.close()
          // })
      });