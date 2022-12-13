import express from 'express';
import dotenv from 'dotenv';
import folderRouter from './routes/folderRoute';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();

dotenv.config()
const port = process.env.PORT;
app.use(cors())
app.use('/',folderRouter);

mongoose.connect(process.env.DATABASE).then(() => {
    
    app.listen(port, () => {
      return console.log(`Express is listening at http://localhost:${port}`);
    });
})