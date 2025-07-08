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


dotenv.config({});
dbConnect();
const _dirname = path.resolve()
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "https://code-1st-healthcare.onrender.com",
    credentials: true
}));

// API Routes
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/employee', employeeRoute);
app.use('/api/v1/attendance', attendanceRoute);
app.use('/api/v1/leave', leaveRoute);

// Serve static frontend
app.use(express.static(path.resolve(_dirname, "frontend/dist")));

app.get(/^\/(?!api).*/, (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server is running at PORT:", PORT);
});
