import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { urlencoded } from "express";
import authRoute from "./routes/authRoute";
import refresh from "./routes/refresh";
import  amqp,{Channel} from "amqplib/callback_api";
dotenv.config();
export let ch : Channel

export interface ProcessEnv {
    [key: string]: string | undefined;
  }
mongoose.connect(process.env.DATABASE).then(() => {
  
  amqp.connect(
    process.env.RABITMQURI,
    (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1:any, channel:Channel) => {
        if (error1) throw error1;
        ch=channel

        const app = express();
        app.use(express.json());
        app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
        

        app.use("/", authRoute);
          app.use("/refresh", refresh);
          app.listen(4000, () => {
            console.log('listening on port 4000');
          })
          process.on('beforeExit', () => {
              console.log('closing connection');
              connection.close()
              
          })
      });
    }
  );
});
