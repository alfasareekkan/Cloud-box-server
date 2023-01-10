import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import verifyJWT from "./middleware/verifyJWT";
import folderRouter from "./routes/folderRoute";
import fileRouter from "./routes/fileRoutes"
import amqp, { Channel } from "amqplib/callback_api";
import User from "./model/User";
import createMQConsumer, { amqbConnection } from "./utils/consummer";

dotenv.config();
export const consumer = createMQConsumer(
  process.env.RABITMQURI,
  process.env.RABITQUEUE
);
const app = express();
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN
}));  
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
const port = process.env.PORT;
app.use(verifyJWT)
app.use('/', folderRouter);
app.use('/files', fileRouter);
// consumer();
mongoose.connect(process.env.DATABASE, {
  // strictQuery:false,
}).then(() => {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
});
// process.on('beforeExit', () => {
//   console.log('closing connection');
//   amqbConnection.close()
// })
