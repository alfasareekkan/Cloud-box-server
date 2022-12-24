import express from "express";
import dotenv from "dotenv";
import folderRouter from "./routes/folderRoute";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import amqp, { Channel } from "amqplib/callback_api";
import User from "./model/User";
import createMQConsumer,{amqbConnection} from "./utils/consummer";
dotenv.config();
export const consumer = createMQConsumer(
  process.env.RABITMQURI,
  process.env.RABITQUEUE
);
const app = express();
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));  
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
const port = process.env.PORT;
app.use('/', folderRouter);
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
