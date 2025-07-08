import express from 'express';
import dbConnect from './utils/dbConnect.js';
import dotenv from 'dotenv';
import adminRoute from './routes/admin.route.js';
import cors from 'cors';
import employeeRoute from './routes/employee.route.js';
import attendanceRoute from './routes/attendance.route.js';
import leaveRoute from './routes/leave.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({});
dbConnect();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// API Routes
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/employee', employeeRoute);
app.use('/api/v1/attendance', attendanceRoute);
app.use('/api/v1/leave', leaveRoute);

// Serve static frontend
app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

app.get(/^\/(?!api).*/, (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server is running at PORT:", PORT);
});
