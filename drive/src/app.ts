import express from "express";
import dotenv from "dotenv";
import folderRouter from "./routes/folderRoute";
import cors from "cors";
import mongoose from "mongoose";
import amqp, { Channel } from "amqplib/callback_api";
import User from './model/User'
dotenv.config();

mongoose.connect(process.env.DATABASE).then(() => {
  amqp.connect(
    process.env.RABITMQURI,
    (error0, connection) => {
      if (error0) throw error0;
      connection.createChannel((error1:any, channel:Channel) => {
        if (error1) throw error1;
        channel.assertQueue('user_created',{durable:true})
        const app = express();
        app.use(express.json());
        
        const port = process.env.PORT;
        app.use(cors());
        app.use("/", folderRouter);
        channel.consume('user_created', async(msg) => {
          const eventUser=JSON.parse(msg.content.toString())
          const user=await User.create({
            userId: eventUser._id,
            firstName: eventUser.firstName,
            lastName: eventUser.lastName,
            email: eventUser.email,
            password: eventUser.password,
            refreshToken:eventUser.refreshToken
          })
          console.log(user);
        },{noAck:true})
        app.listen(port, () => {
          return console.log(
            `Express is listening at http://localhost:${port}`
          );
        });
      });
    }
  );
});
