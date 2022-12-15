import express from "express";
import dotenv from "dotenv";
import folderRouter from "./routes/folderRoute";
import cors from "cors";
import mongoose from "mongoose";
import amqp, { Channel } from "amqplib/callback_api";
import User from "./model/User";
import createMQConsumer,{amqbConnection} from "./utils/consummer";
dotenv.config();
export const consumer = createMQConsumer(
  process.env.RABITMQURI,
  process.env.RABITQUEUE
);
const app = express();
app.use(express.json());

const port = process.env.PORT;
app.use(cors());
app.use("/", folderRouter);
consumer();
mongoose.connect(process.env.DATABASE).then(() => {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
});
process.on('beforeExit', () => {
  console.log('closing connection');
  amqbConnection.close()
})
