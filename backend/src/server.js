import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from './lib/db.js';
import { app, server } from './lib/socket.js';
import routes from './routes/index.js';

// const app = express();

const port = process.env.PORT;
const __dirname = path.resolve();
const frontendOrigin = process.env.FRONTEND_URL.split(',')[0]
// console.log('origin = ', frontendOrigin.split(',')[0])
app.use(
    cors({
        origin: frontendOrigin,
        credentials: true
    })
)

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDb().then(() => {
    server.listen(port, () =>{
        console.log(`server is running on http://localhost:${port}`)
    })
})
