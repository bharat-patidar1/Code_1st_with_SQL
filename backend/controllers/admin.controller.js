import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from "moment";
import { attendance_findByDateWithEmployee, attendance_findWorkByDates } from "../services/attendance.services.js";
import { admin_findOne , admin_create , admin_findOneByEmail , admin_findOneAndUpdatePassword } from "../services/admin.services.js";
import { employee_findAll, employee_findAllName } from "../services/employee.services.js";
export const adminRegister = async (req, res) => {
    try {

        const adminExists = await admin_findOne();
        if (adminExists) {
            return res.status(401).json({
                success: false,
                message: "Admin already exists"
            })
        }

        const { name, email, phoneNumber, password, role } = req.body;
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const hashedPass = await bcrypt.hash(password, 10)

       const admin =  await admin_create({
            name, email, phoneNumber, password: hashedPass, role
        })
        res.status(201).json({
            success: true,
            message: "Admin registered Successfully",
            admin
        })

    } catch (error) {
        console.log(error)
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }
        const admin = await admin_findOneByEmail({email});
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or Admin not found"
            })
        }
        const isPassMatch = await bcrypt.compare(password, admin.password)
        if (!isPassMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }
        const tokenData = {
            adminId: admin._id,
            role: "Admin"
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict'
        }).json({
            success: true,
            message: `Welcome ${admin.name}`
        })
    } catch (error) {
        console.log(error)
    }
}

export const adminLogout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getWorkHours = async (req, res) => {
    try {
        const { view } = req.query;
        const isDaily = view === "daily";

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to start of today

        const startDate = new Date(today);
        if (!isDaily) {
            // Weekly: get past 7 days (including today)
            startDate.setDate(today.getDate() - 6);
        }

        const startDateStr = startDate.toISOString().split("T")[0];
        const todayStr = today.toISOString().split("T")[0];

        // Fetch attendance entries within date range
        const attendanceRecords = await attendance_findWorkByDates({
            date: {startDateStr , todayStr },
        })

        // Group total hours by employee
        const workMap = new Map();
        for (const record of attendanceRecords) {
            const empId = record.employee._id.toString();
            const name = record.employee.name;
            const prev = workMap.get(empId) || { name, hours: 0 };

            prev.hours += record.totalHoursToday || 0;

            workMap.set(empId, prev);
        }

        // Ensure all employees are listed (even if they have 0 hours)
        const allEmployees = await employee_findAllName();

        const result = allEmployees.map((emp) => {
            const data = workMap.get(emp._id.toString());
            return {
                _id: emp._id,
                name: emp.name,
                hours: data ? parseFloat(data.hours.toFixed(2)) : 0, // ✅ consistent Number output
            };
        });

        return res.status(200).json({
            success: true,
            employees: result,
        });
    } catch (error) {
        console.error("Error in getWorkHours:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch work hours",
        });
    }
};

export const getAttendanceSummary = async (req, res) => {
    try {
        const { view = "daily", date } = req.query;

        const allEmployees = await employee_findAll();
        const totalEmployees = allEmployees.length;

        if (view === "daily") {
            if (!date) {
                return res.status(400).json({ success: false, message: "Date is required for daily view." });
            }

            const attendanceDocs = await attendance_findByDateWithEmployee(date);
            const presentEmployees = attendanceDocs.map((att) => ({
                _id: att.employee._id,
                name: att.employee.name,
            }));
            const presentIds = new Set(attendanceDocs.map(att => att.employee.toString()));
            const absentEmployees = allEmployees
                .filter((emp) => !presentIds.has(emp._id.toString()))
                .map((emp) => ({
                    _id: emp._id,
                    name: emp.name,
                }));

            return res.status(200).json({
                success: true,
                view: "daily",
                date,
                totalEmployees,
                present: presentIds.size,
                absent: totalEmployees - presentIds.size,
                presentEmployees,
                absentEmployees
            });

        } else if (view === "weekly") {
            const weekData = [];

            for (let i = 6; i >= 0; i--) {
                const day = moment().subtract(i, 'days').format("YYYY-MM-DD");

                const attendanceDocs = await attendance_findByDateWithEmployee({date : day});

                const presentEmployees = attendanceDocs.map((att) => ({
                    _id: att.employee._id,
                    name: att.employee.name,
                }));

                const presentIds = new Set(attendanceDocs.map(att => att.employee._id.toString()));

                const absentEmployees = allEmployees
                    .filter(emp => !presentIds.has(emp._id.toString()))
                    .map(emp => ({
                        _id: emp._id,
                        name: emp.name,
                    }));

                weekData.push({
                    date: day,
                    present: presentEmployees.length,
                    absent: absentEmployees.length,
                    presentEmployees,
                    absentEmployees
                });
            }

            return res.status(200).json({
                success: true,
                view: "weekly",
                totalEmployees,
                present: weekData.reduce((sum, day) => sum + day.present, 0),
                absent: weekData.reduce((sum, day) => sum + day.absent, 0),
                data: weekData
            });
        }

        return res.status(400).json({ success: false, message: "Invalid view type" });

    } catch (error) {
        console.error("Attendance summary error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;
        if (!email || !password || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }
        const admin = await admin_findOneByEmail({email});
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email"
            })
        }
        const isPassMatch = await bcrypt.compare(password, admin.password);
        if (!isPassMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }
        const newHashPass = await bcrypt.hash(newPassword, 10);
        const updatedAdmin = await admin_findOneAndUpdatePassword({password : newHashPass , email});
        return res.status(200).json({
            success: true,
            admin: updatedAdmin,
            message: "Password updated Successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update password", success: false })
    }
}