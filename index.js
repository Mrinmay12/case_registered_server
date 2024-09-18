
import express from 'express';
import cors from 'cors'
import bodyParser from "body-parser";
import connectDB from './DatabaseConnection/Database.js';
import UserRoutes from "./Routes/UserRoutes.js"
import PostRoutes from "./Routes/PostRoutes.js"
import { exportDataToCSV } from './Helpers/CronJob.js';
import cron from 'node-cron';
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;;


const app = express(); 

app.use(bodyParser.urlencoded({extended:true}))
// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });


  app.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome ....' });
});
// Routes
app.use(UserRoutes)
app.use(PostRoutes)

cron.schedule('0 */3 * * *', () => {
  console.log('Cron job started: Exporting data to CSV...');
  exportDataToCSV();
});     

 
const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
  }
};

start();

 app.listen(PORT, () => {
    console.log("Server is running on Port " + PORT);
  });
  
 