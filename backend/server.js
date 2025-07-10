import express from 'express';
import adminRoute from './routes/admin.route.js';
import cors from 'cors';
import employeeRoute from './routes/employee.route.js';
import attendanceRoute from './routes/attendance.route.js';
import leaveRoute from './routes/leave.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import pool from './utils/dbConnect.js';
//no need for dotenv here , dbConnect sbse pehle run hori
// import dotenv from 'dotenv';
// dotenv.config();

// dbConnect();
const _dirname = path.resolve()
const app = express();
const PORT = process.env.PORT || 8080;

(async () => {
    try {
      await pool.query('SELECT 1');
      console.log('✅ MySQL connected');
    } catch (err) {
      console.error('❌ Failed to connect to DB:', err.message);
      process.exit(1);
    }
  })();

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
app.use(express.static(path.resolve(_dirname, "frontend/dist")));

app.get(/^\/(?!api).*/, (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server is running at PORT:", PORT);
});
